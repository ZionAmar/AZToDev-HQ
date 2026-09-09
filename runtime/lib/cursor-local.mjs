import { ROOT } from "./paths.mjs";
import {
  MODEL_PRESETS,
  cursorModelForAgent,
  cursorModelSelection,
} from "./models.mjs";

/**
 * Local Cursor agent options so EMET runs inherit ambient settings when needed.
 * Default lean on Windows to avoid CMD flashes from hooks.
 */
export function cursorSettingSources() {
  const raw = (process.env.EMET_CURSOR_SETTING_SOURCES || "project").trim();
  if (!raw) return [];
  if (raw === "all") return ["all"];
  if (raw === "none" || raw === "off") return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function cursorLocalOptions(extra = {}) {
  return {
    cwd: ROOT,
    settingSources: cursorSettingSources(),
    ...extra,
  };
}

export function cursorModelId(agentId = null) {
  if (agentId) return cursorModelForAgent(agentId);
  return process.env.EMET_CURSOR_MODEL || MODEL_PRESETS.cursorDefault;
}

/** Full SDK model selection (id + optional params). */
export function cursorModelForRun(agentId = null) {
  if (agentId) return cursorModelSelection(agentId);
  return { id: cursorModelId(null) };
}
