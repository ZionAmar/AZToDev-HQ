/**
 * Founder-facing live flow: now / waiting / next / links.
 */
import { readFactory } from "./company-state.mjs";
import { nadavHeartbeatSnapshot } from "./nadav-queue.mjs";
import { peekWaitingFounder } from "./waiting-founder.mjs";
import { listLiveRuns, cloudAgentUrl } from "./live-runs.mjs";
import { readJson, RUNTIME_DIR, OPS } from "./paths.mjs";
import path from "path";
import { readAgentName } from "./router.mjs";

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

function flowLine() {
  const factory = readFactory();
  const w = factory.activeWork;
  if (!w?.slug && !w?.bet) return "זרימה: אין משימה פתוחה במפעל";
  const owner = readAgentName(w.owner) || w.owner || "?";
  const phase = w.phase ? ` · שלב ${w.phase}` : "";
  return `זרימה: ${w.bet || w.slug}${phase} · בעלים ${owner}`;
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
  const factory = readFactory();
  if (factory.activeWork?.phase) {
    return `הבא: לפי הלוח — אחרי ${factory.activeWork.phase}`;
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
