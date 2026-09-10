import "./windows-hide.mjs";
import fs from "fs";
import path from "path";
import {
  ROOT,
  OPS,
  RUNTIME_DIR,
  readJson,
  writeJson,
  nowIso,
  journal,
  ensureRuntimeDirs,
} from "./paths.mjs";
import { cursorSettingSources, cursorModelId } from "./cursor-local.mjs";
import { buildSessionBootstrap } from "./prompt-builder.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { readAgentName } from "./router.mjs";
import { runCloudWork, runCloudOpsWork, listCursorGithubRepos } from "../../hq/lib/cloud-work.mjs";
import { isProductWorkEnabled } from "./company-state.mjs";
import { peekGmailInbox, searchGmail, searchAllGmail } from "./gmail-read.mjs";
import { sendGmail } from "./mail.mjs";
import {
  specialistUsesCloud,
  standbyDelegateAllowed,
  usesHqOpsCloud,
  localPcOpsBlockedReason,
} from "./specialist-runtime.mjs";
import { stripActivateProduct } from "./product-activate.mjs";
import { runReadOnlySsh } from "./ssh-chemicloud.mjs";
import { pcStatus } from "./pc-status.mjs";
import { socialStatus } from "./social.mjs";
import { capabilitiesSnapshot } from "./capabilities.mjs";
import { requireActionPin } from "./action-pin.mjs";
import {
  snapshotConsolePids,
  killNewConsoles,
  reapAgentSpawnedConsoles,
  reapOrphanConsoles,
} from "./cleanup-consoles.mjs";
import { withAgentTurnLock } from "./console-gate.mjs";
import { polishTelegramHebrew } from "./telegram-format.mjs";
import { sanitizeAgentLinks, stripFalseDuplicateClaims } from "./agent-links.mjs";
import { recordAgentTurn, stripLearningBlock } from "./agent-memory.mjs";
import {
  appendFounderChannel,
  recentFounderChannel,
} from "./founder-channel.mjs";

const SESSIONS_PATH = path.join(RUNTIME_DIR, "agent-sessions.json");

/** Prevent runaway nested delegation */
let delegateDepth = 0;
const MAX_DELEGATE_DEPTH = 3;

function getApiKey() {
  return (process.env.CURSOR_API_KEY || "").trim();
}

export function listCompanyAgentIds() {
  const dir = path.join(ROOT, "agents");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((d) => fs.existsSync(path.join(dir, d, "SYSTEM_PROMPT.md")))
    .sort();
}

export function readSessions() {
  ensureRuntimeDirs();
  return readJson(SESSIONS_PATH, { agents: {} });
}

export function writeSessions(data) {
  writeJson(SESSIONS_PATH, data);
}

export function resetAgentSession(agentId) {
  const store = readSessions();
  if (store.agents?.[agentId]) {
    delete store.agents[agentId];
    writeSessions(store);
  }
  journal("agent_session_reset", { agentId });
}

export function appendTelegramThread(role, text, meta = {}) {
  appendFounderChannel(role, text, meta);
}

export function recentTelegramThread(limit = 24) {
  return recentFounderChannel(limit);
}

