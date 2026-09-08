/**
 * One-shot: explain crash/timeout incident to founder (TG + email).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function loadEnv() {
  const p = path.join(ROOT, ".env");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
}

loadEnv();

const { sendFounderTelegram } = await import("../lib/telegram.mjs");
const { sendFounderEmail, emailConfigured } = await import("../lib/mail.mjs");
const { buildFounderStatusBrief } = await import("../lib/front-desk.mjs");

const msg = `ציון — הסבר קצר מה קרה (בלי סיבובים):

1) EMET קרס באמצע. לכן שקט מוחלט בטלגרם. עכשיו הוא שוב ON.

2) בקשת המצגת ל«ניהול מלאי» / Rakza: נורה נתקעה על timeout (~5 דק׳) אחרי ההודעה הקולית. לא נשלח לך תוצר, לא נפתח לוח Linear INV-*, ולא קיבלת משוב ברור. נרשמה רק IDEA + סקריפטים התחילו בתיקייה 05 — המצגת עצמה לא הושלמה.

3) מה שכן רץ קודם: סקירות KidNest NS-01…NS-08 (עמית/דפנה/אילן) — זה היה פרויקט אחר. נורה ערבבה הקשר ישן עם הבקשה החדשה. זה באג.

4) חלונות CMD = סוכני Cursor שנפתחים ברקע (רעש Windows). Docker Desktop = סוכן ניסה/הריץ דברים סביב docker-compose של Rakza/KidNest בלי לשאול אותך — אסור מעתה בלי אישור מפורש.

תיקונים שעכשיו באוויר:
• פקודה מיידית: כתוב «סטטוס» / מה קורה — תשובה בלי לחכות לנורה
• progress כל ~90 שנ׳ באמצע עבודה + הודעת timeout ברורה
• איסור Docker בלי APPROVE שלך

רוצה שאמשיך עכשיו את מצגת המלאי עד תוצר + מייל אליך? ענה «כן מצגת».

${buildFounderStatusBrief()}`;

const tg = await sendFounderTelegram(msg, { silent: false });
console.log("tg", tg);
if (emailConfigured()) {
  const em = await sendFounderEmail({
    subject: "EMET — מה קרה + סטטוס (לא קרס שוב)",
    text: msg,
  });
  console.log("email", em);
} else {
  console.log("email skipped");
}
