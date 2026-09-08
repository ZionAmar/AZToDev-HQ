/**
 * EMET Company Runtime — power ON continues from last checkpoint; OFF freezes exactly here.
 *
 * Usage:
 *   node runtime/emet.mjs on
 *   node runtime/emet.mjs off
 *   node runtime/emet.mjs status
 *   node runtime/emet.mjs            # same as on (foreground)
 */
import "./lib/windows-hide.mjs";
import http from "http";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import {
  ROOT,
  STATUS_PATH,
  PID_PATH,
  STATE_PATH,
  ensureRuntimeDirs,
  readJson,
  writeJson,
  nowIso,
  journal,
} from "./lib/paths.mjs";

/** Load .env from company root if present (no dependency). */
function loadDotEnv() {
  try {
    const p = path.join(ROOT, ".env");
    if (!fs.existsSync(p)) return;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    /* ignore */
  }
}
loadDotEnv();
import { saveCheckpoint, loadCheckpoint, getCheckpointMeta } from "./lib/checkpoint.mjs";
import { tick, markPowerOffOnState, pollAndEnqueueTelegram } from "./lib/engine.mjs";
import {
  appendMessage,
  listMessages,
  updateMessage,
  ensureChatDirs,
  listArtifacts,
} from "./lib/chat-store.mjs";
import { routeMessage, readAgentName } from "./lib/router.mjs";
import { runCursorForAgent } from "./lib/cursor-bridge.mjs";
import { buildCursorPrompt } from "./lib/prompt-builder.mjs";
import { artifactDirFor } from "./lib/chat-store.mjs";

const PORT = Number(process.env.PORT || 8787);
const TICK_MS = Number(process.env.EMET_TICK_MS || 5000);
const cmd = (process.argv[2] || "on").toLowerCase();

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".webm": "audio/webm",
  ".wav": "audio/wav",
};

function defaultStatus() {
  return {
    power: "off",
    pid: null,
    port: PORT,
    startedAt: null,
    stoppedAt: null,
    lastTickAt: null,
    heartbeatAt: null,
    cursor: {
      processedIdeas: [],
      processedProblems: [],
      lastTickAt: null,
      resumeNote: "never started",
    },
  };
}

function isPidAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readStatus() {
  ensureRuntimeDirs();
  return { ...defaultStatus(), ...readJson(STATUS_PATH, {}) };
}

function writeStatus(s) {
  writeJson(STATUS_PATH, s);
}

function sendJson(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj, null, 2));
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/** Graceful OFF from inside running process */
function powerOff(reason = "api-off") {
  const status = readStatus();
  status.cursor = status.cursor || defaultStatus().cursor;
  status.cursor.resumeNote = `Stopped at ${nowIso()} — resume will continue from this checkpoint.`;
  writeStatus(status);
  const cp = saveCheckpoint(reason);
  markPowerOffOnState(reason);
  status.power = "off";
  status.stoppedAt = nowIso();
  status.pid = null;
  writeStatus(status);
  journal("power_off", { reason, checkpointAt: cp.savedAt });
  return cp;
}

function powerOnPrepare() {
  ensureRuntimeDirs();
  const meta = getCheckpointMeta();
  let checkpoint = null;
  if (meta.exists) {
    checkpoint = loadCheckpoint();
  }
  const prev = readStatus();
  const status = {
    ...defaultStatus(),
    ...prev,
    power: "on",
    pid: process.pid,
    port: PORT,
    startedAt: nowIso(),
    stoppedAt: null,
    cursor: checkpoint?.cursor || prev.cursor || defaultStatus().cursor,
  };
  status.cursor.resumeNote = meta.exists
    ? `Resumed from checkpoint ${meta.savedAt}`
    : "Started fresh (no prior checkpoint)";
  writeStatus(status);

  const state = readJson(STATE_PATH, {});
  state.power = "on";
  state.updatedAt = nowIso();
  state.runtime = {
    ...(state.runtime || {}),
    startedAt: status.startedAt,
    resumedFromCheckpointAt: checkpoint?.savedAt || null,
    resumeNote: status.cursor.resumeNote,
  };
  // Unpause agents that were frozen
  if (Array.isArray(state.agentsNow)) {
    state.agentsNow = state.agentsNow.map((a) => {
      if (a.status === "paused" && typeof a.doing === "string" && a.doing.startsWith("PAUSED — was: ")) {
        return {
          ...a,
          status: "active",
          doing: a.doing.replace(/^PAUSED — was: /, ""),
        };
      }
      return a;
    });
  }
  writeJson(STATE_PATH, state);
  writeJson(PID_PATH, { pid: process.pid, port: PORT, startedAt: status.startedAt });
  journal("power_on", { resumed: Boolean(checkpoint), checkpointAt: checkpoint?.savedAt || null });
  return { status, checkpoint };
}

