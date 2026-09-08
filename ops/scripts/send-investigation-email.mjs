import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const raw = readFileSync(join(ROOT, ".env"), "utf8");
for (const line of raw.split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const user = process.env.GMAIL_USER.trim();
const pass = process.env.GMAIL_APP_PASS.trim().replace(/\s+/g, "");
const to = process.env.FOUNDER_EMAIL || "aztodev@gmail.com";
const path = join(ROOT, "ops/outbox-founder/2026-09-07_Tom-Even-vs-EMET-deep-he.docx");

const t = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
const info = await t.sendMail({
  from: `"EMET / Noa" <${user}>`,
  to,
  subject: "תוספת: תום אבן vs EMET — Claude, Opus, יתרונות/חסרונות",
  text: "ציון,\n\nמצורף ניתוח מעמיק: במה תום משתמש (Claude Code, Opus, ABC-TOM), מה EMET, מה כל אחד יכול שהשני לא, והמלצות hybrid.\n\n— נעה",
  attachments: [{ filename: "Tom-Even-vs-EMET-deep-he.docx", path }],
});
console.log(JSON.stringify({ ok: true, messageId: info.messageId, to }));