/** Strip classifier JSON / tool dumps so Telegram stays human. */
export function sanitizeForTelegram(text) {
  if (text == null) return "";
  let t = String(text).trim();
  if (!t) return "";

  if (
    (t.startsWith("{") && t.includes('"intent"')) ||
    (t.startsWith("{") && t.includes('"reply"'))
  ) {
    try {
      const j = JSON.parse(t);
      if (j.reply) t = String(j.reply);
    } catch {
      const m = t.match(/"reply"\s*:\s*"((?:\\.|[^"\\])*)"/);
      if (m) {
        try {
          t = JSON.parse(`"${m[1]}"`);
        } catch {
          t = m[1];
        }
      }
    }
  }

  t = t.replace(/^```(?:json|javascript|js|ts|tsx|html)?\s*/i, "").replace(/```$/i, "").trim();

  if (/^#\s*Cursor run failed/i.test(t) || /CURSOR_API_KEY/i.test(t) && t.length < 80) {
    return "נתקלתי בתקלה בהרצת Cursor. נסה שוב בעוד רגע — או שלח «שיחה חדשה».";
  }

  // Huge JSON / status dumps
  if ((t.startsWith("{") || t.startsWith("[")) && t.length > 400) {
    return "סיימתי עבודה פנימה. כתוב «מה קורה» אם תרצה סטטוס קצר וברור.";
  }

  // Drop leading meta lines from bootstrap acks mixed in
  t = t.replace(/^Session ready\.?\s*/i, "").trim();
  t = t.replace(/\(?\s*לא חרטוטים\s*\)?/gi, "");
  t = t.replace(/עוברת לביצוע אמיתי[^\n]*/gi, "");
  t = t.replace(/מסלול ה(?:מהיר|כבד)[^\n]*/gi, "");
  t = t.replace(/ביצוע ב-?Cursor[^\n]*/gi, "");
  t = stripLearningBlock(t);
  t = stripActivateProduct(t);
  t = t.replace(/^DELEGATE:\s*.+$/gim, "").replace(/\n{3,}/g, "\n\n").trim();
  t = stripFalseDuplicateClaims(t);
  t = sanitizeAgentLinks(t);
  t = polishTelegramHebrew(t);

  if (t.length > 3500) t = `${t.slice(0, 3480)}…`;
  return t;
}

function agentLocalOptions(agentId, { withCompanyTools = true, settingSources } = {}) {
  const agentCwd = path.join(ROOT, "agents", agentId);
  fs.mkdirSync(agentCwd, { recursive: true });
  const opts = {
    cwd: agentCwd,
    dirs: [ROOT],
    settingSources:
      settingSources != null ? settingSources : cursorSettingSources(),
  };
  if (withCompanyTools) {
    opts.customTools = buildCompanyTools(agentId);
  }
  return opts;
}