function startHttpServer() {
  ensureChatDirs();
  const server = http.createServer(async (req, res) => {
    const url = decodeURIComponent((req.url || "/").split("?")[0]);
    const method = req.method || "GET";

    if (url === "/api/status") {
      return sendJson(res, 200, {
        ...readStatus(),
        checkpoint: getCheckpointMeta(),
        alive: true,
        cursorApiKey: Boolean((process.env.CURSOR_API_KEY || "").trim()),
        parity: {
          llm: Boolean(
            (process.env.CURSOR_API_KEY || "").trim() ||
              (process.env.ANTHROPIC_API_KEY || "").trim() ||
              (process.env.OPENAI_API_KEY || "").trim()
          ),
          telegram: Boolean(
            (process.env.TELEGRAM_BOT_TOKEN || "").trim() &&
              (process.env.TELEGRAM_FOUNDER_CHAT_ID || "").trim()
          ),
          linear: Boolean((process.env.LINEAR_API_KEY || "").trim()),
        },
      });
    }

    if (url === "/api/parity/daily" && method === "POST") {
      const { runDailyMeeting } = await import("./lib/orchestrator.mjs");
      const result = await runDailyMeeting();
      return sendJson(res, 200, result);
    }

    if (url === "/api/parity/eod" && method === "POST") {
      const { sendEndOfDayDigest } = await import("./lib/digest.mjs");
      const result = await sendEndOfDayDigest();
      return sendJson(res, 200, result);
    }

    if (url === "/api/board" && method === "GET") {
      const { readBoard } = await import("./lib/shared-memory.mjs");
      return sendJson(res, 200, readBoard());
    }

    if (url === "/api/chat" && method === "GET") {
      return sendJson(res, 200, { messages: listMessages(300) });
    }

    if (url === "/api/chat" && method === "POST") {
      const body = await readBody(req);
      const text = String(body.text || "").trim();
      if (!text) return sendJson(res, 400, { ok: false, error: "empty text" });

      const route = body.agentId
        ? { agentId: body.agentId, confidence: 1, reason: "forced" }
        : routeMessage(text);
      const agentName = readAgentName(route.agentId);

      const userMsg = appendMessage({
        role: "founder",
        name: "ציון",
        text,
        route,
      });

      const pending = appendMessage({
        role: "system",
        name: "EMET Router",
        text: `מנתב אל **${agentName}** (\`${route.agentId}\`) — ${route.reason}. מתרגם לפרומפט ומריץ ב־Cursor…`,
        parentId: userMsg.id,
        agentId: route.agentId,
        status: "running",
      });

      // Respond immediately; finish Cursor run async
      sendJson(res, 200, {
        ok: true,
        userMessage: userMsg,
        pendingMessage: pending,
        route: { ...route, agentName },
      });

      (async () => {
        try {
          const out = await runCursorForAgent({
            agentId: route.agentId,
            founderText: text,
            messageId: pending.id,
          });
          const artifacts = listArtifacts(pending.id);
          let summary = out.resultText || "";
          try {
            const resultMd = path.join(artifactDirFor(pending.id), "RESULT.md");
            if (fs.existsSync(resultMd)) summary = fs.readFileSync(resultMd, "utf8");
          } catch {}

          updateMessage(pending.id, {
            status: out.status,
            agentId: route.agentId,
            agentName,
            text:
              out.needsApiKey
                ? `⚠️ אין CURSOR_API_KEY — הפרומפט המלא מוכן להרצה ידנית ב־Cursor.\n\n${summary}`
                : `✅ **${agentName}** סיים (status: ${out.status})\n\n${summary}`,
            artifacts,
            promptPath: out.promptPath,
            runId: out.runId || null,
            error: out.error || null,
          });

          appendMessage({
            role: "agent",
            name: agentName,
            agentId: route.agentId,
            text: summary.slice(0, 8000),
            artifacts,
            parentId: userMsg.id,
            status: out.status,
          });
          saveCheckpoint("after-chat-run");
        } catch (err) {
          updateMessage(pending.id, {
            status: "error",
            text: `שגיאה בהרצה: ${String(err?.message || err)}`,
          });
        }
      })();
      return;
    }

    if (url === "/api/chat/preview-prompt" && method === "POST") {
      const body = await readBody(req);
      const text = String(body.text || "").trim();
      const route = body.agentId
        ? { agentId: body.agentId }
        : routeMessage(text);
      const dir = artifactDirFor("preview");
      const prompt = buildCursorPrompt({
        agentId: route.agentId,
        founderText: text,
        artifactDir: dir,
        messageId: "preview",
      });
      return sendJson(res, 200, {
        agentId: route.agentId,
        agentName: readAgentName(route.agentId),
        prompt,
      });
    }

    if (url === "/api/power" && method === "POST") {
      const body = await readBody(req);
      const action = String(body.action || "").toLowerCase();
      if (action === "off" || action === "stop") {
        const cp = powerOff("dashboard-off");
        sendJson(res, 200, { ok: true, power: "off", checkpoint: cp.savedAt });
        setTimeout(() => process.exit(0), 150);
        return;
      }
      if (action === "checkpoint") {
        const cp = saveCheckpoint("dashboard-checkpoint");
        return sendJson(res, 200, { ok: true, checkpoint: cp.savedAt });
      }
      return sendJson(res, 400, {
        ok: false,
        error: "Use action=off|checkpoint. To turn ON run EMET-ON / node runtime/emet.mjs on",
      });
    }

    if (url === "/api/checkpoint" && method === "POST") {
      const cp = saveCheckpoint("api");
      return sendJson(res, 200, { ok: true, savedAt: cp.savedAt });
    }

    let rel = url === "/" ? "/dashboard/index.html" : url;
    const filePath = path.normalize(path.join(ROOT, rel));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found: " + rel);
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
      res.end(data);
    });
  });

  server.listen(PORT, () => {
    console.log(`AZTODEV ON — http://localhost:${PORT}`);
    console.log(`Chat HQ — free language → Cursor agent`);
    console.log(`Resume: ${readStatus().cursor?.resumeNote}`);
  });

  return server;
}

