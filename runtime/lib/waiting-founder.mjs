/**
 * Founder gates that must not go silent: PIN + confirm-then-act.
 */
import path from "path";
import { RUNTIME_DIR, readJson, writeJson, nowIso, journal } from "./paths.mjs";

const PATH = path.join(RUNTIME_DIR, "waiting-founder.json");
const NAG_MS = 8 * 60 * 1000;
const MAX_NAGS = 8;

export function readWaitingFounder() {
  return readJson(PATH, { items: [] }) || { items: [] };
}

function writeWaiting(data) {
  writeJson(PATH, { ...data, updatedAt: nowIso() });
}

export function setWaitingFounder({
  kind = "pin",
  task = "",
  agentId = "",
  jobs = [],
} = {}) {
  const store = readWaitingFounder();
  store.items = Array.isArray(store.items) ? store.items : [];
  const id = `wait-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const item = {
    id,
    kind: kind === "confirm" ? "confirm" : "pin",
    task: String(task).slice(0, 1500),
    agentId: String(agentId || "").trim(),
    jobs: Array.isArray(jobs) ? jobs.slice(0, 8) : [],
    nagCount: 0,
    lastNagAt: null,
    createdAt: nowIso(),
  };
  store.items = store.items.filter(
    (x) => !(x.kind === item.kind && x.task === item.task)
  );
  store.items.unshift(item);
  store.items = store.items.slice(0, 12);
  writeWaiting(store);
  journal("waiting_founder_set", { id, kind: item.kind, agentId: item.agentId });
  return item;
}

export function takeWaitingFounder(kind) {
  const store = readWaitingFounder();
  store.items = Array.isArray(store.items) ? store.items : [];
  const i = store.items.findIndex((x) => !kind || x.kind === kind);
  if (i < 0) return null;
  const [item] = store.items.splice(i, 1);
  writeWaiting(store);
  journal("waiting_founder_taken", { id: item.id, kind: item.kind });
  return item;
}

export function peekWaitingFounder(kind) {
  const store = readWaitingFounder();
  return (store.items || []).find((x) => !kind || x.kind === kind) || null;
}

export function waitingFounderPromptBlock() {
  const pin = peekWaitingFounder("pin");
  const confirm = peekWaitingFounder("confirm");
  const lines = [];
  if (pin) {
    lines.push(
      `HQ WAITING PIN: task «${pin.task.slice(0, 180)}». Tell him once to send the action PIN. Do not guess it. Do not drop the task.`
    );
  }
  if (confirm) {
    lines.push(
      `HQ WAITING CONFIRM: you already owe a plan for «${confirm.task.slice(0, 180)}». Do not start specialists until he says אשר / קדימה.`
    );
  }
  return lines.join("\n");
}

/**
 * @returns {string|null} telegram text to send, or null
 */
export function pinNagDue() {
  const item = peekWaitingFounder("pin");
  if (!item) return null;
  if (item.nagCount >= MAX_NAGS) return null;
  const last = Date.parse(item.lastNagAt || item.createdAt || "") || 0;
  if (last && Date.now() - last < NAG_MS) return null;
  const store = readWaitingFounder();
  const row = (store.items || []).find((x) => x.id === item.id);
  if (row) {
    row.nagCount = (row.nagCount || 0) + 1;
    row.lastNagAt = nowIso();
    writeWaiting(store);
  }
  const n = (row?.nagCount || 1);
  return n === 1
    ? "צריך סיסמה כדי להמשיך. שלח אותה בטלגרם — ואמשיך מיד באותה משימה."
    : `עדיין מחכים לסיסמה כדי להמשיך (${n}). בלי זה זה נתקע.`;
}
