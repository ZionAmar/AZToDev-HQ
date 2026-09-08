import fs from "fs";
import path from "path";
import { OPS, nowIso, journal, writeJson, readJson } from "./paths.mjs";
import { normalizeFounderTelegramMessage } from "./telegram-media.mjs";
import { formatTelegramHtml, stripTelegramMarkdown } from "./telegram-format.mjs";

const OFFSET_PATH = path.join(OPS, "runtime", "telegram-offset.json");

export function telegramConfigured() {
  return Boolean(
    (process.env.TELEGRAM_BOT_TOKEN || "").trim() &&
      (process.env.TELEGRAM_FOUNDER_CHAT_ID || "").trim()
  );
}

async function api(method, payload) {
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN missing");
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram ${method}: ${JSON.stringify(data)}`);
  return data.result;
}

/**
 * Send to founder via Bot HTTP API only — never launches Telegram Desktop.
 * silent: true (default) → disable_notification so Windows is less likely to
 * pop/steal focus for every bot message.
 */
export async function sendFounderTelegram(text, { silent = true } = {}) {
  const raw = String(text).slice(0, 3500);
  if (!telegramConfigured()) {
    const dir = path.join(OPS, "outbox-founder");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${Date.now()}_telegram_pending.md`);
    fs.writeFileSync(
      file,
      `# Pending Telegram to founder\n\n${nowIso()}\n\n${raw}\n`,
      "utf8"
    );
    journal("telegram_queued_no_token", { file });
    return { queued: true, file };
  }
  const chatId = process.env.TELEGRAM_FOUNDER_CHAT_ID.trim();
  const html = formatTelegramHtml(raw);
  try {
    const result = await api("sendMessage", {
      chat_id: chatId,
      text: html,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      disable_notification: Boolean(silent),
    });
    journal("telegram_sent", { chatId, silent: Boolean(silent), format: "HTML" });
    return { queued: false, result };
  } catch (err) {
    const plain = stripTelegramMarkdown(raw);
    const result = await api("sendMessage", {
      chat_id: chatId,
      text: plain.slice(0, 3500),
      disable_web_page_preview: true,
      disable_notification: Boolean(silent),
    });
    journal("telegram_sent", {
      chatId,
      silent: Boolean(silent),
      format: "plain",
      htmlError: String(err?.message || err).slice(0, 120),
    });
    return { queued: false, result };
  }
}

/** Send a photo file to founder (sendPhoto). caption optional. */
export async function sendFounderTelegramPhoto(photoPath, { caption = "", silent = true } = {}) {
  const abs = path.resolve(photoPath);
  if (!fs.existsSync(abs)) throw new Error(`Photo not found: ${abs}`);
  if (!telegramConfigured()) {
    const dir = path.join(OPS, "outbox-founder");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${Date.now()}_telegram_photo_pending.md`);
    fs.writeFileSync(
      file,
      `# Pending Telegram photo to founder\n\n${nowIso()}\n\nPhoto: ${abs}\n\n${caption}\n`,
      "utf8"
    );
    journal("telegram_photo_queued_no_token", { file, photo: abs });
    return { queued: true, file };
  }
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chatId = process.env.TELEGRAM_FOUNDER_CHAT_ID.trim();
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("photo", new Blob([fs.readFileSync(abs)]), path.basename(abs));
  if (caption) {
    form.append("caption", formatTelegramHtml(String(caption).slice(0, 1024)));
    form.append("parse_mode", "HTML");
  }
  form.append("disable_notification", String(Boolean(silent)));
  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram sendPhoto: ${JSON.stringify(data)}`);
  journal("telegram_photo_sent", { chatId, photo: abs, silent: Boolean(silent) });
  return { queued: false, result: data.result };
}

/** Send a voice note to founder (sendVoice). Uses Opus/OGG or MP3 from TTS. */
export async function sendFounderTelegramVoice(
  voicePath,
  { caption = "", silent = true } = {}
) {
  const abs = path.resolve(voicePath);
  if (!fs.existsSync(abs)) throw new Error(`Voice not found: ${abs}`);
  if (!telegramConfigured()) {
    const dir = path.join(OPS, "outbox-founder");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${Date.now()}_telegram_voice_pending.md`);
    fs.writeFileSync(
      file,
      `# Pending Telegram voice\n\n${nowIso()}\n\n${abs}\n\n${caption}\n`,
      "utf8"
    );
    journal("telegram_voice_queued_no_token", { file, voice: abs });
    return { queued: true, file };
  }
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chatId = process.env.TELEGRAM_FOUNDER_CHAT_ID.trim();
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("voice", new Blob([fs.readFileSync(abs)]), path.basename(abs));
  if (caption) {
    form.append("caption", formatTelegramHtml(String(caption).slice(0, 1024)));
    form.append("parse_mode", "HTML");
  }
  form.append("disable_notification", String(Boolean(silent)));
  const res = await fetch(`https://api.telegram.org/bot${token}/sendVoice`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram sendVoice: ${JSON.stringify(data)}`);
  journal("telegram_voice_sent", { chatId, voice: abs, silent: Boolean(silent) });
  return { queued: false, result: data.result };
}
export async function pollFounderMessages() {
  if (!telegramConfigured()) return [];
  const token = process.env.TELEGRAM_BOT_TOKEN.trim();
  const chatId = String(process.env.TELEGRAM_FOUNDER_CHAT_ID.trim());
  const state = readJson(OFFSET_PATH, { offset: 0 });
  const url = `https://api.telegram.org/bot${token}/getUpdates?timeout=0&offset=${state.offset || 0}`;
  let data;
  try {
    const res = await fetch(url);
    data = await res.json();
  } catch (err) {
    journal("telegram_poll_error", { message: String(err?.message || err) });
    return [];
  }
  if (!data.ok) {
    journal("telegram_poll_not_ok", {
      description: String(data.description || "").slice(0, 200),
    });
    return [];
  }

  const out = [];
  let last = state.offset || 0;
  for (const u of data.result || []) {
    last = Math.max(last, u.update_id + 1);
    const msg = u.message || u.edited_message;
    if (!msg) continue;
    if (String(msg.chat?.id) !== chatId) continue;
    try {
      const normalized = await normalizeFounderTelegramMessage(msg);
      if (normalized) {
        out.push({
          ...normalized,
          from: msg.from,
          telegramMessageId: msg.message_id,
        });
      }
    } catch (err) {
      journal("telegram_normalize_error", {
        messageId: msg.message_id,
        error: String(err?.message || err),
      });
      if (msg.text || msg.caption) {
        out.push({
          text: msg.text || msg.caption,
          from: msg.from,
          messageId: msg.message_id,
          telegramMessageId: msg.message_id,
          at: nowIso(),
          attachments: [],
        });
      }
    }
  }

  // Only commit offset after we successfully built the message list
  // (so a crash mid-normalize cannot permanently drop founder DMs).
  if (last !== (state.offset || 0)) {
    writeJson(OFFSET_PATH, { offset: last });
  }
  return out;
}
