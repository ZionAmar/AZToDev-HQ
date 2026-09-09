/**
 * File drop in agents/{id}/inbox wakes that specialist — via the WIP=1 queue.
 * Cloud VMs are not standing listeners. This dispatcher is.
 */
import fs from "fs";
import path from "path";
import { ROOT, journal, nowIso } from "./paths.mjs";
import { LIVE_AGENT_IDS } from "./agent-memory.mjs";
import { listBackgroundJobs } from "./background-delegate.mjs";
import { productCloudBlocked } from "./specialist-runtime.mjs";
import { enqueueWork } from "./work-queue.mjs";
import { isMutatingCompanyAsk } from "../../hq/lib/delegate-relay.mjs";
import { peekWaitingFounder, setWaitingFounder } from "./waiting-founder.mjs";
import { readFactory } from "./company-state.mjs";
import { readAgentName } from "./router.mjs";

function inboxDir(agentId) {
  return path.join(ROOT, "agents", agentId, "inbox");
}

function claimedDir(agentId) {
  return path.join(inboxDir(agentId), "_claimed");
}

function heldDir(agentId) {
  return path.join(inboxDir(agentId), "_held");
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

export function listHeldPackets(agentId) {
  const dir = heldDir(agentId);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({
      agentId,
      name: f,
      path: path.join(dir, f),
      mtime: fs.statSync(path.join(dir, f)).mtimeMs,
      held: true,
    }));
}

export function listInboxSnapshot() {
  const open = [];
  const held = [];
  for (const agentId of LIVE_AGENT_IDS) {
    const name = readAgentName(agentId) || agentId;
    for (const p of listInboxPackets(agentId)) {
      open.push({ ...p, agentName: name });
    }
    for (const p of listHeldPackets(agentId)) {
      held.push({ ...p, agentName: name });
    }
  }
  return { open, held };
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

function movePacket(pkt, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, pkt.name);
  fs.renameSync(pkt.path, dest);
  return dest;
}

export function shouldHoldInboxTask(body, { confirmOpen, gate } = {}) {
  if (!isMutatingCompanyAsk(body)) return false;
  if (confirmOpen) return true;
  if (gate === "confirm") return true;
  return false;
}

function busyAgentIds() {
  return new Set(
    (listBackgroundJobs(20) || [])
      .filter((j) => j.status === "running" || j.status === "queued_pc")
      .map((j) => j.agentId)
  );
}

function holdPacket(pkt, reason) {
  const dest = movePacket(pkt, heldDir(pkt.agentId));
  journal("inbox_held", { agentId: pkt.agentId, file: pkt.name, reason });
  return dest;
}

/**
 * After founder «אשר» — packets leave _held and re-enter inbox for dispatch.
 */
export function releaseHeldInbox() {
  let n = 0;
  for (const agentId of LIVE_AGENT_IDS) {
    for (const pkt of listHeldPackets(agentId)) {
      movePacket(pkt, inboxDir(agentId));
      n += 1;
    }
  }
  if (n) journal("inbox_released", { n });
  return n;
}

/**
 * Wake at most one inbox packet (WIP=1) through the company queue.
 */
export function dispatchNextInbox() {
  const busy = busyAgentIds();
  const factory = readFactory();
  const gate = factory.activeWork?.gate || "";
  const confirmOpen = Boolean(peekWaitingFounder("confirm"));
  const ids = [...LIVE_AGENT_IDS];

  for (const agentId of ids) {
    if (busy.has(agentId)) continue;
    if (productCloudBlocked(agentId)) continue;
    const packets = listInboxPackets(agentId);
    if (!packets.length) continue;
    const pkt = packets[0];
    const body = fs.readFileSync(pkt.path, "utf8");

    if (shouldHoldInboxTask(body, { confirmOpen, gate })) {
      holdPacket(pkt, "mutating_awaiting_confirm");
      if (!confirmOpen) {
        setWaitingFounder({
          kind: "confirm",
          task: body.slice(0, 1500),
          agentId,
          jobs: [{ agentId, task: body.slice(0, 1500) }],
        });
      }
      continue;
    }

    movePacket(pkt, claimedDir(agentId));
    enqueueWork([{ agentId, task: body.slice(0, 4000) }], {
      founderText: body.slice(0, 1500),
      fromAgentId: "inbox-dispatcher",
    });
    journal("inbox_dispatched", { agentId, file: pkt.name });
    return { started: true, agentId, file: pkt.name };
  }
  return { started: false };
}

export function inboxWaitingHebrew() {
  const { open, held } = listInboxSnapshot();
  if (held.length) {
    const p = held[0];
    return `מחכה ל: «אשר» — תיק בתיבת ${p.agentName || p.agentId} (${p.name})`;
  }
  if (open.length) {
    const p = open[0];
    return `מחכה ל: דיספצ'ר — ${p.agentName || p.agentId} · ${p.name}`;
  }
  return "";
}
