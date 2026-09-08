/**
 * Send overnight report to founder email + Telegram.
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

const { sendFounderEmail } = await import("../lib/mail.mjs");
const { sendFounderTelegram } = await import("../lib/telegram.mjs");

const reportPath = path.join(ROOT, "ops", "reports", "overnight-2026-09-07.md");
const md = fs.readFileSync(reportPath, "utf8");
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const email = await sendFounderEmail({
  subject: "EMET — סיכום לילה 7.9 | החברה רצה, מה עובד ומה נשאר",
  text: md,
  html: `<div dir="rtl" style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;max-width:720px"><pre style="white-space:pre-wrap;font-family:inherit">${esc(md)}</pre></div>`,
});
console.log("email", email);

const tg = await sendFounderTelegram(
  "הלכת לישון — אני ממשיכה לייצב את החברה.\nסיכום מלא נשלח ל־aztodev@gmail.com.\nשנת ישרים.",
  { silent: false }
);
console.log("telegram", Boolean(tg));
