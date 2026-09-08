import fs from "fs";
import path from "path";
import { OPS, nowIso, journal } from "./paths.mjs";

export const TELEGRAM_INBOX = path.join(OPS, "chat", "telegram-inbox");

const MAX_DOWNLOAD_BYTES = 25 * 1024 * 1024;

function botToken() {
  return (process.env.TELEGRAM_BOT_TOKEN || "").trim();
}

async function tgApi(method, payload) {
  const token = botToken();
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

async function downloadFile(fileId, destPath) {
  const info = await tgApi("getFile", { file_id: fileId });
  const rel = info.file_path;
  if (!info.file_size || info.file_size > MAX_DOWNLOAD_BYTES) {
    throw new Error(`File too large or missing size (${info.file_size || "?"})`);
  }
  const url = `https://api.telegram.org/file/bot${botToken()}/${rel}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  return { path: destPath, bytes: buf.length, telegramPath: rel };
}

async function transcribeVoice(audioPath) {
  const key = (process.env.OPENAI_API_KEY || "").trim();
  if (!key) return null;
  const form = new FormData();
  form.append("file", new Blob([fs.readFileSync(audioPath)]), path.basename(audioPath));
  form.append("model", "whisper-1");
  form.append("language", "he");
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) {
    journal("telegram_voice_transcribe_error", { status: res.status });
    return null;
  }
  const data = await res.json();
  return (data.text || "").trim() || null;
}

function safeName(name, fallback) {
  const base = (name || fallback).replace(/[^\w.\-()א-ת\s]/gi, "_").slice(0, 120);
  return base || fallback;
}

function replyContext(msg) {
  const r = msg.reply_to_message;
  if (!r) return null;
  const bits = [];
  if (r.text) bits.push(r.text);
  if (r.caption) bits.push(r.caption);
  if (r.voice) bits.push("[הודעה קולית שענית עליה]");
  if (r.photo) bits.push("[תמונה שענית עליה]");
  if (r.document) bits.push(`[מסמך: ${r.document.file_name || "file"}]`);
  return {
    messageId: r.message_id,
    excerpt: bits.join("\n").slice(0, 800) || "[הודעה ללא טקסט]",
  };
}

/**
 * Normalize a Telegram message into text + saved attachments for Cursor.
 */
export async function normalizeFounderTelegramMessage(msg) {
  const messageId = msg.message_id;
  const dir = path.join(TELEGRAM_INBOX, String(messageId));
  const attachments = [];
  const lines = [];
  const caption = (msg.caption || "").trim();
  const reply = replyContext(msg);
  let wasVoice = Boolean(msg.voice || msg.audio);

  if (reply) {
    lines.push(`[מגיב להודעה קודמת]: «${reply.excerpt}»`);
  }

  if (msg.text) lines.push(msg.text.trim());

  if (msg.location) {
    const { latitude, longitude } = msg.location;
    lines.push(`[מיקום]: ${latitude}, ${longitude}`);
    if (msg.venue?.title) lines.push(`[מקום]: ${msg.venue.title}`);
  }

  if (msg.photo?.length) {
    const best = msg.photo[msg.photo.length - 1];
    try {
      const dest = path.join(dir, "photo.jpg");
      const saved = await downloadFile(best.file_id, dest);
      attachments.push({ type: "photo", path: saved.path, mime: "image/jpeg" });
      lines.push(`[תמונה]: ${saved.path}`);
    } catch (err) {
      lines.push(`[תמונה — לא נשמרה: ${String(err.message)}]`);
    }
  }

  if (msg.document) {
    const name = safeName(msg.document.file_name, "document.bin");
    try {
      const dest = path.join(dir, name);
      const saved = await downloadFile(msg.document.file_id, dest);
      attachments.push({
        type: "document",
        path: saved.path,
        mime: msg.document.mime_type || "application/octet-stream",
        name,
      });
      lines.push(`[קובץ ${name}]: ${saved.path}`);
    } catch (err) {
      lines.push(`[קובץ — לא נשמר: ${String(err.message)}]`);
    }
  }

  if (msg.video) {
    try {
      const dest = path.join(dir, "video.mp4");
      const saved = await downloadFile(msg.video.file_id, dest);
      attachments.push({ type: "video", path: saved.path, mime: "video/mp4" });
      lines.push(`[סרטון]: ${saved.path}`);
    } catch (err) {
      lines.push(`[סרטון — לא נשמר: ${String(err.message)}]`);
    }
  }

  if (msg.video_note) {
    try {
      const dest = path.join(dir, "video-note.mp4");
      const saved = await downloadFile(msg.video_note.file_id, dest);
      attachments.push({ type: "video_note", path: saved.path, mime: "video/mp4" });
      lines.push(`[הודעת וידאו עגולה]: ${saved.path}`);
    } catch (err) {
      lines.push(`[וידאו — לא נשמר: ${String(err.message)}]`);
    }
  }

  if (msg.voice || msg.audio) {
    const src = msg.voice || msg.audio;
    try {
      const dest = path.join(dir, "voice.ogg");
      const saved = await downloadFile(src.file_id, dest);
      // Keep file on disk for audit, but do NOT hand the path to Cursor —
      // agents try to "open" ogg via shell → CMD storm / crash on Windows.
      const transcript = await transcribeVoice(saved.path);
      if (transcript) {
        lines.push(`[הקלטה קולית — תמלול]: ${transcript}`);
      } else {
        lines.push(
          "[הקלטה קולית התקבלה אבל התמלול נכשל. כתוב בטקסט מה רצית, או בדוק OPENAI_API_KEY.]"
        );
        journal("telegram_voice_no_transcript", { messageId, path: saved.path });
      }
    } catch (err) {
      lines.push(`[קול — לא נשמר: ${String(err.message)}]`);
    }
  }

  if (caption) lines.push(`[כיתוב]: ${caption}`);

  const text = lines.filter(Boolean).join("\n").trim();
  if (!text && attachments.length === 0) {
    return null;
  }

  const meta = {
    messageId,
    at: nowIso(),
    text: text || "[מדיה ללא טקסט]",
    attachments,
    reply,
    wasVoice,
  };
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2), "utf8");
  journal("telegram_media_saved", {
    messageId,
    attachments: attachments.length,
    hasReply: Boolean(reply),
  });
  return meta;
}
