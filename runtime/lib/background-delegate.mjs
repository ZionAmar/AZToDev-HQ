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
import { setWaitingFounder } from "./waiting-founder.mjs";
import { upsertLiveRun, clearLiveRun, cloudAgentUrl } from "./live-runs.mjs";
import { liveStatusHebrew } from "./live-status.mjs";
import { triageSpecialistResult, formatNoaUpdate } from "./noa-triage.mjs";
import fs from "fs";

const JOBS_PATH = path.join(OPS, "runtime", "background-jobs.json");

function readJobs() {
  return readJson(JOBS_PATH, { jobs: [] });
}

function writeJobs(data) {
  writeJson(JOBS_PATH, { ...data, updatedAt: nowIso() });
}

function patchJob(jobId, fields) {
  const jobs = readJobs();
  const row = (jobs.jobs || []).find((j) => j.id === jobId);
  if (!row) return null;
  Object.assign(row, fields);
  writeJobs(jobs);
  return row;
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
  founderText = "",
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
    founderText: String(founderText || "").slice(0, 1500),
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
          [
            "נועה · זרימה",
            `נדב בתור על המחשב — «${String(task).slice(0, 80)}»`,
            liveStatusHebrew(),
          ].join("\n"),
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
      upsertLiveRun({ specialistId: agentId, name, task, jobId });
      let startNotified = false;
      const onLiveStart = async ({ cloudAgentId } = {}) => {
        const id = String(cloudAgentId || "").trim();
        upsertLiveRun({
          specialistId: agentId,
          name,
          task,
          cloudAgentId: id,
          jobId,
        });
        if (id) patchJob(jobId, { cloudAgentId: id });
        if (!notifyFounder || startNotified || !id) return;
        startNotified = true;
        const url = cloudAgentUrl(id);
        await sendFounderTelegram(
          [
            "נועה · רץ עכשיו",
            `${name} — ${String(task).replace(/\s+/g, " ").slice(0, 120)}`,
            url,
            "«סטטוס» לכל הזרימה",
          ].join("\n"),
          { silent: true }
        ).catch(() => {});
      };
      try {
        const out = specialistUsesCloud(agentId)
          ? usesHqOpsCloud(agentId)
            ? await runCloudOpsWork({
                task: `${readAgentName(fromAgentId || "00-ceo")} asked you:\n\n${task}`,
                agentId,
                agentLabel: name,
                fromAgentId,
                onLiveStart,
              })
            : await runCloudWork({
                task: `${readAgentName(fromAgentId || "00-ceo")} asked you:\n\n${task}`,
                agentId,
                agentLabel: name,
                onLiveStart,
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
          if (out.agentId) row.cloudAgentId = out.agentId;
        }
        writeJobs(jobs);
        clearLiveRun(agentId);
        journal("delegate_background_done", {
          jobId,
          agentId,
          ok: out.ok,
        });

        if (/LOCKED: founder must send the action PIN/i.test(activated.cleaned)) {
          setWaitingFounder({ kind: "pin", task, agentId });
        }

        try {
          const { executeDelegateRelay } = await import("../../hq/lib/delegate-relay.mjs");
          await executeDelegateRelay(activated.cleaned || result, {
            background: true,
            fromAgentId: agentId,
            founderText: founderText || "",
          });
        } catch {
          /* nested relay is best-effort */
        }

        try {
          const { onWorkFinished } = await import("./work-queue.mjs");
          onWorkFinished();
        } catch {
          /* queue kick is best-effort */
        }

        if (notifyFounder) {
          const triage = triageSpecialistResult({
            agentId,
            name,
            text: activated.cleaned,
            ok: out.ok,
          });
          const extra = activated.message ? `\n\n${activated.message}` : "";
          const sessionUrl = cloudAgentUrl(row?.cloudAgentId || out.agentId || "");
          const linkLine = sessionUrl ? `${name}: ${sessionUrl}` : "";
          const msg =
            formatNoaUpdate({
              name,
              triage,
              liveLine: liveStatusHebrew(),
              preview: activated.cleaned,
            }) +
            extra +
            (linkLine ? `\n\n${linkLine}` : "");
          await sendFounderTelegram(sanitizeForTelegram(msg).slice(0, 3500), {
            silent: false,
          });
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
        clearLiveRun(agentId);
        journal("delegate_background_error", { jobId, agentId, error: msg });
        try {
          const { onWorkFinished } = await import("./work-queue.mjs");
          onWorkFinished();
        } catch {
          /* ignore */
        }
        if (notifyFounder) {
          const triage = triageSpecialistResult({
            agentId,
            name,
            text: msg,
            ok: false,
          });
          const errMsg = formatNoaUpdate({
            name,
            triage,
            liveLine: liveStatusHebrew(),
            preview: msg,
          });
          await sendFounderTelegram(errMsg, { silent: false }).catch(() => {});
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

const QUEUED_PC_STALE_MS = 45 * 60 * 1000;

/**
 * Stale queued_pc (Nadav never finished / KidNest done elsewhere) must not block WIP forever.
 */
export function expireStaleQueuedPcJobs(maxAgeMs = QUEUED_PC_STALE_MS) {
  const jobs = readJobs();
  const now = Date.now();
  let cleared = 0;
  for (const row of jobs.jobs || []) {
    if (row.status !== "queued_pc") continue;
    const started = Date.parse(row.startedAt || "") || 0;
    if (!started || now - started < maxAgeMs) continue;
    row.status = "done";
    row.finishedAt = nowIso();
    row.clearedReason = "stale_queued_pc";
    cleared += 1;
  }
  if (cleared) {
    writeJobs(jobs);
    journal("queued_pc_stale_expired", { cleared });
  }
  return cleared;
}

/**
 * Nadav finished on the PC — clear desk WIP so the company queue can advance.
 */
export function finishQueuedPcByNadavId(nadavJobId, status = "done") {
  const id = String(nadavJobId || "");
  if (!id) return { ok: false, cleared: 0 };
  const jobs = readJobs();
  let cleared = 0;
  for (const row of jobs.jobs || []) {
    if (row.status !== "queued_pc") continue;
    if (row.nadavJobId !== id && row.id !== id) continue;
    row.status = status === "error" ? "error" : "done";
    row.finishedAt = nowIso();
    cleared += 1;
  }
  if (cleared) writeJobs(jobs);
  journal("nadav_pc_job_cleared", { nadavJobId: id, cleared, status });
  return { ok: true, cleared };
}
