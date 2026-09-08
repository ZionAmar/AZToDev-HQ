/**
 * Background specialist jobs — so Nura can keep chatting with the founder
 * while others work (without holding her Cursor turn open).
 */
import { journal, nowIso, writeJson, readJson, OPS } from "./paths.mjs";
import path from "path";
import { chatWithAgent, sanitizeForTelegram } from "./agent-sessions.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { readAgentName } from "./router.mjs";
import { specialistUsesCloud, cloudOpsAgent, hqCloudOnly } from "./specialist-runtime.mjs";
import { runCloudWork, runCloudOpsWork } from "../../hq/lib/cloud-work.mjs";
import { enqueueNadavJob, shouldNotifyPcOffline } from "./nadav-queue.mjs";
import { isActionUnlocked } from "./action-pin.mjs";
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
          ? cloudOpsAgent(agentId)
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
        writeBusHandoff(agentId, fromAgentId, `RESULT ${jobId}:\n${result.slice(0, 3000)}`);

        const jobs = readJobs();
        const row = (jobs.jobs || []).find((j) => j.id === jobId);
        if (row) {
          row.status = out.ok ? "done" : "error";
          row.finishedAt = nowIso();
          row.resultPreview = result.slice(0, 500);
        }
        writeJobs(jobs);
        journal("delegate_background_done", {
          jobId,
          agentId,
          ok: out.ok,
        });

        if (notifyFounder) {
          const clean = sanitizeForTelegram(result).slice(0, 1200);
          await sendFounderTelegram(
            `עדכון מרקע · ${name} (${agentId})\nמשימה הסתיימה.\n\n${clean || "(בלי טקסט)"}\n\nאפשר לשאול אותי מה המשמעות / מה הצעד הבא.`,
            { silent: false }
          );
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
          await sendFounderTelegram(
            `עדכון · ${name} נתקע ברקע על המשימה.\n${msg}\nאפשר להמשיך לדבר איתי — הם לא חוסמים אותי.`,
            { silent: true }
          ).catch(() => {});
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
