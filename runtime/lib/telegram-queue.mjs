import { journal } from "./paths.mjs";
import { handleFounderTelegramMessage } from "./front-desk.mjs";
import { sendFounderTelegram } from "./telegram.mjs";

const MAX_QUEUE = 40;

const queue = [];
const seenIds = new Set();
let busy = false;

export function telegramQueueLength() {
  return queue.length + (busy ? 1 : 0);
}

export function getQueueSnapshot() {
  return { waiting: queue.length, busy };
}

function rememberId(msg) {
  const id = msg?.telegramMessageId || msg?.messageId;
  if (id == null) return true;
  const key = String(id);
  if (seenIds.has(key)) return false;
  seenIds.add(key);
  if (seenIds.size > 800) {
    const first = seenIds.values().next().value;
    seenIds.delete(first);
  }
  return true;
}

/**
 * FIFO into Nura's Cursor session — one message at a time, like a Cursor chat.
 */
export function enqueueFounderTelegram(msg) {
  if (!rememberId(msg)) {
    journal("telegram_dedupe_skip", {
      messageId: msg?.telegramMessageId || msg?.messageId,
    });
    return;
  }

  const text = String(msg?.text || "").trim();
  if (!text && !(msg?.attachments?.length)) return;

  if (queue.length >= MAX_QUEUE) {
    const dropped = queue.shift();
    journal("telegram_queue_drop", {
      text: String(dropped?.text || "").slice(0, 80),
    });
  }

  queue.push(msg);
  journal("telegram_enqueued", {
    text: text.slice(0, 120),
    queue: telegramQueueLength(),
  });
  pump();
}

async function pump() {
  if (busy) return;
  busy = true;
  try {
    while (queue.length) {
      const m = queue.shift();
      try {
        await handleFounderTelegramMessage(m);
      } catch (err) {
        journal("telegram_turn_error", { error: String(err?.message || err) });
        try {
          await sendFounderTelegram("רגע אחד נתקעתי — שלח שוב.", {
            silent: true,
          });
        } catch {
          /* ignore */
        }
      }
    }
  } finally {
    busy = false;
    if (queue.length) pump();
  }
}

/** Kept for callers after older work-board path. */
export function kickExecuteQueue() {
  pump();
}
