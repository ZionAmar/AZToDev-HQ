/**
 * Send email to founder (Gmail app password).
 * Env: GMAIL_USER, GMAIL_APP_PASS, FOUNDER_EMAIL (default aztodev@gmail.com)
 */
import nodemailer from "nodemailer";
import { journal } from "./paths.mjs";

export function emailConfigured() {
  return Boolean(
    (process.env.GMAIL_USER || "").trim() &&
      (process.env.GMAIL_APP_PASS || "").trim()
  );
}

export function founderEmail() {
  return (
    (process.env.FOUNDER_EMAIL || "").trim() ||
    (process.env.EMAIL_TO || "").trim() ||
    "aztodev@gmail.com"
  );
}

export async function sendGmail({
  account = "aztodev",
  to,
  subject,
  text,
  html,
  from,
} = {}) {
  const map = {
    aztodev: { user: "GMAIL_USER", pass: "GMAIL_APP_PASS" },
    amzion: { user: "GMAIL_USER_AMZION", pass: "GMAIL_APP_PASS_AMZION" },
    zion: { user: "GMAIL_USER_ZION", pass: "GMAIL_APP_PASS_ZION" },
  };
  const keys = map[String(account || "aztodev")] || map.aztodev;
  const user = (process.env[keys.user] || "").trim();
  const pass = (process.env[keys.pass] || "").trim().replace(/\s+/g, "");
  if (!user || !pass) {
    return { ok: false, reason: `no_creds:${account}` };
  }
  if (!to) return { ok: false, reason: "no_to" };
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  const info = await transporter.sendMail({
    from: from || `"AZToDev / נועה" <${user}>`,
    to,
    subject: subject || "(no subject)",
    text: text || "",
    html: html || undefined,
  });
  journal("email_sent", {
    account,
    to,
    subject: String(subject || "").slice(0, 120),
    messageId: info.messageId,
  });
  return { ok: true, messageId: info.messageId, from: user };
}

export async function sendFounderEmail({
  subject,
  text,
  html,
  to = founderEmail(),
  from,
} = {}) {
  return sendGmail({ account: "aztodev", to, subject, text, html, from });
}