function runForegroundOn() {
  const { status } = powerOnPrepare();
  startHttpServer();

  let ticking = false;
  const timer = setInterval(() => {
    if (ticking) return;
    ticking = true;
    Promise.resolve()
      .then(async () => {
        const s = readStatus();
        if (s.power !== "on") return;
        await tick(s);
      })
      .catch((err) => {
        journal("tick_error", { message: String(err?.message || err) });
        console.error("tick error", err);
      })
      .finally(() => {
        ticking = false;
      });
  }, TICK_MS);

  // Fast Telegram poll — independent of heavy tick so founder DMs never stall
  let tgPolling = false;
  const tgTimer = setInterval(() => {
    if (tgPolling) return;
    tgPolling = true;
    Promise.resolve()
      .then(async () => {
        const s = readStatus();
        if (s.power !== "on") return;
        await pollAndEnqueueTelegram();
      })
      .catch((err) => {
        journal("telegram_fast_poll_error", {
          message: String(err?.message || err),
        });
      })
      .finally(() => {
        tgPolling = false;
      });
  }, 1000);

  // Periodic empty-CMD reap — every 1s (Cursor keeps spawning blank shells)
  const consoleTimer = setInterval(() => {
    import("./lib/cleanup-consoles.mjs")
      .then(async (m) => {
        await m.reapEmptyCmdWindows();
        await m.reapAgentSpawnedConsoles();
      })
      .catch(() => {});
  }, 1000);

  const shutdown = (reason) => {
    clearInterval(timer);
    clearInterval(tgTimer);
    clearInterval(consoleTimer);
    powerOff(reason);
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  // first tick immediately
  ticking = true;
  Promise.resolve(tick(status))
    .catch((err) => console.error("first tick", err))
    .finally(() => {
      ticking = false;
    });
}

function cmdStatus() {
  ensureRuntimeDirs();
  const status = readStatus();
  const alive = isPidAlive(status.pid);
  const out = {
    power: alive && status.power === "on" ? "on" : status.power === "on" && !alive ? "crashed?" : status.power,
    pid: status.pid,
    alive,
    port: status.port || PORT,
    startedAt: status.startedAt,
    stoppedAt: status.stoppedAt,
    resumeNote: status.cursor?.resumeNote,
    checkpoint: getCheckpointMeta(),
    dashboard: `http://localhost:${status.port || PORT}`,
  };
  console.log(JSON.stringify(out, null, 2));
}

function cmdOff() {
  ensureRuntimeDirs();
  const status = readStatus();
  if (status.pid && isPidAlive(status.pid) && status.pid !== process.pid) {
    // Ask running process to stop via HTTP first (saves checkpoint inside)
    fetch(`http://127.0.0.1:${status.port || PORT}/api/power`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "off" }),
    })
      .then(async (r) => {
        const j = await r.json();
        console.log("AZTODEV OFF via API", j);
      })
      .catch(() => {
        // Fallback: checkpoint here and kill
        try {
          status.cursor = status.cursor || defaultStatus().cursor;
          writeStatus(status);
          saveCheckpoint("external-off-kill");
          markPowerOffOnState("external-off-kill");
          process.kill(status.pid);
        } catch (e) {
          console.error(e);
        }
        status.power = "off";
        status.pid = null;
        status.stoppedAt = nowIso();
        writeStatus(status);
        console.log("AZTODEV OFF (forced)");
      });
    return;
  }

  // No live process — still freeze a checkpoint of current files
  saveCheckpoint("off-no-process");
  markPowerOffOnState("off-no-process");
  status.power = "off";
  status.pid = null;
  status.stoppedAt = nowIso();
  writeStatus(status);
  console.log("AZTODEV OFF (checkpoint saved; no running process)");
}

