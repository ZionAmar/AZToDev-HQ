import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { OPS, nowIso, journal } from "./paths.mjs";
import { stripTelegramMarkdown } from "./telegram-format.mjs";

const OUT_DIR = path.join(OPS, "chat", "telegram-outbox-voice");
const CHUNK_CHARS = Number(process.env.EMET_TTS_CHUNK_CHARS || 460);

export function textForSpeech(text) {
  let t = stripTelegramMarkdown(String(text || ""));
  t = t
    .replace(/\*\*/g, "")
    .replace(/`+/g, "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return t;
}

/** Split on sentence boundaries so Telegram/Gemini don't cut ~1:40. */
export function chunkForSpeech(text, maxLen = CHUNK_CHARS) {
  const spoken = textForSpeech(text);
  if (!spoken) return [];
  if (spoken.length <= maxLen) return [spoken];
  const parts = spoken.split(/(?<=[.!?…。؟]|[\u05BE\u05C3])\s+/);
  const chunks = [];
  let buf = "";
  for (const part of parts) {
    const piece = part.trim();
    if (!piece) continue;
    if (!buf) {
      buf = piece;
      continue;
    }
    if (`${buf} ${piece}`.length <= maxLen) {
      buf = `${buf} ${piece}`;
    } else {
      if (buf.length > maxLen) {
        for (let i = 0; i < buf.length; i += maxLen) {
          chunks.push(buf.slice(i, i + maxLen));
        }
      } else {
        chunks.push(buf);
      }
      buf = piece;
    }
  }
  if (buf) {
    if (buf.length > maxLen) {
      for (let i = 0; i < buf.length; i += maxLen) {
        chunks.push(buf.slice(i, i + maxLen));
      }
    } else {
      chunks.push(buf);
    }
  }
  return chunks.filter(Boolean);
}

export function ttsConfigured() {
  const skip = String(process.env.HQ_SKIP_TTS || process.env.HQ_CLOUD_ONLY || "")
    .trim()
    .toLowerCase();
  if (skip === "1" || skip === "true" || skip === "yes") return false;
  return Boolean(
    (process.env.OPENAI_API_KEY || "").trim() ||
      (process.env.GEMINI_API_KEY || "").trim()
  );
}

function hasHebrew(s) {
  return /[\u0590-\u05FF]/.test(s);
}

function pcmToWav(pcm, sampleRate = 24000) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

function ffmpegToOpus(wavPath, oggPath) {
  const ff =
    process.env.FFMPEG ||
    (fs.existsSync("C:\\ffmpeg\\bin\\ffmpeg.exe")
      ? "C:\\ffmpeg\\bin\\ffmpeg.exe"
      : "ffmpeg");
  const r = spawnSync(
    ff,
    ["-y", "-i", wavPath, "-c:a", "libopus", "-b:a", "24k", oggPath],
    { windowsHide: true, encoding: "utf8" }
  );
  return r.status === 0 && fs.existsSync(oggPath);
}

async function synthesizeGemini(spoken) {
  const key = (process.env.GEMINI_API_KEY || "").trim();
  if (!key) return null;
  const model =
    process.env.EMET_GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
  const voiceName = process.env.EMET_GEMINI_TTS_VOICE || "Kore";
  const prompt = hasHebrew(spoken)
    ? `Speak in natural conversational Israeli Hebrew at a normal pace — not slow, not rushed. Finish every sentence:\n${spoken}`
    : spoken;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
      },
    }),
  });
  const data = await res.json();
  const b64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!res.ok || !b64) {
    journal("tts_gemini_skip", {
      status: res.status,
      finish: data?.candidates?.[0]?.finishReason || "",
    });
    return null;
  }
  const pcm = Buffer.from(b64, "base64");
  const wav = pcmToWav(pcm, 24000);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const wavPath = path.join(OUT_DIR, `${Date.now()}_noa.wav`);
  fs.writeFileSync(wavPath, wav);
  const oggPath = wavPath.replace(/\.wav$/, ".ogg");
  if (ffmpegToOpus(wavPath, oggPath)) {
    journal("tts_ok", { provider: "gemini", voice: voiceName, filePath: oggPath });
    return { path: oggPath, bytes: fs.statSync(oggPath).size, text: spoken, at: nowIso() };
  }
  journal("tts_ok", { provider: "gemini", voice: voiceName, filePath: wavPath });
  return { path: wavPath, bytes: wav.length, text: spoken, at: nowIso() };
}

async function synthesizeOpenAI(spoken, { voice } = {}) {
  const key = (process.env.OPENAI_API_KEY || "").trim();
  if (!key) return null;
  const ttsVoice = voice || process.env.EMET_TTS_VOICE || "nova";
  const format = process.env.EMET_TTS_FORMAT || "mp3";
  const model = process.env.EMET_TTS_MODEL || "gpt-4o-mini-tts";
  const speed = Number(process.env.EMET_TTS_SPEED || 1.05);
  const body = {
    model,
    input: spoken,
    voice: ttsVoice,
    response_format: format,
  };
  if (model.includes("gpt-4o")) {
    body.instructions = hasHebrew(spoken)
      ? "Speak in clear Israeli Hebrew at a natural conversational pace. Not slow. Not rushed. Finish every sentence."
      : "Speak clearly at a natural conversational pace.";
    body.speed = speed;
  } else {
    body.speed = speed;
  }
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    journal("tts_error", {
      status: res.status,
      body: (await res.text()).slice(0, 200),
    });
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const ext = format === "opus" ? "ogg" : format;
  const filePath = path.join(OUT_DIR, `${Date.now()}_noa.${ext}`);
  fs.writeFileSync(filePath, buf);
  journal("tts_ok", { provider: "openai", bytes: buf.length, voice: ttsVoice, filePath });
  return { path: filePath, bytes: buf.length, text: spoken, at: nowIso() };
}

async function synthesizeOneChunk(spoken, { voice } = {}) {
  if (!spoken || spoken.length < 2) return null;
  if (hasHebrew(spoken)) {
    const g = await synthesizeGemini(spoken);
    if (g) return g;
  }
  let out = await synthesizeOpenAI(spoken, { voice });
  if (out) return out;
  const key = (process.env.OPENAI_API_KEY || "").trim();
  if (!key) return null;
  const format = process.env.EMET_TTS_FORMAT || "mp3";
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1-hd",
      input: spoken,
      voice: voice || process.env.EMET_TTS_VOICE || "nova",
      response_format: format,
      speed: Number(process.env.EMET_TTS_SPEED || 1.05),
    }),
  });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const ext = format === "opus" ? "ogg" : format;
  const filePath = path.join(OUT_DIR, `${Date.now()}_noa.${ext}`);
  fs.writeFileSync(filePath, buf);
  journal("tts_ok", { provider: "openai-hd", filePath });
  return { path: filePath, bytes: buf.length, text: spoken, at: nowIso() };
}

/**
 * One short chunk. Prefer synthesizeSpeechChunks for founder replies.
 */
export async function synthesizeSpeech(text, { voice } = {}) {
  const spoken = textForSpeech(text);
  return synthesizeOneChunk(spoken, { voice });
}

export async function synthesizeSpeechChunks(text, { voice } = {}) {
  const chunks = chunkForSpeech(text);
  const files = [];
  for (const chunk of chunks) {
    const audio = await synthesizeOneChunk(chunk, { voice });
    if (audio) files.push(audio);
  }
  return files;
}
