/**
 * Jerusalem morning/evening company rituals — one Noa voice, not 33 agents.
 * Beats Tom Even "alive feeling" without theater processes.
 */
import fs from "fs";
import path from "path";
import { OPS, RUNTIME_DIR, nowIso, readJson, writeJson, journal } from "./paths.mjs";
import { liveStatusHebrew } from "./live-status.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { readFactory } from "./company-state.mjs";
import { listInboxSnapshot } from "./inbox-dispatcher.mjs";
import { nadavHeartbeatSnapshot } from "./nadav-queue.mjs";
import { listLiveRuns } from "./live-runs.mjs";

const STAMP = path.join(RUNTIME_DIR, "company-rituals.json");

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
    return {
      hour: now.getHours(),
      date: nowIso().slice(0, 10),
    };
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
    `מוצר: ${productOn ? "דולק" : "כבוי עד «תבנו» + סיסמה"}`,
    `מחשב (נדב): ${nadav.online ? "דולק" : "כבוי / בלי דופק"}`,
    `Cloud רץ עכשיו: ${live.length ? live.map((r) => r.name || r.specialistId).join(" · ") : "אף אחד"}`,
    `תיבות: פתוחות ${inbox.open.length} · מוחזקות ${inbox.held.length}`,
    "ליבה חיה: נועה · קשת · רות · נדב · תמיר · ספסל מוכן למשימה כתובה",
  ].join("\n");
}

export function buildMorningRitual() {
  return [
    "נועה · בוקר טוב · Daily",
    jerusalemParts().date,
    "",
    "החברה ערה. לא 33 חלונות — חמישה חיים + ספסל ממושמע.",
    "",
    companyPulseBlock(),
    "",
    liveStatusHebrew(),
    "",
    "מה ממך היום: כתוב משימה, «סטטוס», או «תבנו» כשמוכנים לבשל מוצר.",
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

function saveReport(kind, text) {
  const dir = path.join(OPS, "reports");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `noa-${kind}-${jerusalemParts().date}.md`);
  fs.writeFileSync(file, text + "\n", "utf8");
  return file;
}

/**
 * Call from desk heartbeat. At most one morning + one evening per Jerusalem day.
 */
export async function tickCompanyRituals() {
  const { hour, date } = jerusalemParts();
  const out = { morning: null, evening: null };

  // Morning window 08:00–10:00 Jerusalem
  if (hour >= 8 && hour <= 10 && !already("morning", date)) {
    const text = buildMorningRitual();
    saveReport("morning", text);
    out.morning = await sendFounderTelegram(text, { silent: false }).catch((err) => ({
      ok: false,
      error: String(err?.message || err).slice(0, 160),
    }));
    mark("morning", date);
    journal("ritual_morning", { date });
  }

  // Evening window 19:00–21:00 Jerusalem
  if (hour >= 19 && hour <= 21 && !already("evening", date)) {
    const text = buildEveningRitual();
    saveReport("evening", text);
    out.evening = await sendFounderTelegram(text, { silent: false }).catch((err) => ({
      ok: false,
      error: String(err?.message || err).slice(0, 160),
    }));
    mark("evening", date);
    journal("ritual_evening", { date });
  }

  return out;
}