/** Real Cursor-to-Cursor handoffs between agents (same quality as chatting in Cursor). */
function buildCompanyTools(ownerAgentId) {
  const tools = {
    emet_delegate: {
      description:
        ownerAgentId === "00-ceo"
          ? "MANDATORY for all non-CEO work. Ruth/Tamir/Noa = Cursor Cloud (hq repo). Nadav (34) = local PC only. Product = Cloud on product repos. Default wait=false (BACKGROUND)."
          : "Give work to another AZToDev agent. Ops + product run on Cursor Cloud except 34-pc-ops (local). Default wait=false (background).",
      inputSchema: {
        type: "object",
        properties: {
          agentId: {
            type: "string",
            description: "Folder id under agents/",
          },
          task: {
            type: "string",
            description: "Clear task — like typing into their Cursor chat",
          },
          wait: {
            type: "boolean",
            description:
              "true = wait for result now (blocks this turn). false/default = background, you stay free to reply to the founder.",
          },
          repo: {
            type: "string",
            description:
              "Product GitHub repo key or URL (work_clock, fitime, telemust). Required for Cloud specialists if GITHUB_REPO is empty.",
          },
        },
        required: ["agentId", "task"],
      },
      execute: async (args) => {
        const agentId = String(args.agentId || "").trim();
        const task = String(args.task || "").trim();
        if (!agentId || !task) return "Missing agentId or task";
        if (agentId === ownerAgentId) return "Cannot delegate to yourself";
        if (!listCompanyAgentIds().includes(agentId)) {
          return `Unknown agentId. Valid: ${listCompanyAgentIds().join(", ")}`;
        }
        const cloud = specialistUsesCloud(agentId);
        if (cloud && !usesHqOpsCloud(agentId)) {
          const lock = requireActionPin();
          if (lock) return lock;
          if (!isProductWorkEnabled()) {
            return "STANDBY: product Cloud work is off. Ops + קשת (planning) are allowed. Engineers start only after ציון asks to build and sends the PIN.";
          }
        }
        if (!cloud && !standbyDelegateAllowed(agentId) && !isProductWorkEnabled()) {
          return "STANDBY: that specialist is product-only. Use 33-household-ops, 34-pc-ops, or 35-server-ops — or wait for product work.";
        }
        if (delegateDepth >= MAX_DELEGATE_DEPTH) {
          return "Max delegation depth — finish the work yourself or escalate to Noa.";
        }

        const wait =
          args.wait === true ||
          args.wait === "true" ||
          (ownerAgentId !== "00-ceo" && args.wait !== false && args.wait !== "false");

        if (!wait) {
          const { startBackgroundDelegate } = await import(
            "./background-delegate.mjs"
          );
          const job = startBackgroundDelegate({
            fromAgentId: ownerAgentId,
            agentId,
            task: args.repo ? `[repo=${args.repo}]\n${task}` : task,
            notifyFounder: ownerAgentId === "00-ceo",
          });
          return `Started BACKGROUND job ${job.jobId} with ${job.agentName} (${agentId})${cloud ? " on Cursor Cloud" : ""}. They keep working independently — you can reply to the founder now. You will get a Telegram update when they finish.`;
        }

        delegateDepth += 1;
        try {
          writeBusHandoff(ownerAgentId, agentId, task);
          let out;
          if (cloud) {
            const { runCloudWork, runCloudOpsWork } = await import("../../hq/lib/cloud-work.mjs");
            const runner = usesHqOpsCloud(agentId) ? runCloudOpsWork : runCloudWork;
            out = await runner({
              task,
              agentId,
              repo: String(args.repo || ""),
            });
            out = { text: out.text, ok: out.ok };
          } else {
            out = await chatWithAgent(agentId, task, {
              asDelegation: true,
              fromAgentId: ownerAgentId,
            });
          }
          writeBusHandoff(
            agentId,
            ownerAgentId,
            `RESULT:\n${String(out.text || "").slice(0, 3000)}`
          );
          return String(out.text || "").slice(0, 8000) || "(empty specialist reply)";
        } catch (err) {
          return `Delegate failed: ${String(err?.message || err)}`;
        } finally {
          delegateDepth -= 1;
        }
      },
    },
    emet_company_status: {
      description: "Read current EMET ops/status snapshot.",
      inputSchema: { type: "object", properties: {} },
      execute: async () => {
        const state = readJson(path.join(OPS, "state.json"), {});
        const sessions = readSessions();
        const products = fs.existsSync(path.join(ROOT, "products"))
          ? fs
              .readdirSync(path.join(ROOT, "products"))
              .filter((d) => d !== "README.md")
          : [];
        return JSON.stringify(
          {
            focus: state.today,
            waiting: state.founderAttention,
            products,
            openSessions: Object.keys(sessions.agents || {}),
          },
          null,
          2
        );
      },
    },
    emet_list_agents: {
      description: "List AZTODEV agent ids and names you can talk to via emet_delegate.",
      inputSchema: { type: "object", properties: {} },
      execute: async () =>
        listCompanyAgentIds()
          .map((id) => `${id} — ${readAgentName(id)}`)
          .join("\n"),
    },
  };

  if (ownerAgentId === "00-ceo") {
    tools.emet_capabilities = {
      description:
        "What is actually wired right now (accounts vs missing tokens). Read-only. Do not do specialist work — delegate.",
      inputSchema: { type: "object", properties: {} },
      execute: async () => JSON.stringify(capabilitiesSnapshot(), null, 2),
    };
    tools.emet_github_status = {
      description: "List GitHub repos connected to Cursor. Read-only. No PRs.",
      inputSchema: { type: "object", properties: {} },
      execute: async () => {
        const listed = await listCursorGithubRepos();
        const repos = (listed.repos || []).slice(0, 40).map((r) => {
          if (typeof r === "string") return r;
          return r.fullName || r.name || r.url || r.id || "repo";
        });
        return JSON.stringify(
          { ok: listed.ok, count: (listed.repos || []).length, repos },
          null,
          2
        );
      },
    };
    tools.emet_social_status = {
      description:
        "Facebook/YouTube wiring. Does NOT publish. Missing tokens listed.",
      inputSchema: { type: "object", properties: {} },
      execute: async () => JSON.stringify(socialStatus(), null, 2),
    };
    tools.emet_cloud_work = {
      description:
        "Run a Cursor Cloud specialist on a private GitHub repo. Prefer emet_delegate with agentId. PIN required. No production deploy.",
      inputSchema: {
        type: "object",
        properties: {
          task: { type: "string", description: "What to build or fix" },
          agentId: { type: "string", description: "Specialist folder id, e.g. 13-backend-engineer" },
          repo: { type: "string", description: "work_clock | fitime | telemust | full URL" },
        },
        required: ["task"],
      },
      execute: async (args) => {
        const lock = requireActionPin();
        if (lock) return lock;
        if (!isProductWorkEnabled()) {
          return "STANDBY: Cursor Cloud product work is locked until the founder starts a product task.";
        }
        const task = String(args.task || "").trim();
        if (!task) return "Missing task";
        const out = await runCloudWork({
          task,
          agentId: String(args.agentId || "").trim(),
          repo: String(args.repo || ""),
          agentLabel: "Noa-dispatched",
        });
        return JSON.stringify(out).slice(0, 4000);
      },
    };
  }

  if (ownerAgentId === "33-household-ops") {
    tools.emet_gmail_peek = {
      description:
        "Read recent INBOX subjects. account=aztodev|amzion|zion. Read-only.",
      inputSchema: {
        type: "object",
        properties: {
          account: { type: "string" },
          limit: { type: "number" },
        },
      },
      execute: async (args) =>
        JSON.stringify(
          await peekGmailInbox({
            account: String(args.account || "aztodev"),
            limit: Number(args.limit) || 8,
          }),
          null,
          2
        ).slice(0, 8000),
    };
    tools.emet_gmail_search = {
      description:
        "Search one Gmail account (Gmail query syntax). Read-only. Do not send.",
      inputSchema: {
        type: "object",
        properties: {
          account: { type: "string" },
          query: { type: "string" },
          limit: { type: "number" },
        },
        required: ["query"],
      },
      execute: async (args) =>
        JSON.stringify(
          await searchGmail({
            account: String(args.account || "aztodev"),
            query: String(args.query || ""),
            limit: Number(args.limit) || 12,
          }),
          null,
          2
        ).slice(0, 8000),
    };
    tools.emet_gmail_search_all = {
      description: "Search all connected Gmail accounts. Read-only.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          limit: { type: "number" },
        },
        required: ["query"],
      },
      execute: async (args) =>
        JSON.stringify(
          await searchAllGmail({
            query: String(args.query || ""),
            limit: Number(args.limit) || 8,
          }),
          null,
          2
        ).slice(0, 8000),
    };
    tools.emet_gmail_send = {
      description:
        "Send email. MUTATING — founder PIN required. Show draft to founder in Telegram first; only send after he said שלחי.",
      inputSchema: {
        type: "object",
        properties: {
          account: { type: "string" },
          to: { type: "string" },
          subject: { type: "string" },
          text: { type: "string" },
        },
        required: ["to", "subject", "text"],
      },
      execute: async (args) => {
        const lock = requireActionPin();
        if (lock) return lock;
        return JSON.stringify(
          await sendGmail({
            account: String(args.account || "zion"),
            to: String(args.to || ""),
            subject: String(args.subject || ""),
            text: String(args.text || ""),
          })
        );
      },
    };
  }

  if (ownerAgentId === "34-pc-ops") {
    tools.emet_pc_status = {
      description: "Snapshot of the founder PC while HQ is running. Read-only.",
      inputSchema: { type: "object", properties: {} },
      execute: async () => JSON.stringify(pcStatus(), null, 2),
    };
  }

  if (ownerAgentId === "35-server-ops") {
    tools.emet_server_status = {
      description:
        "Read-only ChemiCloud SSH. Allowed: uptime, free -m, df -h, ps aux --sort=-%mem | head -15. NEVER restart, kill, apache, or touch sites.",
      inputSchema: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description: "whoami|hostname|uptime|date|pwd|uname -a|df -h|free -m|ps aux --sort=-%mem | head -15",
          },
        },
      },
      execute: async (args) =>
        JSON.stringify(
          await runReadOnlySsh(String(args.command || "uptime")),
          null,
          2
        ),
    };
  }
  if (ownerAgentId === "00-ceo") {
    tools.emet_telegram_update = {
      description:
        "Short Hebrew progress ping to the founder on Telegram mid-task. Prefer one final reply over many updates.",
      inputSchema: {
        type: "object",
        properties: { text: { type: "string" } },
        required: ["text"],
      },
      execute: async (args) => {
        const text = sanitizeForTelegram(args.text);
        if (!text) return "empty";
        await sendFounderTelegram(text, { silent: true });
        appendTelegramThread("noa", text);
        return "sent";
      },
    };
    tools.emet_complete_task = {
      description:
        "Mark a Hebrew board task done, update status, send founder a voice Telegram report + email, then WAIT for his APPROVE before the next task. Call this when a task's work is finished.",
      inputSchema: {
        type: "object",
        properties: {
          taskId: { type: "string", description: "e.g. KN-002" },
          summaryHe: { type: "string", description: "Hebrew summary of what was done" },
          detailsHe: { type: "string", description: "Optional longer Hebrew details" },
          artifact: { type: "string", description: "Path to deliverable file if any" },
        },
        required: ["taskId", "summaryHe"],
      },
      execute: async (args) => {
        const lock = requireActionPin();
        if (lock) return lock;
        const { completeTaskAndReport } = await import("./task-pipeline.mjs");
        const r = await completeTaskAndReport({
          taskId: String(args.taskId || "").trim(),
          summaryHe: String(args.summaryHe || "").trim(),
          detailsHe: String(args.detailsHe || "").trim(),
          artifact: String(args.artifact || "").trim(),
        });
        return JSON.stringify(r);
      },
    };
    tools.emet_task_board = {
      description: "Show the Hebrew task board with statuses (for remote visibility summary).",
      inputSchema: { type: "object", properties: {} },
      execute: async () => {
        const { boardStatusHebrew } = await import("./task-board.mjs");
        return boardStatusHebrew();
      },
    };
  }

  return tools;
}

