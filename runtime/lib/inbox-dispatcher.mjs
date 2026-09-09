/**
 * Tom Even port: a packet in agents/{id}/inbox wakes that specialist.
 * Cloud VMs are not standing listeners — this dispatcher is.
 */
import fs from "fs";
import path from "path";
import { ROOT, journal, nowIso } from "./paths.mjs";
import { LIVE_AGENT_IDS } from "./agent-memory.mjs";
import {
  startBackgroundDelegate,
  listBackgroundJobs,
} from "./background-delegate.mjs";
import { productCloudBlocked } from "./specialist-runtime.mjs";

function inboxDir(agentId) {
  return path.join(ROOT, "agents", agentId, "inbox");
}

function claimedDir(agentId) {
  return path.join(inboxDir(agentId), "_claimed");
}

export function listInboxPackets(agentId) {
  const dir = inboxDir(agentId);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "README.md" && !f.startsWith("_"))
    .map((f) => ({
      agentId,
      name: f,
      path: path.join(dir, f),
      mtime: fs.statSync(path.join(dir, f)).mtimeMs,
    }))
    .sort((a, b) => a.mtime - b.mtime);
}

function writeInboxPacket(agentId, title, body) {
  const dir = inboxDir(agentId);
  fs.mkdirSync(dir, { recursive: true });
  const safe = String(title || "task")
    .replace(/[^\w\u0590-\u05FF-]+/g, "-")
    .slice(0, 40);
  const name = `${nowIso().slice(0, 10)}_${safe || "task"}.md`;
  const p = path.join(dir, name);
  fs.writeFileSync(p, String(body || "").trim() + "\n", "utf8");
  return p;
}

export { writeInboxPacket };

function claimPacket(pkt) {
  const destDir = claimedDir(pkt.agentId);
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, pkt.name);
  fs.renameSync(pkt.path, dest);
  return dest;
}

function busyAgentIds() {
  return new Set(
    (listBackgroundJobs(20) || [])
      .filter((j) => j.status === "running" || j.status === "queued_pc")
      .map((j) => j.agentId)
  );
}

/**
 * Wake at most one inbox packet (WIP=1).
 * @returns {{ started: boolean, agentId?: string, file?: string }}
 */
export function dispatchNextInbox() {
  const busy = busyAgentIds();
  const ids = [...LIVE_AGENT_IDS];
  for (const agentId of ids) {
    if (busy.has(agentId)) continue;
    if (productCloudBlocked(agentId)) continue;
    const packets = listInboxPackets(agentId);
    if (!packets.length) continue;
    const pkt = packets[0];
    const body = fs.readFileSync(pkt.path, "utf8");
    const claimed = claimPacket(pkt);
    startBackgroundDelegate({
      fromAgentId: "inbox-dispatcher",
      agentId,
      task: body.slice(0, 4000),
      notifyFounder: true,
    });
    journal("inbox_dispatched", { agentId, file: pkt.name, claimed });
    return { started: true, agentId, file: pkt.name };
  }
  return { started: false };
}
