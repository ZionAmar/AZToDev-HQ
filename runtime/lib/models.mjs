/**
 * Per-agent / per-task model routing for EMET.
 * Chat = fast + honest. Real work = Cursor execute (never fake links).
 */

export const MODEL_PRESETS = {
  chatFast: process.env.EMET_CHAT_MODEL || "gpt-4.1-mini",
  chatSmart: process.env.EMET_CHAT_SMART_MODEL || "gpt-4.1",
  // Note: composer-2.5-fast is NOT in Cursor SDK model list — use composer-2.5.
  cursorDefault: process.env.EMET_CURSOR_MODEL || "composer-2.5",
  cursorFast: process.env.EMET_CURSOR_FAST_MODEL || "composer-2.5",
  cursorHeavy: process.env.EMET_CURSOR_HEAVY_MODEL || "composer-2.5",
};

export function cursorModelForAgent(agentId) {
  const map = {
    "00-ceo": MODEL_PRESETS.cursorFast,
    "07-product-manager": MODEL_PRESETS.cursorFast,
    "32-delivery-lead": MODEL_PRESETS.cursorFast,
    "04-cpo": MODEL_PRESETS.cursorFast,
    "03-cto": MODEL_PRESETS.cursorHeavy,
    "11-tech-lead": MODEL_PRESETS.cursorHeavy,
    "12-fullstack-engineer": MODEL_PRESETS.cursorHeavy,
    "13-backend-engineer": MODEL_PRESETS.cursorHeavy,
    "14-frontend-engineer": MODEL_PRESETS.cursorHeavy,
    "08-product-designer": MODEL_PRESETS.cursorDefault,
    "20-qa-sdet": MODEL_PRESETS.cursorDefault,
  };
  return (
    process.env[`EMET_CURSOR_MODEL_${String(agentId).replace(/-/g, "_").toUpperCase()}`] ||
    map[agentId] ||
    MODEL_PRESETS.cursorDefault
  );
}

const ACTION_RE =
  /תעשי|תבצעי|תבני|תיצרי|תקימי|תתקני|תכתבי|תבדקי|תבדוק|שלחי|תשלחי|תפתחי|תעדכני|תריצי|deploy|implement|build|create|products\/|לינק|link|url|מייל|email|שלח(?:י)?\s|בדוק|העלי|תעלי|publish|deploy/i;

const PURE_CHAT_RE =
  /^(?:מה נשמע|היי|שלום|הי|יו|תודה|אוקי|אוקיי|סבבה|יאללה|רק לחשוב|מה דעתך|תעני)\s*[!.?]*$/i;

/**
 * @param {string} text
 * @param {string} [recentThread] recent founder/noa lines for follow-ups like "עכשיו"
 */
export function classifyFounderSpeed(text, recentThread = "") {
  const t = String(text || "").trim();
  const lower = t.toLowerCase();
  const thread = String(recentThread || "");

  if (ACTION_RE.test(t) || ACTION_RE.test(lower)) {
    return { lane: "execute", reason: "action_verb" };
  }

  // Short follow-ups that continue an action thread
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

  // Voice transcripts often hide actions
  if (/\[הקלטה קולית/.test(t) && ACTION_RE.test(t)) {
    return { lane: "execute", reason: "voice_action" };
  }

  if (/\[הקלטה קולית/.test(t) && t.length < 350) {
    return { lane: "chat", reason: "voice_chat" };
  }

  // Default: short = chat, but anything that smells like delivery → execute
  if (/קישור|לינק|http|www\.|@gmail|@|\.com/i.test(t)) {
    return { lane: "execute", reason: "link_or_contact" };
  }

  if (t.length < 120) return { lane: "chat", reason: "short_message" };
  if (t.length < 400) return { lane: "chat", reason: "medium_chat" };

  return { lane: "execute", reason: "long_message" };
}
