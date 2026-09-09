/**
 * WIP=1 company queue. One specialist at a time. Next starts when the previous finishes.
 */
import path from "path";
import { RUNTIME_DIR, readJson, writeJson, nowIso, journal } from "./paths.mjs";
import { filterJobsForFounderAsk } from "./work-intent.mjs";
import { listBackgroundJobs, startBackgroundDelegate, expireStaleQueuedPcJobs } from "./background-delegate.mjs";
import { productCloudBlocked } from "./specialist-runtime.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { liveStatusHebrew } from "./live-status.mjs";
import { readAgentName } from "./router.mjs";

const PATH = path.join(RUNTIME_DIR, "work-queue.json");

function readQueue() {
  return readJson(PATH, { items: [] }) || { items: [] };
}

function writeQueue(data) {
  writeJson(PATH, { ...data, updatedAt: nowIso() });
}

function busyNow() {
  expireStaleQueuedPcJobs();
  return (listBackgroundJobs(20) || []).some(
    (j) => j.status === "running" || j.status === "queued_pc"
  );
}

function recentlySame(agentId, task) {
  const needle = String(task || "").slice(0, 80);
  const jobs = listBackgroundJobs(30) || [];
  const tenMin = Date.now() - 10 * 60 * 1000;
  return jobs.some((j) => {
    if (j.agentId !== agentId) return false;
    const at = Date.parse(j.startedAt || j.finishedAt || "") || 0;
    if (at && at < tenMin && j.status === "done") return false;
    const prev = String(j.task || "").slice(0, 80);
    return prev === needle || (needle.length > 20 && prev.includes(needle.slice(0, 40)));
  });
}

export function enqueueWork(jobs, { founderText = "", fromAgentId = "00-ceo" } = {}) {
  const filtered = filterJobsForFounderAsk(jobs, founderText);
  const store = readQueue();
  store.items = Array.isArray(store.items) ? store.items : [];
  let added = 0;
  const addedNames = [];
  for (const j of filtered) {
    if (productCloudBlocked(j.agentId)) continue;
    if (recentlySame(j.agentId, j.task)) {
      journal("work_queue_deduped", { agentId: j.agentId });
      continue;
    }
    if (
      store.items.some(
        (x) =>
          x.status === "queued" &&
          x.agentId === j.agentId &&
          String(x.task).slice(0, 80) === String(j.task).slice(0, 80)
      )
    ) {
      continue;
    }
    store.items.push({
      id: `wq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      agentId: j.agentId,
      task: j.task,
      founderText: String(founderText || "").slice(0, 1500),
      fromAgentId,
      status: "queued",
      createdAt: nowIso(),
    });
    added += 1;
    addedNames.push(readAgentName(j.agentId) || j.agentId);
  }
  writeQueue(store);
  journal("work_queue_enqueued", { n: filtered.length });
  const kicked = kickWorkQueue();
  if (!kicked.started && kicked.reason === "busy" && added) {
    sendFounderTelegram(
      [
        "נועה · בתור",
        `${addedNames.join(" · ")} מחכים שמי שרץ עכשיו יסיים.`,
        liveStatusHebrew(),
      ].join("\n"),
      { silent: true }
    ).catch(() => {});
  }
  return kicked;
}

export function kickWorkQueue(depth = 0) {
  if (depth > 8) return { started: false, reason: "depth" };
  if (busyNow()) return { started: false, reason: "busy" };
  const store = readQueue();
  store.items = Array.isArray(store.items) ? store.items : [];
  const next = store.items.find((x) => x.status === "queued");
  if (!next) return { started: false, reason: "empty" };
  next.status = "started";
  next.startedAt = nowIso();
  writeQueue(store);
  const job = startBackgroundDelegate({
    fromAgentId: next.fromAgentId || "00-ceo",
    agentId: next.agentId,
    task: next.task,
    notifyFounder: true,
    founderText: next.founderText || "",
  });
  if (job.status !== "running" && job.status !== "queued_pc") {
    next.status = "done";
    writeQueue(store);
    journal("work_queue_skipped_status", { agentId: next.agentId, status: job.status });
    return kickWorkQueue(depth + 1);
  }
  journal("work_queue_started", { agentId: next.agentId, id: next.id });
  return { started: true, agentId: next.agentId };
}

export function onWorkFinished() {
  const store = readQueue();
  store.items = Array.isArray(store.items) ? store.items : [];
  const current = store.items.find((x) => x.status === "started");
  if (current) current.status = "done";
  writeQueue(store);
  return kickWorkQueue();
}
