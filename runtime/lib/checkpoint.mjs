import fs from "fs";
import path from "path";
import {
  CHECKPOINT_PATH,
  STATE_PATH,
  STATUS_PATH,
  OPS,
  ROOT,
  ensureRuntimeDirs,
  readJson,
  writeJson,
  nowIso,
  journal,
  listIntakeFiles,
} from "./paths.mjs";

function snapshotAgentInboxes() {
  const agentsDir = path.join(ROOT, "agents");
  const snapshot = {};
  if (!fs.existsSync(agentsDir)) return snapshot;
  for (const id of fs.readdirSync(agentsDir)) {
    const inbox = path.join(agentsDir, id, "inbox");
    const outbox = path.join(agentsDir, id, "outbox");
    snapshot[id] = {
      inbox: fs.existsSync(inbox)
        ? fs.readdirSync(inbox).filter((f) => f !== "README.md")
        : [],
      outbox: fs.existsSync(outbox)
        ? fs.readdirSync(outbox).filter((f) => f !== "README.md")
        : [],
    };
  }
  return snapshot;
}

/** Create a full resume checkpoint from current disk truth. */
export function saveCheckpoint(reason = "manual") {
  ensureRuntimeDirs();
  const state = readJson(STATE_PATH, {});
  const status = readJson(STATUS_PATH, {});
  const ideas = listIntakeFiles("ideas").map((f) => f.name);
  const problems = listIntakeFiles("problems").map((f) => f.name);

  const checkpoint = {
    version: 1,
    savedAt: nowIso(),
    reason,
    powerWas: status.power || "unknown",
    cursor: status.cursor || {
      processedIdeas: [],
      processedProblems: [],
      lastTickAt: null,
      resumeNote: "cold start",
    },
    state,
    intakeIndex: { ideas, problems },
    agentFolders: snapshotAgentInboxes(),
    openMeeting: state.openMeeting || null,
    waitingFounder: state.founderAttention || { waiting: [] },
  };

  writeJson(CHECKPOINT_PATH, checkpoint);
  // Also freeze a copy of state for safety
  writeJson(path.join(OPS, "runtime", "state.freeze.json"), state);
  journal("checkpoint_saved", { reason, at: checkpoint.savedAt });
  return checkpoint;
}

/** Restore company state from last checkpoint (exact resume point). */
export function loadCheckpoint() {
  ensureRuntimeDirs();
  const checkpoint = readJson(CHECKPOINT_PATH, null);
  if (!checkpoint) return null;

  if (checkpoint.state) {
    writeJson(STATE_PATH, {
      ...checkpoint.state,
      updatedAt: nowIso(),
      runtime: {
        ...(checkpoint.state.runtime || {}),
        resumedFromCheckpointAt: checkpoint.savedAt,
        resumeReason: checkpoint.reason,
      },
    });
  }

  journal("checkpoint_loaded", { savedAt: checkpoint.savedAt, reason: checkpoint.reason });
  return checkpoint;
}

export function getCheckpointMeta() {
  const cp = readJson(CHECKPOINT_PATH, null);
  if (!cp) return { exists: false };
  return {
    exists: true,
    savedAt: cp.savedAt,
    reason: cp.reason,
    initiatives: (cp.state?.initiatives || []).length,
    waiting: (cp.waitingFounder?.waiting || []).length,
    resumeNote: cp.cursor?.resumeNote || null,
  };
}
