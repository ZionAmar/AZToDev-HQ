/**
 * Per-agent Cursor Cloud model routing (Tom Even parity+ brains).
 * Source of truth for IDs: Cursor.models.list() for this Cursor account.
 * Config: ops/config/agent-models.json — env EMET_CURSOR_MODEL_* wins.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONFIG_PATH = path.join(ROOT, "ops", "config", "agent-models.json");

const FALLBACK_PRESETS = {
  judgment: "claude-sonnet-5",
  orchestration: "claude-sonnet-5",
  deepTech: "claude-opus-5",
  codeDefault: "composer-2.5",
  codeFast: "composer-2.5",
  triageFast: "gemini-3.8-flash",
  research: "gpt-5.6-sol",
};

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    return { presets: FALLBACK_PRESETS, agents: {} };
  }
}

let cached = null;
function cfg() {
  if (!cached) cached = loadConfig();
  return cached;
}

export function reloadAgentModels() {
  cached = null;
  return cfg();
}

export const MODEL_PRESETS = {
  chatFast: process.env.EMET_CHAT_MODEL || "gpt-4.1-mini",
  chatSmart: process.env.EMET_CHAT_SMART_MODEL || "gpt-4.1",
  cursorDefault: process.env.EMET_CURSOR_MODEL || "composer-2.5",
  cursorFast: process.env.EMET_CURSOR_FAST_MODEL || "composer-2.5",
  cursorHeavy: process.env.EMET_CURSOR_HEAVY_MODEL || "claude-opus-5",
};

function envOverride(agentId) {
  const key = `EMET_CURSOR_MODEL_${String(agentId || "")
    .replace(/-/g, "_")
    .toUpperCase()}`;
  return (process.env[key] || "").trim();
}

function resolvePresetId(presetName) {
  const c = cfg();
  const presets = { ...FALLBACK_PRESETS, ...(c.presets || {}) };
  if (presetName === "codeFast") {
    return (
      process.env.EMET_CURSOR_FAST_MODEL ||
      presets.codeFast ||
      MODEL_PRESETS.cursorFast
    );
  }
  if (presetName === "deepTech") {
    return (
      process.env.EMET_CURSOR_HEAVY_MODEL ||
      presets.deepTech ||
      MODEL_PRESETS.cursorHeavy
    );
  }
  return presets[presetName] || MODEL_PRESETS.cursorDefault;
}

/**
 * @returns {string} model id
 */
export function cursorModelForAgent(agentId) {
  const fromEnv = envOverride(agentId);
  if (fromEnv) return fromEnv;
  const entry = cfg().agents?.[agentId];
  if (entry?.model) return String(entry.model);
  if (entry?.preset) return resolvePresetId(entry.preset);
  return MODEL_PRESETS.cursorDefault;
}

/**
 * Full SDK ModelSelection — supports composer fast param.
 * @returns {{ id: string, params?: Array<{ id: string, value: string }> }}
 */
export function cursorModelSelection(agentId) {
  const id = cursorModelForAgent(agentId);
  const entry = cfg().agents?.[agentId];
  const wantFast =
    entry?.fast === true ||
    entry?.preset === "codeFast" ||
    entry?.preset === "triageFast";
  if (wantFast && id === "composer-2.5") {
    return { id, params: [{ id: "fast", value: "true" }] };
  }
  if (Array.isArray(entry?.params) && entry.params.length) {
    return { id, params: entry.params };
  }
  return { id };
}

const ACTION_RE =
  /תעשי|תבצעי|תבני|תיצרי|תקימי|תתקני|תכתבי|תבדקי|תבדוק|שלחי|תשלחי|תפתחי|תעדכני|תריצי|deploy|implement|build|create|products\/|לינק|link|url|מייל|email|שלח(?:י)?\s|בדוק|העלי|תעלי|publish|deploy/i;

const PURE_CHAT_RE =
  /^(?:מה נשמע|היי|שלום|הי|יו|תודה|אוקי|אוקיי|סבבה|יאללה|רק לחשוב|מה דעתך|תעני)\s*[!.?]*$/i;

/**
 * @param {string} text
 * @param {string} [recentThread]
 */
export function classifyFounderSpeed(text, recentThread = "") {
  const t = String(text || "").trim();
  const lower = t.toLowerCase();
  const thread = String(recentThread || "");

  if (ACTION_RE.test(t) || ACTION_RE.test(lower)) {
    return { lane: "execute", reason: "action_verb" };
  }

  if (
    /^(?:עכשיו|יאללה|קדימה|תמשיכי|תמשיך|עשי|עשי את זה|כן עשי|כן|בבקשה|גו|go|do it)\s*[!.]*$/i.test(
      t
    )
  ) {
    if (ACTION_RE.test(thread) || /לינק|מייל|קידנסט|kidnest|שלח|בדק/i.test(thread)) {
      return { lane: "execute", reason: "followup_action" };
    }
  }

  if (/סטטוס|מה קורה|מה המצב|סיכום|איפה אנחנו/i.test(lower)) {
    return { lane: "chat", reason: "status" };
  }

  if (PURE_CHAT_RE.test(t) || /רק לחשוב|בוא נדבר|מה דעתך/i.test(lower)) {
    return { lane: "chat", reason: "pure_chat" };
  }

  if (/\[הקלטה קולית/.test(t) && ACTION_RE.test(t)) {
    return { lane: "execute", reason: "voice_action" };
  }

  if (/\[הקלטה קולית/.test(t) && t.length < 350) {
    return { lane: "chat", reason: "voice_chat" };
  }

  if (/קישור|לינק|http|www\.|@gmail|@|\.com/i.test(t)) {
    return { lane: "execute", reason: "link_or_contact" };
  }

  if (t.length < 120) return { lane: "chat", reason: "short_message" };
  if (t.length < 400) return { lane: "chat", reason: "medium_chat" };

  return { lane: "execute", reason: "long_message" };
}
