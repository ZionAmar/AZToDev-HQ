import crypto from "crypto";
import path from "path";
import { RUNTIME_DIR, readJson, writeJson, nowIso, journal } from "./paths.mjs";

const UNLOCK_PATH = path.join(RUNTIME_DIR, "action-pin-unlock.json");
const UNLOCK_MS = 10 * 60 * 1000;

export function actionPinConfigured() {
  return Boolean((process.env.FOUNDER_ACTION_PIN || "").trim());
}

function expectedPin() {
  return String(process.env.FOUNDER_ACTION_PIN || "").trim();
}

export function pinMatches(raw) {
  const got = String(raw || "").trim();
  const exp = expectedPin();
  if (!exp || !got || got.length !== exp.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(exp));
  } catch {
    return false;
  }
}

/** Short token-like message that isn't a known command. */
export function looksLikePinAttempt(raw) {
  const t = String(raw || "").trim();
  if (!t || /\s/.test(t)) return false;
  if (t.startsWith("/")) return false;
  if (/^(סטטוס|עזרה|פקודות|החברה|מוכנה)$/i.test(t)) return false;
  const exp = expectedPin();
  if (exp && t.length === exp.length) return true;
  return t.length >= 4 && t.length <= 32;
}

export function isActionUnlocked() {
  if (!actionPinConfigured()) return false;
  const st = readJson(UNLOCK_PATH, {});
  const until = Date.parse(st.until || "") || 0;
  return Date.now() < until;
}

export function unlockActionPin() {
  const until = new Date(Date.now() + UNLOCK_MS).toISOString();
  writeJson(UNLOCK_PATH, { until, at: nowIso() });
  journal("action_pin_unlocked", { minutes: 10 });
  return until;
}

export function requireActionPin() {
  if (!actionPinConfigured()) {
    return "Action PIN is not set in .env (FOUNDER_ACTION_PIN). Refusing mutating action.";
  }
  if (!isActionUnlocked()) {
    return "LOCKED: founder must send the action PIN in Telegram first. Then retry. Do not guess the PIN. Read-only tools are still allowed.";
  }
  return null;
}
