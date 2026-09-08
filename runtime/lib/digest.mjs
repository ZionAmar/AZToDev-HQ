import fs from "fs";
import path from "path";
import { OPS, STATE_PATH, nowIso, readJson, writeJson } from "./paths.mjs";
import { listBoardForDigest, readSharedMemory } from "./shared-memory.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { llmChat, llmConfigured } from "./llm.mjs";
import { sanitizeForTelegram } from "./agent-sessions.mjs";

export async function buildEndOfDayDigest() {
  const state = readJson(STATE_PATH, {});
  const board = listBoardForDigest();
  const memoryTail = readSharedMemory().slice(-2500);
  const base = {
    date: nowIso().slice(0, 10),
    focuses: state.today?.focus || [],
    initiatives: state.initiatives || [],
    waiting: state.founderAttention?.waiting || [],
    board,
  };

  if (!llmConfigured()) {
    const text = `EMET | נורה | סוף-יום ${base.date}
Focus: ${(base.focuses || []).join(" · ") || "—"}
יוזמות: ${base.initiatives.length}
ממתינים לך: ${base.waiting.length ? base.waiting.map((w) => w.ask).join(" | ") : "אין"}
לוח:
${board}
(מוח LLM כבוי — סיכום גולמי. חבר ANTHROPIC_API_KEY לסיכום ברמת תום אבן+)`;
    return text;
  }

  const out = await llmChat({
    system:
      "You are Nura, EMET CEO and sole Telegram contact for founder ציון. Write a crisp Hebrew end-of-day summary. Max 12 lines. Include asks with APPROVE|CHOOSE|INFO only if real. No spam. If nothing material happened, say so in 3 lines.",
    user: JSON.stringify(base) + "\n\nMemory tail:\n" + memoryTail,
    maxTokens: 700,
  });
  return `EMET | נורה | סוף-יום\n${out.text}`;
}

export async function sendEndOfDayDigest() {
  const text = sanitizeForTelegram(await buildEndOfDayDigest()) || "EMET | נורה | סוף-יום — אין מה לדווח.";
  const sent = await sendFounderTelegram(text);
  try {
    const prefs = readJson(path.join(OPS, "founder-prefs.json"), {});
    if (prefs?.channels?.emailDailyDigest?.enabled) {
      const { sendFounderEmail } = await import("./mail.mjs");
      await sendFounderEmail({
        subject: `EMET | נורה | סוף-יום ${nowIso().slice(0, 10)}`,
        text,
        to: prefs.channels.emailDailyDigest.to || undefined,
      });
    }
  } catch (err) {
    /* email optional */
  }
  const dir = path.join(OPS, "daily");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${nowIso().slice(0, 10)}_eod.md`),
    text + "\n",
    "utf8"
  );
  const state = readJson(STATE_PATH, {});
  state.runtime = {
    ...(state.runtime || {}),
    lastEodAt: nowIso(),
    lastEodQueued: Boolean(sent.queued),
  };
  writeJson(STATE_PATH, state);
  return { text, sent };
}

export async function sendMajorActionSummary(title, body) {
  const text = `EMET | נורה | אחרי-פעולה
${title}

${body}

סוג: INFO (או Ask אם יש למטה)`;
  return sendFounderTelegram(text);
}
