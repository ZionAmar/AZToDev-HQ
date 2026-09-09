/**
 * Founder-facing live flow: now / waiting / next / links.
 */
import fs from "fs";
import { readFactory } from "./company-state.mjs";
import { nadavHeartbeatSnapshot } from "./nadav-queue.mjs";
import { peekWaitingFounder } from "./waiting-founder.mjs";
import { listLiveRuns, cloudAgentUrl } from "./live-runs.mjs";
import { readJson, RUNTIME_DIR, OPS, ROOT } from "./paths.mjs";
import path from "path";
import { readAgentName } from "./router.mjs";
import { LIVE_AGENT_IDS } from "./agent-memory.mjs";

function peekQueue() {
  const q = readJson(path.join(RUNTIME_DIR, "work-queue.json"), { items: [] });
  return (q.items || []).filter((x) => x.status === "queued");
}

function listJobs() {
  const store = readJson(path.join(OPS, "runtime", "background-jobs.json"), {
    jobs: [],
  });
  return store.jobs || [];
}

function openActiveWork() {
  const w = readFactory().activeWork;
  if (!w?.slug && !w?.bet) return null;
  if (w.gate === "done" || w.status === "done") return null;
  return w;
}

function flowLine() {
  const w = openActiveWork();
  if (!w) return "זרימה: אין משימה פתוחה במפעל";
  const owner = readAgentName(w.owner) || w.owner || "?";
  const phase = w.phase ? ` · שלב ${w.phase}` : "";
  return `זרימה: ${w.bet || w.slug}${phase} · בעלים ${owner}`;
}

function inboxHint() {
  for (const agentId of LIVE_AGENT_IDS) {
    const held = path.join(ROOT, "agents", agentId, "inbox", "_held");
    const open = path.join(ROOT, "agents", agentId, "inbox");
    const who = readAgentName(agentId) || agentId;
    if (fs.existsSync(held)) {
      const files = fs.readdirSync(held).filter((f) => f.endsWith(".md"));
      if (files[0]) return `מחכה ל: «אשר» — תיק מוחזק אצל ${who} (${files[0]})`;
    }
    if (fs.existsSync(open)) {
      const files = fs
        .readdirSync(open)
        .filter((f) => f.endsWith(".md") && f !== "README.md" && !f.startsWith("_"));
      if (files[0]) return `מחכה ל: דיספצ'ר — ${who} · ${files[0]}`;
    }
  }
  return "";
}

function waitingLine() {
  const pin = peekWaitingFounder("pin");
  if (pin) {
    return `מחכה ל: סיסמה — כדי להמשיך «${String(pin.task).slice(0, 80)}»`;
  }
  const confirm = peekWaitingFounder("confirm");
  if (confirm) {
    return `מחכה ל: «אשר» על התוכנית — «${String(confirm.task).slice(0, 80)}»`;
  }
  const open = openActiveWork();
  if (open?.waitingFor) {
    return `מחכה ל: ${open.waitingFor}`;
  }
  const inbox = inboxHint();
  if (inbox) return inbox;
  const jobs = listJobs();
  const pc = jobs.find((j) => j.status === "queued_pc");
  if (pc) {
    const nadav = nadavHeartbeatSnapshot();
    return nadav.online
      ? `מחכה ל: נדב על המחשב (דולק) — ${pc.agentName || "נדב"}`
      : `מחכה ל: שהמחשב יידלק — נדב בתור על «${String(pc.task || "").slice(0, 60)}»`;
  }
  return "מחכה ל: כלום — אין שער פתוח";
}

function nowLine() {
  const live = listLiveRuns();
  if (live.length) {
    return live
      .map((r) => {
        const who = r.name || readAgentName(r.specialistId) || r.specialistId;
        const link = r.url || cloudAgentUrl(r.cloudAgentId);
        const doing = String(r.task || "").replace(/\s+/g, " ").slice(0, 90);
        return link
          ? `עכשיו: ${who} — ${doing}\n${link}`
          : `עכשיו: ${who} — ${doing}`;
      })
      .join("\n");
  }
  const running = listJobs().filter(
    (j) => j.status === "running" || j.status === "queued_pc"
  );
  if (running.length) {
    return running
      .map((j) => {
        const link = cloudAgentUrl(j.cloudAgentId);
        const doing = String(j.task || "").replace(/\s+/g, " ").slice(0, 90);
        return link
          ? `עכשיו: ${j.agentName || j.agentId} — ${doing}\n${link}`
          : `עכשיו: ${j.agentName || j.agentId} — ${doing}`;
      })
      .join("\n");
  }
  return "עכשיו: אף אחד לא רץ";
}

function nextLine() {
  const queued = peekQueue();
  if (queued.length) {
    const n = queued[0];
    const who = readAgentName(n.agentId) || n.agentId;
    return `הבא: ${who} — ${String(n.task || "").replace(/\s+/g, " ").slice(0, 80)}`;
  }
  if (peekWaitingFounder("confirm")) return "הבא: אחרי «אשר» — קשת פותחת/מעדכנת לינאר ואז נדב";
  if (peekWaitingFounder("pin")) return "הבא: אחרי סיסמה — ממשיכים את אותה משימה מיד";
  const open = openActiveWork();
  if (open?.next) return `הבא: ${open.next}`;
  if (open?.phase) {
    return `הבא: לפי הלוח — אחרי ${open.phase}`;
  }
  return "הבא: אין תור. כתוב מה לעשות או «סטטוס»";
}

export function liveStatusHebrew() {
  const factory = readFactory();
  const linear =
    factory.linearProductIssueUrl ||
    factory.linearProductIssue ||
    factory.linearHqUrl ||
    "";
  const lines = [
    "סטטוס חי · AZToDev",
    flowLine(),
    nowLine(),
    waitingLine(),
    nextLine(),
  ];
  if (linear) lines.push(`לוח: ${linear}`);
  return lines.join("\n");
}

export function liveStatusPromptBlock() {
  return `LIVE FLOW (tell ציון this shape if he asks status):\n${liveStatusHebrew()}`;
}