function cmdOnDetached() {
  ensureRuntimeDirs();
  const status = readStatus();
  if (status.pid && isPidAlive(status.pid) && status.power === "on") {
    console.log(`Already ON (pid ${status.pid}) — http://localhost:${status.port || PORT}`);
    return;
  }

  const logPath = path.join(ROOT, "ops", "runtime", "emet.log");
  const out = fs.openSync(logPath, "a");
  const child = spawn(process.execPath, [path.join(ROOT, "runtime", "emet.mjs"), "run"], {
    detached: true,
    stdio: ["ignore", out, out],
    cwd: ROOT,
    windowsHide: true,
  });
  child.unref();
  console.log("EMET starting in background…");
  console.log(`Dashboard: http://localhost:${PORT}`);
  console.log("Will resume from last checkpoint if one exists.");
  console.log(`Log: ${logPath}`);
}

if (cmd === "status") cmdStatus();
else if (cmd === "off" || cmd === "stop") cmdOff();
else if (cmd === "run") runForegroundOn(); // internal worker
else if (cmd === "on" || cmd === "start") cmdOnDetached();
else if (cmd === "fg" || cmd === "foreground") runForegroundOn();
else {
  console.log("Usage: node runtime/emet.mjs on|off|status|fg");
  process.exit(1);
}
