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

const pptx = join(ROOT, "ops/outbox-founder/2026-09-07_inventory-management-deck-he.pptx");
const script = join(ROOT, "ops/outbox-founder/2026-09-07_inventory-management-deck-script-he.md");

const t = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
const info = await t.sendMail({
  from: `"EMET / Roni" <${user}>`,
  to,
  subject: "Rakza — מצגת שיווק 7 דק'",
  text: "ציון,\n\nמצורפים מצגת Rakza (~7 דק', 14 שקפים, RTL) + סקריפט לכל שקף.\n\nמוכנה להצגה לאיציק.\n\n— רוני / EMET",
  attachments: [
    { filename: "Rakza_מצגת_שיווק_7דק.pptx", path: pptx },
    { filename: "inventory-deck-script-he.md", path: script },
  ],
});
console.log(JSON.stringify({ ok: true, messageId: info.messageId, to }));
