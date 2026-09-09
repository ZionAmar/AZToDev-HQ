/**
 * Nadav job queue on the ChemiCloud desk (JSON only).
 * PC worker claims jobs over SSH. Never runs Cursor on the VPS.
 */
import path from "path";
import os from "os";
import { RUNTIME_DIR, readJson, writeJson, nowIso, journal } from "./paths.mjs";

export const NADAV_QUEUE_PATH = path.join(RUNTIME_DIR, "nadav-queue.json");
export const NADAV_HEARTBEAT_PATH = path.join(RUNTIME_DIR, "nadav-pc-heartbeat.json");

const MAX_JOBS = 15;
const CLAIM_STALE_MS = 15 * 60 * 1000;
const ONLINE_MS = 120 * 1000;

function emptyQueue() {
  return { jobs: [], waitingNotifiedAt: null, updatedAt: nowIso() };
}

export function readNadavQueue() {
  return readJson(NADAV_QUEUE_PATH, emptyQueue()) || emptyQueue();
}

export function writeNadavQueue(data) {
  writeJson(NADAV_QUEUE_PATH, { ...data, updatedAt: nowIso() });
}

export function nadavPcIsOnline() {
  const hb = readJson(NADAV_HEARTBEAT_PATH, {});
  const at = Date.parse(hb.at || "") || 0;
  return Boolean(at && Date.now() - at < ONLINE_MS);
}

export function nadavHeartbeatSnapshot() {
  const hb = readJson(NADAV_HEARTBEAT_PATH, {});
  return {
    online: nadavPcIsOnline(),
    at: hb.at || null,
    hostname: hb.hostname || null,
  };
}

export function writeNadavHeartbeat({ hostname } = {}) {
  writeJson(NADAV_HEARTBEAT_PATH, {
    at: nowIso(),
    hostname: String(hostname || os.hostname()).slice(0, 80),
  });
}

export function enqueueNadavJob({
  task,
  fromAgentId = "00-ceo",
  actionUnlockedUntil = null,
} = {}) {
  const store = readNadavQueue();
  store.jobs = Array.isArray(store.jobs) ? store.jobs : [];
  const job = {
    id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    agentId: "34-pc-ops",
    fromAgentId,
    task: String(task || "").slice(0, 2000),
    status: "queued",
    actionUnlockedUntil: actionUnlockedUntil || null,
    createdAt: nowIso(),
  };
  store.jobs.unshift(job);
  store.jobs = store.jobs.slice(0, MAX_JOBS);
  writeNadavQueue(store);
  journal("nadav_job_enqueued", { jobId: job.id });
  return job;
}

export function shouldNotifyPcOffline() {
  if (nadavPcIsOnline()) return false;
  const store = readNadavQueue();
  const last = Date.parse(store.waitingNotifiedAt || "") || 0;
  if (Date.now() - last < 5 * 60 * 1000) return false;
  store.waitingNotifiedAt = nowIso();
  writeNadavQueue(store);
  return true;
}

export function claimNextNadavJob() {
  const store = readNadavQueue();
  store.jobs = Array.isArray(store.jobs) ? store.jobs : [];
  const now = Date.now();
  for (const job of store.jobs) {
    if (job.status === "claimed") {
      const claimed = Date.parse(job.claimedAt || "") || 0;
      if (claimed && now - claimed > CLAIM_STALE_MS) {
        job.status = "queued";
        job.claimedAt = null;
      }
    }
  }
  const job = store.jobs.find((j) => j.status === "queued");
  if (!job) {
    writeNadavQueue(store);
    return null;
  }
  job.status = "claimed";
  job.claimedAt = nowIso();
  writeNadavQueue(store);
  return job;
}

export function finishNadavJob(jobId, status = "done") {
  const id = String(jobId || "");
  if (!/^job-[a-z0-9-]+$/i.test(id)) return false;
  const st = status === "error" ? "error" : "done";
  const store = readNadavQueue();
  const job = (store.jobs || []).find((j) => j.id === id);
  if (!job) return false;
  job.status = st;
  job.finishedAt = nowIso();
  writeNadavQueue(store);
  journal("nadav_job_finished", { jobId: id, status: st });
  return true;
}

/**
 * Finish Nadav queue + clear WIP + kick company queue (+ optional DELEGATE relay).
 * Runs on the ChemiCloud desk.
 */
export async function completeNadavPcJob(
  jobId,
  status = "done",
  resultText = ""
) {
  const ok = finishNadavJob(jobId, status);
  if (!ok) return { ok: false, reason: "missing_job" };
  const { finishQueuedPcByNadavId } = await import("./background-delegate.mjs");
  finishQueuedPcByNadavId(jobId, status);
  try {
    const { onWorkFinished } = await import("./work-queue.mjs");
    onWorkFinished();
  } catch {
    /* best-effort */
  }
  const text = String(resultText || "");
  if (/DELEGATE:\s*/i.test(text)) {
    try {
      const { executeDelegateRelay } = await import("../../hq/lib/delegate-relay.mjs");
      await executeDelegateRelay(text, {
        background: true,
        fromAgentId: "34-pc-ops",
        founderText: text.slice(0, 1500),
      });
    } catch {
      /* best-effort */
    }
  }
  return { ok: true };
}