function writeBusHandoff(from, to, body) {
  const day = nowIso().slice(0, 10);
  const dir = path.join(OPS, "bus", day);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${Date.now()}_${from}_to_${to}.md`),
    `# BUS handoff ${from} → ${to}\n\n${nowIso()}\n\n${body}\n`,
    "utf8"
  );
}

/**
 * Durable Cursor chat in an agent's folder (create or resume).
 * Disposes after each turn; conversation persists via agent id.
 * Pass AbortSignal to cancel the active run on timeout (no orphan Cursor runs).
 * Windows: serialized via console-gate — next turn waits until prior agent CMDs are gone.
 */
export async function chatWithAgent(agentId, userMessage, opts = {}) {
  return withAgentTurnLock(
    () => chatWithAgentUnlocked(agentId, userMessage, opts),
    agentId
  );
}

async function chatWithAgentUnlocked(
  agentId,
  userMessage,
  {
    asDelegation = false,
    fromAgentId = null,
    withCompanyTools = true,
    settingSources,
    signal = null,
  } = {}
) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      ok: false,
      text: "חסר CURSOR_API_KEY — אי אפשר לפתוח את חלון Cursor שלי.",
      needsApiKey: true,
    };
  }
  if (signal?.aborted) {
    return { ok: false, text: "", status: "cancelled", error: "aborted" };
  }

  const pcBlock = localPcOpsBlockedReason(agentId);
  if (pcBlock) {
    journal("pc_ops_blocked_cloud_desk", { agentId });
    return { ok: false, text: pcBlock, error: "nadav_needs_pc_worker" };
  }

  const { Agent } = await import("@cursor/sdk");
  const store = readSessions();
  store.agents = store.agents || {};
  const prev = store.agents[agentId];
  let modelId = cursorModelId(agentId);
  const fallbackModel = process.env.EMET_CURSOR_MODEL || "composer-2.5";
  const local = agentLocalOptions(agentId, { withCompanyTools, settingSources });

  async function openAgent(mid) {
    let a = null;
    let createdLocal = false;
    if (prev?.cursorAgentId) {
      try {
        a = await Agent.resume(prev.cursorAgentId, {
          apiKey,
          model: { id: mid },
          local,
        });
      } catch (err) {
        journal("agent_resume_failed", {
          agentId,
          model: mid,
          error: String(err?.message || err),
        });
        a = null;
      }
    }
    if (!a) {
      a = await Agent.create({
        apiKey,
        model: { id: mid },
        local,
      });
      createdLocal = true;
      store.agents[agentId] = {
        cursorAgentId: a.agentId,
        cwd: path.join(ROOT, "agents", agentId),
        createdAt: nowIso(),
        updatedAt: nowIso(),
        bootstrapped: false,
      };
      writeSessions(store);
    }
    return { agent: a, created: createdLocal };
  }

  let agent = null;
  let created = false;
  let activeRun = null;
  let disposed = false;
  const consolesBefore = await snapshotConsolePids();
  const orphanReap = setInterval(() => {
    reapOrphanConsoles(consolesBefore).catch(() => {});
  }, 5000);

  const isAborted = () => Boolean(signal?.aborted);

  async function cancelActiveRun(reason = "abort") {
    const run = activeRun;
    if (!run) return;
    try {
      if (typeof run.supports === "function" && run.supports("cancel")) {
        await run.cancel();
        journal("agent_run_cancelled", { agentId, reason, runId: run.id });
      } else if (typeof run.cancel === "function") {
        await run.cancel();
        journal("agent_run_cancelled", { agentId, reason, runId: run.id });
      }
    } catch (err) {
      journal("agent_run_cancel_error", {
        agentId,
        reason,
        error: String(err?.message || err).slice(0, 160),
      });
    }
  }

  async function disposeAgent() {
    if (disposed || !agent) return;
    disposed = true;
    try {
      await agent[Symbol.asyncDispose]();
    } catch {
      try {
        agent?.close();
      } catch {
        /* ignore */
      }
    }
  }

  const onAbort = () => {
    cancelActiveRun("signal").catch(() => {});
  };
  if (signal) {
    signal.addEventListener("abort", onAbort, { once: true });
  }

  try {
    try {
      ({ agent, created } = await openAgent(modelId));
    } catch (err) {
      const msg = String(err?.message || err);
      if (/Cannot use this model/i.test(msg) && modelId !== fallbackModel) {
        journal("agent_model_fallback", {
          agentId,
          from: modelId,
          to: fallbackModel,
          error: msg.slice(0, 200),
        });
        modelId = fallbackModel;
        ({ agent, created } = await openAgent(modelId));
      } else {
        throw err;
      }
    }

    if (isAborted()) {
      resetAgentSession(agentId);
      return { ok: false, text: "", status: "cancelled", error: "aborted" };
    }

    if (created || !store.agents[agentId]?.bootstrapped) {
      let bootRun;
      try {
        bootRun = await agent.send(buildSessionBootstrap(agentId));
      } catch (err) {
        if (/already has active run/i.test(String(err?.message || err))) {
          bootRun = await agent.send(buildSessionBootstrap(agentId), {
            local: { force: true },
          });
        } else throw err;
      }
      activeRun = bootRun;
      await bootRun.wait();
      activeRun = null;
      if (isAborted()) {
        resetAgentSession(agentId);
        return { ok: false, text: "", status: "cancelled", error: "aborted" };
      }
      store.agents[agentId] = {
        ...store.agents[agentId],
        cursorAgentId: agent.agentId,
        bootstrapped: true,
        updatedAt: nowIso(),
      };
      writeSessions(store);
    }

    const from = fromAgentId || (asDelegation ? "00-ceo" : null);
    const message = asDelegation
      ? `${readAgentName(from || "00-ceo")} asked you in your Cursor chat:\n\n${userMessage}\n\nDo the work for real. Reply with concrete results and paths.`
      : userMessage;

    let run;
    try {
      run = await agent.send(message);
    } catch (err) {
      const msg = String(err?.message || err);
      if (/already has active run/i.test(msg)) {
        journal("agent_force_unstick", { agentId, phase: "send" });
        run = await agent.send(message, { local: { force: true } });
      } else {
        throw err;
      }
    }
    activeRun = run;
    if (isAborted()) {
      await cancelActiveRun("pre-wait");
      resetAgentSession(agentId);
      return { ok: false, text: "", status: "cancelled", error: "aborted" };
    }

    let result;
    try {
      result = await run.wait();
    } catch (err) {
      if (isAborted()) {
        resetAgentSession(agentId);
        return { ok: false, text: "", status: "cancelled", error: "aborted" };
      }
      const msg = String(err?.message || err);
      if (/already has active run/i.test(msg)) {
        journal("agent_force_unstick", { agentId, phase: "wait" });
        const run2 = await agent.send(message, { local: { force: true } });
        activeRun = run2;
        result = await run2.wait();
      } else {
        throw err;
      }
    }
    activeRun = null;

    if (isAborted() || result?.status === "cancelled") {
      resetAgentSession(agentId);
      return { ok: false, text: "", status: "cancelled", error: "aborted" };
    }

    // If still wedged/error pointing at active run — fresh session once
    if (
      result?.status === "error" &&
      /already has active run/i.test(String(result?.error?.message || result?.result || ""))
    ) {
      journal("agent_session_recreate", { agentId });
      await disposeAgent();
      resetAgentSession(agentId);
      disposed = false;
      agent = await Agent.create({
        apiKey,
        model: { id: modelId },
        local,
      });
      const boot = await agent.send(buildSessionBootstrap(agentId), {
        local: { force: true },
      });
      activeRun = boot;
      await boot.wait();
      activeRun = null;
      if (isAborted()) {
        resetAgentSession(agentId);
        return { ok: false, text: "", status: "cancelled", error: "aborted" };
      }
      store.agents[agentId] = {
        cursorAgentId: agent.agentId,
        cwd: path.join(ROOT, "agents", agentId),
        createdAt: nowIso(),
        updatedAt: nowIso(),
        bootstrapped: true,
      };
      writeSessions(store);
      const run3 = await agent.send(message, { local: { force: true } });
      activeRun = run3;
      result = await run3.wait();
      activeRun = null;
      if (isAborted() || result?.status === "cancelled") {
        resetAgentSession(agentId);
        return { ok: false, text: "", status: "cancelled", error: "aborted" };
      }
    }

    const raw =
      typeof result?.result === "string"
        ? result.result
        : result?.result != null
          ? JSON.stringify(result.result)
          : "";
    const text = sanitizeForTelegram(raw) || sanitizeForTelegram(String(raw));

    // Don't resurrect a session the front-desk already reset on timeout
    if (!isAborted()) {
      store.agents[agentId] = {
        ...store.agents[agentId],
        cursorAgentId: agent.agentId,
        updatedAt: nowIso(),
        lastStatus: result?.status,
        lastRunId: result?.id,
      };
      writeSessions(store);
    }

    journal("agent_chat_turn", {
      agentId,
      status: result?.status,
      runId: result?.id,
      asDelegation,
    });

    recordAgentTurn({
      agentId,
      task: String(userMessage || "").slice(0, 500),
      text: raw,
      ok: result?.status !== "error" && result?.status !== "cancelled",
      cloudAgentId: "",
      fromAgentId: fromAgentId || "",
    });

    return {
      ok: result?.status !== "error" && result?.status !== "cancelled",
      text: text || (asDelegation ? "(no text)" : "קיבלתי. ממשיכה פנימה — כתוב שוב אם לא קיבלת פירוט."),
      status: result?.status,
      runId: result?.id,
      cursorAgentId: agent.agentId,
    };
  } catch (err) {
    if (isAborted()) {
      resetAgentSession(agentId);
      return { ok: false, text: "", status: "cancelled", error: "aborted" };
    }
    const msg = String(err?.message || err);
    if (/already has active run/i.test(msg)) {
      // Last resort: drop wedged agent id so next message opens clean chat
      resetAgentSession(agentId);
      journal("agent_session_reset_after_wedge", { agentId, error: msg });
      return {
        ok: false,
        text: "הריצה הקודמת נתקעה ב־Cursor — איפסתי את החלון שלי. שלח שוב את ההודעה (או «שיחה חדשה»).",
        status: "wedged_reset",
        error: msg,
      };
    }
    throw err;
  } finally {
    if (signal) signal.removeEventListener("abort", onAbort);
    clearInterval(orphanReap);
    if (isAborted()) {
      await cancelActiveRun("finally").catch(() => {});
    }
    await disposeAgent();
    // Close CMD/conhost windows opened during this agent turn
    try {
      await killNewConsoles(consolesBefore, {
        reason: `after-${agentId}${asDelegation ? "-delegate" : ""}`,
      });
      await reapAgentSpawnedConsoles();
      const { reapEmptyCmdWindows } = await import("./cleanup-consoles.mjs");
      await reapEmptyCmdWindows();
    } catch {
      /* ignore */
    }
  }
}
