/**
 * Live Cloud runs — IDs exist while the Cursor Cloud agent is still working.
 */
import path from "path";
import { RUNTIME_DIR, readJson, writeJson, nowIso } from "./paths.mjs";

const PATH = path.join(RUNTIME_DIR, "live-runs.json");

export function cloudAgentUrl(id) {
  const s = String(id || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return `https://cursor.com/agents/${s}`;
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
