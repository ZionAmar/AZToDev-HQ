/**
 * Jerusalem rituals — full company roll-call (names, not 33 processes).
 * Catch-up once/day if morning window was missed — so "alive" is proven, not theoretical.
 */
import fs from "fs";
import path from "path";
import { OPS, RUNTIME_DIR, ROOT, nowIso, readJson, writeJson, journal } from "./paths.mjs";
import { liveStatusHebrew } from "./live-status.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { readFactory } from "./company-state.mjs";
import { listInboxSnapshot } from "./inbox-dispatcher.mjs";
import { nadavHeartbeatSnapshot } from "./nadav-queue.mjs";
import { listLiveRuns } from "./live-runs.mjs";
import { LIVE_AGENT_IDS } from "./agent-memory.mjs";

const STAMP = path.join(RUNTIME_DIR, "company-rituals.json");
const PEOPLE = path.join(ROOT, "ops", "config", "people.json");

export function jerusalemParts(now = new Date()) {
  try {
    const hour = Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jerusalem",
        hour: "2-digit",
        hour12: false,
      })
        .formatToParts(now)
        .find((p) => p.type === "hour")?.value || -1
    );
    const date = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jerusalem",
    }).format(now);
    return { hour, date };
  } catch {
    return { hour: now.getHours(), date: nowIso().slice(0, 10) };
  }
}

function readStamp() {
  return readJson(STAMP, {}) || {};
}

function mark(kind, date) {
  const st = readStamp();
  st[kind] = date;
  st.updatedAt = nowIso();
  writeJson(STAMP, st);
}

function already(kind, date) {
  return readStamp()[kind] === date;
}

function loadPeople() {
  try {
    return readJson(PEOPLE, { people: [] }).people || [];
  } catch {
    return [];
  }
}

function rosterBlock() {
  const people = loadPeople();
  const live = new Set(LIVE_AGENT_IDS);
  const liveNames = people
    .filter((p) => live.has(p.id))
    .map((p) => `${p.he} (${p.role})`);
  const bench = people
    .filter((p) => !live.has(p.id))
    .map((p) => p.he);
  return [
    `ערים עכשיו (${liveNames.length}): ${liveNames.join(" · ")}`,
    `ספסל מוכן (${bench.length}) — נקראים למשימה כתובה, לא רצים סתם:`,
    bench.join(" · "),
  ].join("\n");
}

function companyPulseBlock() {
  const factory = readFactory();
  const nadav = nadavHeartbeatSnapshot();
  const live = listLiveRuns();
  const inbox = listInboxSnapshot();
  const productOn = factory.productWorkEnabled === true;
  const open = factory.activeWork;
  const openLine =
    open?.gate === "done" || open?.status === "done" || !open?.slug
      ? "אין משימת מפעל פתוחה"
      : `${open.bet || open.slug} · ${open.waitingFor || open.phase || "רץ"}`;
  return [
    `מפעל: ${openLine}`,
    `מוצר: ${productOn ? "דולק" : "כבוי עד «תבנו» + סיסמה (יתרון משמעת — לא חולשה)"}`,
    `מחשב (נדב): ${nadav.online ? "דולק" : "כבוי / בלי דופק"}`,
    `Cloud רץ עכשיו: ${live.length ? live.map((r) => r.name || r.specialistId).join(" · ") : "אף אחד"}`,
    `תיבות: פתוחות ${inbox.open.length} · מוחזקות ${inbox.held.length}`,
    "",
    rosterBlock(),
  ].join("\n");
}

export function buildMorningRitual() {
  return [
    "נועה · בוקר טוב · Daily",
    jerusalemParts().date,
    "",
    "החברה ערה. כל הכובעים נוכחים בשם — רק הליבה רצה בפועל. זה יותר חזק מתיאטרון.",
    "",
    companyPulseBlock(),
    "",
    liveStatusHebrew(),
    "",
    "מה ממך היום: משימה, «סטטוס», או «תבנו» כשמוכנים לבשל מוצר.",
  ].join("\n");
}

export function buildEveningRitual() {
  return [
    "נועה · סוף יום",
    jerusalemParts().date,
    "",
    companyPulseBlock(),
    "",
    liveStatusHebrew(),
    "",
    "אם משהו נשאר פתוח — אני מטרידה. אם הכל שקט — נחים בלי תיאטרון.",
  ].join("\n");
}

export function buildCatchupRitual() {
  return [
    "נועה · דופק יומי (השלמה)",
    jerusalemParts().date,
    "",
    "החברה לא נרדמה באמצע היום. זה הדופק שהיה חסר מול תום — ועכשיו הוא חי.",
    "",
    companyPulseBlock(),
    "",
    liveStatusHebrew(),
  ].join("\n");
}

function saveReport(kind, text) {
  const dir = path.join(OPS, "reports");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `noa-${kind}-${jerusalemParts().date}.md`);
  fs.writeFileSync(file, text + "\n", "utf8");
  return file;
}

async function sendRitual(kind, text) {
  const report = saveReport(kind, text);
  const telegram = await sendFounderTelegram(text, { silent: false }).catch((err) => ({
    ok: false,
    error: String(err?.message || err).slice(0, 160),
  }));
  mark(kind, jerusalemParts().date);
  journal(`ritual_${kind}`, { date: jerusalemParts().date, report });
  return { telegram, report };
}

/**
 * Force one ritual now (founder proof / catch-up). Still once per kind per day.
 */
export async function sendRitualNow(kind = "catchup") {
  const { date } = jerusalemParts();
  if (already(kind, date)) {
    return { ok: true, skipped: true, reason: "already_today", kind };
  }
  const builders = {
    morning: buildMorningRitual,
    evening: buildEveningRitual,
    catchup: buildCatchupRitual,
  };
  const build = builders[kind] || buildCatchupRitual;
  const out = await sendRitual(kind === "catchup" ? "catchup" : kind, build());
  return { ok: true, kind, ...out };
}

/**
 * Heartbeat: morning / evening windows + one midday catch-up if morning was missed.
 */
export async function tickCompanyRituals() {
  const { hour, date } = jerusalemParts();
  const out = { morning: null, evening: null, catchup: null };

  if (hour >= 8 && hour <= 10 && !already("morning", date)) {
    out.morning = await sendRitual("morning", buildMorningRitual());
  }

  // If morning never fired today and we're past 10 — one catch-up (beats silent days)
  if (hour >= 11 && hour <= 18 && !already("morning", date) && !already("catchup", date)) {
    out.catchup = await sendRitual("catchup", buildCatchupRitual());
  }

  if (hour >= 19 && hour <= 21 && !already("evening", date)) {
    out.evening = await sendRitual("evening", buildEveningRitual());
  }

  return out;
}
