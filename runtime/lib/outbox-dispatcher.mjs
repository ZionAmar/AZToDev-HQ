/**
 * Scan specialist outbox for DELEGATE lines — Tom Even style file handoff.
 * Dedupes so the same outbox file is not relayed twice.
 */
import fs from "fs";
import path from "path";
import { ROOT, RUNTIME_DIR, readJson, writeJson, nowIso, journal } from "./paths.mjs";
import { LIVE_AGENT_IDS } from "./agent-memory.mjs";
import { enqueueWork } from "./work-queue.mjs";

const STAMP = path.join(RUNTIME_DIR, "outbox-dispatch.json");
const DELEGATE_LINE = /^DELEGATE:\s*([^\s|]+)\s*\|\s*(.+)$/i;

function extractJobs(text) {
  const jobs = [];
  for (const line of String(text || "").split("\n")) {
    const m = line.trim().match(DELEGATE_LINE);
    if (m) jobs.push({ agentId: m[1].trim(), task: m[2].trim() });
  }
  return jobs;
}

function readStamp() {
  return readJson(STAMP, { seen: {} }) || { seen: {} };
}

function markSeen(fileKey, mtime) {
  const st = readStamp();
  st.seen = st.seen || {};
  st.seen[fileKey] = { mtime, at: nowIso() };
  const keys = Object.keys(st.seen);
  if (keys.length > 200) {
    const keep = keys.slice(-120);
    const next = {};
    for (const k of keep) next[k] = st.seen[k];
    st.seen = next;
  }
  writeJson(STAMP, st);
}

function listRecentOutbox() {
  const out = [];
  for (const agentId of LIVE_AGENT_IDS) {
    const dir = path.join(ROOT, "agents", agentId, "outbox");
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".md") || name === "README.md") continue;
      const p = path.join(dir, name);
      let st;
      try {
        st = fs.statSync(p);
      } catch {
        continue;
      }
      if (Date.now() - st.mtimeMs > 48 * 60 * 60 * 1000) continue;
      out.push({ agentId, name, path: p, mtime: st.mtimeMs });
    }
  }
  return out.sort((a, b) => a.mtime - b.mtime);
}

/**
 * @param {{ dryRun?: boolean }} [opts]
 * @returns {{ relayed: number, files: string[], jobs?: object[] }}
 */
export function dispatchOutboxDelegates(opts = {}) {
  const dryRun = opts.dryRun === true;
  const stamp = readStamp();
  const seen = stamp.seen || {};
  let relayed = 0;
  const files = [];
  const allJobs = [];
  for (const pkt of listRecentOutbox()) {
    const key = `${pkt.agentId}/${pkt.name}`;
    const prev = seen[key];
    if (prev && Number(prev.mtime) === pkt.mtime) continue;
    let body = "";
    try {
      body = fs.readFileSync(pkt.path, "utf8");
    } catch {
      continue;
    }
    const jobs = extractJobs(body);
    if (!jobs.length) {
      if (!dryRun) markSeen(key, pkt.mtime);
      continue;
    }
    if (dryRun) {
      relayed += jobs.length;
      files.push(key);
      allJobs.push(...jobs);
      continue;
    }
    markSeen(key, pkt.mtime);
    enqueueWork(jobs, {
      founderText: body.slice(0, 1500),
      fromAgentId: pkt.agentId,
    });
    relayed += jobs.length;
    files.push(key);
    journal("outbox_delegate_dispatched", {
      file: key,
      n: jobs.length,
      agents: jobs.map((j) => j.agentId),
    });
  }
  return dryRun ? { relayed, files, jobs: allJobs, dryRun: true } : { relayed, files };
}
