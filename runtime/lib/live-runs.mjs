/**
 * Live Cloud runs — IDs exist while the Cursor Cloud agent is still working.
 */
import path from "path";
import { RUNTIME_DIR, OPS, readJson, writeJson, nowIso } from "./paths.mjs";

const PATH = path.join(RUNTIME_DIR, "live-runs.json");
const JOBS_PATH = path.join(OPS, "runtime", "background-jobs.json");
const CLOUD_SESSION_RE =
  /^https?:\/\/cursor\.com\/agents\/(bc-[0-9a-f-]+)\/?$/i;

export function cloudAgentUrl(id) {
  const s = String(id || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return isValidCloudSessionUrl(s) ? s : "";
  return `https://cursor.com/agents/${s}`;
}

/** Real per-run Cloud session URL — not the cursor.com homepage. */
export function isValidCloudSessionUrl(url) {
  return CLOUD_SESSION_RE.test(String(url || "").trim());
}

export function specialistSessionLine(name, cloudAgentId) {
  const url = cloudAgentUrl(cloudAgentId);
  if (!url) return "";
  const who = String(name || "מומחה").trim();
  return `${who}: ${url}`;
}

/** Latest bc-… URL for a specialist from background jobs (done or running). */
export function latestSpecialistSessionUrl(agentId) {
  const id = String(agentId || "").trim();
  if (!id) return "";
  const jobs = readJson(JOBS_PATH, { jobs: [] }).jobs || [];
  for (const row of jobs) {
    if (row.agentId !== id) continue;
    const url = cloudAgentUrl(row.cloudAgentId);
    if (url) return url;
  }
  for (const row of listLiveRuns()) {
    if (row.specialistId !== id) continue;
    const url = row.url || cloudAgentUrl(row.cloudAgentId);
    if (url) return url;
  }
  return "";
}

function readRuns() {
  return readJson(PATH, { runs: [] }) || { runs: [] };
}

function writeRuns(data) {
  writeJson(PATH, { ...data, updatedAt: nowIso() });
}

export function upsertLiveRun({
  specialistId = "",
  name = "",
  task = "",
  cloudAgentId = "",
  jobId = "",
} = {}) {
  const store = readRuns();
  store.runs = Array.isArray(store.runs) ? store.runs : [];
  store.runs = store.runs.filter((r) => r.specialistId !== specialistId);
  store.runs.unshift({
    specialistId,
    name,
    task: String(task).slice(0, 400),
    cloudAgentId: String(cloudAgentId || "").trim(),
    url: cloudAgentUrl(cloudAgentId),
    jobId,
    at: nowIso(),
  });
  store.runs = store.runs.slice(0, 12);
  writeRuns(store);
  return store.runs[0];
}

export function clearLiveRun(specialistId) {
  const store = readRuns();
  store.runs = (store.runs || []).filter((r) => r.specialistId !== specialistId);
  writeRuns(store);
}

export function listLiveRuns() {
  return readRuns().runs || [];
}
