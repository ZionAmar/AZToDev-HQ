/**
 * One founder brief — better than 20 agent emails.
 * Shape: now / waiting-for-exactly / next / links. Hebrew. Noa voice.
 */
import fs from "fs";
import path from "path";
import { OPS, RUNTIME_DIR, nowIso, readJson, writeJson, journal } from "./paths.mjs";
import { liveStatusHebrew } from "./live-status.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { requireActionPin, isActionUnlocked } from "./action-pin.mjs";
import { setWaitingFounder } from "./waiting-founder.mjs";
import { emailConfigured, sendFounderEmail } from "./mail.mjs";
import { readFactory } from "./company-state.mjs";
import { listInboxSnapshot } from "./inbox-dispatcher.mjs";

const STAMP = path.join(RUNTIME_DIR, "founder-brief.json");

export function buildFounderBrief() {
  const factory = readFactory();
  const inbox = listInboxSnapshot();
  const w = factory.activeWork || {};
  const lines = [
    "נועה · שורה תחתונה",
    nowIso().slice(0, 16).replace("T", " ") + " UTC",
    "",
    liveStatusHebrew(),
  ];
  if (w.waitingFor) {
    lines.push("", `שער פתוח: ${w.waitingFor}`);
  }
  if (w.next) lines.push(`הצעד אחרי השער: ${w.next}`);
  if (inbox.held.length) {
    lines.push(
      "",
      "תיבות מוחזקות עד אשר/סיסמה:",
      ...inbox.held.slice(0, 5).map((p) => `• ${p.agentName || p.agentId} — ${p.name}`)
    );
  }
  if (inbox.open.length) {
    lines.push(
      "",
      "תיבות פתוחות (יעורו בתור):",
      ...inbox.open.slice(0, 5).map((p) => `• ${p.agentName || p.agentId} — ${p.name}`)
    );
  }
  lines.push(
    "",
    "מה לא רץ: 28 כובעים על הספסל. חיים: נועה · קשת · רות · נדב · תמיר.",
    "מוצר ב-GitHub: כבוי עד «תבנו» + סיסמה. אתרי לקוח לא נגעו."
  );
  return lines.join("\n");
}

export function founderBriefDue(now = Date.now()) {
  const st = readJson(STAMP, {});
  const last = Date.parse(st.lastSentAt || "") || 0;
  return now - last > 20 * 60 * 60 * 1000;
}

export async function sendFounderBrief({
  force = false,
  telegram = true,
  email = true,
} = {}) {
  if (!force && !founderBriefDue()) {
    return { ok: true, skipped: true, reason: "not_due" };
  }
  const text = buildFounderBrief();
  const reportDir = path.join(OPS, "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(
    reportDir,
    `noa-brief-${nowIso().slice(0, 10)}.md`
  );
  fs.writeFileSync(reportPath, text + "\n", "utf8");

  const result = { ok: true, reportPath, telegram: null, email: null, text };

  if (telegram) {
    result.telegram = await sendFounderTelegram(text, { silent: false }).catch(
      (err) => ({ ok: false, error: String(err?.message || err).slice(0, 200) })
    );
  }

  if (email) {
    if (!emailConfigured()) {
      result.email = { ok: false, reason: "no_gmail" };
    } else if (!force) {
      const lock = requireActionPin();
      if (lock) {
        setWaitingFounder({
          kind: "pin",
          task: "שלחי לציון את שורת התחתונה במייל (נועה · בריף)",
          agentId: "00-ceo",
        });
        result.email = { ok: false, reason: "pin_locked" };
      } else {
        result.email = await sendFounderEmail({
          subject: `נועה · שורה תחתונה · ${nowIso().slice(0, 10)}`,
          text,
        });
      }
    } else {
      result.email = await sendFounderEmail({
        subject: `נועה · שורה תחתונה · ${nowIso().slice(0, 10)}`,
        text,
      });
    }
  }

  writeJson(STAMP, {
    lastSentAt: nowIso(),
    reportPath,
    email: result.email,
    telegramOk: Boolean(result.telegram?.ok !== false),
  });
  journal("founder_brief_sent", {
    email: result.email?.ok === true,
    pin: isActionUnlocked(),
  });
  return result;
}
