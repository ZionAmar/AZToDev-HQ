/**
 * Background specialist jobs — so Nura can keep chatting with the founder
 * while others work (without holding her Cursor turn open).
 */
import { journal, nowIso, writeJson, readJson, OPS } from "./paths.mjs";
import path from "path";
import {
  chatWithAgent,
  sanitizeForTelegram,
  appendTelegramThread,
} from "./agent-sessions.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { readAgentName } from "./router.mjs";
import {
  specialistUsesCloud,
  hqCloudOnly,
  usesHqOpsCloud,
  productCloudBlocked,
} from "./specialist-runtime.mjs";
import { runCloudWork, runCloudOpsWork } from "../../hq/lib/cloud-work.mjs";
import { enqueueNadavJob, shouldNotifyPcOffline } from "./nadav-queue.mjs";
import { isActionUnlocked } from "./action-pin.mjs";
import { applyActivateProduct } from "./product-activate.mjs";
import fs from "fs";

const JOBS_PATH = path.join(OPS, "runtime", "background-jobs.json");

function readJobs() {
  return readJson(JOBS_PATH, { jobs: [] });
}

function writeJobs(data) {
  writeJson(JOBS_PATH, { ...data, updatedAt: nowIso() });
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
 * Start specialist work without blocking the caller.
 * Returns immediately with jobId.
 */
export function startBackgroundDelegate({
  fromAgentId,
  agentId,
  task,
  notifyFounder = true,
}) {
  const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const name = readAgentName(agentId);
  const store = readJobs();
  store.jobs = store.jobs || [];
  store.jobs.unshift({
    id: jobId,
    fromAgentId,
    agentId,
    agentName: name,
    task: String(task).slice(0, 2000),
    status: "running",
    startedAt: nowIso(),
  });
  store.jobs = store.jobs.slice(0, 40);
  writeJobs(store);

  writeBusHandoff(fromAgentId, agentId, `[BACKGROUND ${jobId}]\n${task}`);
  journal("delegate_background_start", { jobId, agentId, fromAgentId });

  if (productCloudBlocked(agentId)) {
    const jobs = readJobs();
    const row = (jobs.jobs || []).find((j) => j.id === jobId);
    if (row) {
      row.status = "blocked_standby";
      row.finishedAt = nowIso();
    }
    writeJobs(jobs);
    journal("delegate_blocked_standby", { jobId, agentId });
    return {
      jobId,
      agentId,
      agentName: name,
      status: "blocked_standby",
    };
  }

  const pcQueue = hqCloudOnly() && !specialistUsesCloud(agentId);
  if (pcQueue) {
    const unlock = readJson(path.join(OPS, "runtime", "action-pin-unlock.json"), {});
    const queued = enqueueNadavJob({
      task,
      fromAgentId,
      actionUnlockedUntil: isActionUnlocked() ? unlock.until || null : null,
    });
    const jobs = readJobs();
    const row = (jobs.jobs || []).find((j) => j.id === jobId);
    if (row) {
      row.status = "queued_pc";
      row.nadavJobId = queued.id;
    }
    writeJobs(jobs);
    journal("nadav_delegate_queued", { jobId, nadavJobId: queued.id });
    setImmediate(() => {
      (async () => {
        if (!notifyFounder || !shouldNotifyPcOffline()) return;
        await sendFounderTelegram(
          "נדב בתור. ייפתח על המחשב כשהוא דולק — בלי Cursor על השרת.",
          { silent: true }
        ).catch(() => {});
      })();
    });
    return {
      jobId,
      agentId,
      agentName: name,
      status: "queued_pc",
    };
  }

  setImmediate(() => {
    (async () => {
      try {
        const out = specialistUsesCloud(agentId)
          ? usesHqOpsCloud(agentId)
            ? await runCloudOpsWork({
                task: `${readAgentName(fromAgentId || "00-ceo")} asked you:\n\n${task}`,
                agentId,
                agentLabel: name,
                fromAgentId,
              })
            : await runCloudWork({
                task: `${readAgentName(fromAgentId || "00-ceo")} asked you:\n\n${task}`,
                agentId,
                agentLabel: name,
              })
          : await chatWithAgent(agentId, task, {
              asDelegation: true,
              fromAgentId,
            });
        const result = String(out.text || "").slice(0, 8000);
        const activated = applyActivateProduct(result);
        writeBusHandoff(
          agentId,
          fromAgentId,
          `RESULT ${jobId}:\n${activated.cleaned.slice(0, 3000)}`
        );

        const jobs = readJobs();
        const row = (jobs.jobs || []).find((j) => j.id === jobId);
        if (row) {
          row.status = out.ok ? "done" : "error";
          row.finishedAt = nowIso();
          row.resultPreview = activated.cleaned.slice(0, 500);
        }
        writeJobs(jobs);
        journal("delegate_background_done", {
          jobId,
          agentId,
          ok: out.ok,
        });

        if (notifyFounder) {
          const clean = sanitizeForTelegram(activated.cleaned).slice(0, 1200);
          const extra = activated.message ? `\n\n${activated.message}` : "";
          const msg = `עדכון מרקע · ${name} (${agentId})\nמשימה הסתיימה.\n\n${clean || "(בלי טקסט)"}${extra}\n\nאפשר לשאול אותי מה המשמעות / מה הצעד הבא.`;
          await sendFounderTelegram(msg, { silent: false });
          appendTelegramThread(agentId, msg, { source: "background_delegate" });
        }
      } catch (err) {
        const msg = String(err?.message || err).slice(0, 300);
        const jobs = readJobs();
        const row = (jobs.jobs || []).find((j) => j.id === jobId);
        if (row) {
          row.status = "error";
          row.finishedAt = nowIso();
          row.error = msg;
        }
        writeJobs(jobs);
        journal("delegate_background_error", { jobId, agentId, error: msg });
        if (notifyFounder) {
          const errMsg = `עדכון · ${name} נתקע ברקע על המשימה.\n${msg}\nאפשר להמשיך לדבר איתי — הם לא חוסמים אותי.`;
          await sendFounderTelegram(errMsg, { silent: true }).catch(() => {});
          appendTelegramThread(agentId, errMsg, { source: "background_delegate_error" });
        }
      }
    })();
  });

  return {
    jobId,
    agentId,
    agentName: name,
    status: "running",
  };
}

export function listBackgroundJobs(limit = 10) {
  return (readJobs().jobs || []).slice(0, limit);
}
