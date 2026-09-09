/**
 * Unfinished factory.activeWork must nag — silence is a bug.
 */
import path from "path";
import { RUNTIME_DIR, readJson, writeJson, nowIso } from "./paths.mjs";
import { readFactory } from "./company-state.mjs";
import { liveStatusHebrew } from "./live-status.mjs";

const STAMP = path.join(RUNTIME_DIR, "active-work-watch.json");
const NAG_MS = 8 * 60 * 1000;
const MAX_NAGS = 12;

export function unfinishedActiveWork() {
  const w = readFactory().activeWork;
  if (!w?.slug && !w?.bet) return null;
  if (w.gate === "done" || w.status === "done") return null;
  return w;
}

/**
 * @returns {string|null} Hebrew nag, or null if nothing / too soon
 */
export function activeWorkStallNag() {
  const w = unfinishedActiveWork();
  if (!w) return null;
  const st = readJson(STAMP, {});
  const last = Date.parse(st.lastNagAt || "") || 0;
  const n = Number(st.nagCount || 0);
  if (n >= MAX_NAGS) return null;
  if (last && Date.now() - last < NAG_MS) return null;
  writeJson(STAMP, {
    slug: w.slug,
    nagCount: n + 1,
    lastNagAt: nowIso(),
  });
  const why = w.waitingFor || "אף אחד לא רשם למה זה תקוע — זה עצמו התקלה";
  const next = w.next || "נועה חייבת לפתוח את החסימה או להגיד לציון בדיוק מה חסר";
  return [
    "נועה · זה לא נגמר",
    `${w.bet || w.slug} · שלב ${w.phase || "?"}`,
    `התקלה באמצע: ${why}`,
    `מה עכשיו: ${next}`,
    "",
    liveStatusHebrew(),
  ].join("\n");
}

export function clearActiveWorkWatch() {
  writeJson(STAMP, { nagCount: 0, lastNagAt: null, clearedAt: nowIso() });
}
