import path from "path";
import {
  chatWithAgent,
  appendTelegramThread,
  resetAgentSession,
  sanitizeForTelegram,
} from "./agent-sessions.mjs";
import { sendFounderTelegram, sendFounderTelegramVoice } from "./telegram.mjs";
import { synthesizeSpeechChunks, ttsConfigured } from "./telegram-tts.mjs";
import { journal, readJson, OPS } from "./paths.mjs";
import { wrapFounderTelegramTurn } from "./prompt-builder.mjs";
import {
  isFounderApprove,
  approveAndStartNext,
  ensurePipelineBootstrapped,
} from "./task-pipeline.mjs";
import { readPipeline, boardStatusHebrew } from "./task-board.mjs";
import { isProductWorkEnabled } from "./company-state.mjs";
import {
  matchPhoneCommand,
  helpHebrew,
  companyStatusHebrew,
} from "./phone-commands.mjs";
import {
  actionPinConfigured,
  looksLikePinAttempt,
  pinMatches,
  unlockActionPin,
} from "./action-pin.mjs";
import { chatWithCloudCeo, cloudOpsConfigured } from "../../hq/lib/cloud-ceo.mjs";
import { hqCloudOnly } from "./specialist-runtime.mjs";

export { hqCloudOnly };

export { shouldPushUnsolicited, extractFounderPush } from "./front-desk-push.mjs";

const AGENT_TIMEOUT_MS = Number(process.env.EMET_TELEGRAM_AGENT_TIMEOUT_MS || 300000);
const ACK_AFTER_MS = Number(process.env.EMET_TELEGRAM_ACK_MS || 2500);
const PROGRESS_EVERY_MS = Number(process.env.EMET_TELEGRAM_PROGRESS_MS || 90000);

function isStatusAsk(raw) {
  const t = String(raw || "").trim().toLowerCase();
  if (!t) return false;
  if (t === "/status" || t === "status" || t === "סטטוס") return true;
  return /^(מה קורה|מה הסטטוס|מה המצב|איפה אנחנו)\s*[?.!]*(?:\s|$)/i.test(
    String(raw || "").trim()
  );
}

/** Instant founder-facing snapshot — no Cursor agent (never silent). */
export function buildFounderStatusBrief() {
  const core = companyStatusHebrew();
  if (!isProductWorkEnabled()) return core;

  const pipe = readPipeline();
  const jobs = readJson(path.join(OPS, "runtime", "background-jobs.json"), {
    jobs: [],
  });
  const running = (jobs.jobs || []).filter((j) => j.status === "running");
  const recent = (jobs.jobs || [])
    .filter((j) => j.status === "done" || j.status === "error")
    .slice(0, 3);
  const lines = [core, "", "צינור משימות:"];
  lines.push(
    `לוח: ${pipe.lastCompletedId ? `אחרונה שהושלמה ${pipe.lastCompletedId}` : "אין"} · ${
      pipe.waitingFounder ? "ממתינים לאישורך להמשיך" : pipe.currentTaskId
        ? `בעבודה: ${pipe.currentTaskId}`
        : "אין משימה פעילה בצינור"
    }`
  );
  if (running.length) {
    lines.push("עובדים עכשיו ברקע:");
    for (const j of running.slice(0, 5)) {
      lines.push(`• ${j.agentName || j.agentId} (${j.id})`);
    }
  } else {
    lines.push("אין סוכנים ברקע כרגע.");
  }
  if (recent.length) {
    lines.push("אחרונים שסיימו:");
    for (const j of recent) {
      lines.push(
        `• ${j.agentName || j.agentId}: ${j.status}${j.finishedAt ? ` · ${j.finishedAt.slice(11, 16)}` : ""}`
      );
    }
  }
  try {
    const brief = boardStatusHebrew();
    if (brief) lines.push("", brief.slice(0, 900));
  } catch {
    /* ignore */
  }
  lines.push(
    "",
    "פקודות: «סטטוס» · «עזרה» · «שיחה חדשה»."
  );
  return lines.join("\n");
}

function isVoiceInbound(msg) {
  if (msg?.wasVoice) return true;
  return /\[הקלטה קולית/.test(String(msg?.text || ""));
}

function wantsVoiceReply(msg) {
  const prefs = readJson(path.join(OPS, "founder-prefs.json"), {});
  const mode = prefs?.channels?.telegramFounderDm?.voiceReplies || "mirror";
  if (mode === "never") return false;
  if (mode === "always") return ttsConfigured();
  const asked = /תעני בקול|תגיבי בקול|בקולי|voice reply/i.test(
    String(msg?.text || "")
  );
  return Boolean(isVoiceInbound(msg) || asked) && ttsConfigured();
}

async function deliverReply(reply, msg) {
  const clean = sanitizeForTelegram(reply);
  if (!clean) return { via: "empty" };
  await sendFounderTelegram(clean, { silent: true });
  appendTelegramThread("noa", clean);
  if (!wantsVoiceReply(msg)) return { via: "text" };
  setImmediate(() => {
    (async () => {
      try {
        const files = await synthesizeSpeechChunks(clean);
        for (const audio of files) {
          if (audio?.path) {
            await sendFounderTelegramVoice(audio.path, { silent: true });
          }
        }
      } catch (err) {
        journal("voice_reply_fallback", { error: String(err?.message || err) });
      }
    })();
  });
  return { via: "text+voice" };
}

/**
 * Race with timeout; mid-wait progress pings so the founder is never left in the dark.
 */
function withTimeout(promise, ms, label) {
  let timer;
  let progressTimer;
  let settled = false;
  const startedAt = Date.now();
  const wrapped = promise.then(
    (v) => {
      settled = true;
      return { ok: true, value: v };
    },
    (e) => {
      settled = true;
      return { ok: false, error: e };
    }
  );
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => {
      resolve({ ok: false, timeout: true, error: new Error(`${label} timed out after ${ms}ms`) });
    }, ms);
  });
  if (PROGRESS_EVERY_MS > 0) {
    progressTimer = setInterval(() => {
      if (settled) return;
      const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
      sendFounderTelegram(
        `עדיין על זה (~${mins} דק׳). לא נעלמתי — אם זה נמשך כתוב «סטטוס» או «שיחה חדשה».`,
        { silent: true }
      ).catch(() => {});
    }, PROGRESS_EVERY_MS);
  }
  return Promise.race([wrapped, timeout]).finally(() => {
    clearTimeout(timer);
    if (progressTimer) clearInterval(progressTimer);
  }).then(async (r) => {
    if (r.timeout) {
      // Don't leave orphan forever — reset so next message can run
      try {
        resetAgentSession("00-ceo");
      } catch {
        /* ignore */
      }
      journal("front_desk_timeout_reset", { label, ms });
      // If the late promise still resolves, we ignore it (session was reset)
      wrapped.catch(() => {});
      throw r.error;
    }
    if (!r.ok) throw r.error;
    return r.value;
  });
}

async function runNoaTurn(prompt, founderText = "") {
  if (hqCloudOnly()) {
    if (!cloudOpsConfigured()) {
      return {
        ok: true,
        status: "desk_only",
        text:
          "הדלפק חי על ChemiCloud — תיקייה נפרדת, האתרים לא נגעו.\n" +
          "שיחה עם נועה ב-Cursor Cloud צריכה ריפו מפקדה פרטי (GITHUB_HQ_REPO).\n" +
          "בינתיים: «סטטוס» · «עזרה» · «שיחה חדשה».",
      };
    }
    const out = await withTimeout(
      chatWithCloudCeo(prompt, { founderText }),
      AGENT_TIMEOUT_MS,
      "Noa Cloud"
    );
    if (!out.ok) throw new Error(out.error || "cloud_ceo_failed");
    return { ok: true, text: out.text, status: "cloud" };
  }

  if (cloudOpsConfigured()) {
    const out = await withTimeout(
      chatWithCloudCeo(prompt, { founderText }),
      AGENT_TIMEOUT_MS,
      "Noa Cloud"
    );
    if (out.ok) return { ok: true, text: out.text, status: "cloud" };
    if (!out.fallback) throw new Error(out.error || "cloud_ceo_failed");
  }

  return withTimeout(chatWithAgent("00-ceo", prompt), AGENT_TIMEOUT_MS, "Noa");
}

/**
 * Telegram → נועה. Plain text in, plain reply out.
 */
export async function handleFounderTelegramMessage(input) {
  const msg = typeof input === "string" ? { text: input } : input || {};
  let raw = (msg.text || "").trim();
  if (!raw && !(msg.attachments || []).length) return { skipped: true };
  if (!raw) raw = "[מדיה]";

  raw = raw.replace(/^\[הקלטה קולית — תמלול\]:\s*/i, "").trim() || raw;

  if (actionPinConfigured() && looksLikePinAttempt(raw) && pinMatches(raw)) {
    unlockActionPin();
    const reply =
      "הסיסמה אושרה ל־10 דקות.\nפעולות שמשנות משהו — מותרות בחלון הזה, ורק אם תגיד במפורש מה לעשות.\nבדיקות (זיכרון, סטטוס, מייל לקריאה) בלי סיסמה.";
    await sendFounderTelegram(reply, { silent: false });
    appendTelegramThread("system", "[founder sent action PIN — redacted]");
    journal("front_desk_action_pin_ok", {});
    return { intent: "ACTION_PIN_OK", reply };
  }
  if (actionPinConfigured() && looksLikePinAttempt(raw) && !pinMatches(raw)) {
    const reply = "הסיסמה לא נכונה. פעולות שינוי נעולות. אפשר «סטטוס» בלי סיסמה.";
    await sendFounderTelegram(reply, { silent: false });
    journal("front_desk_action_pin_bad", {});
    return { intent: "ACTION_PIN_BAD", reply };
  }

  const lower = raw.toLowerCase();
  if (
    raw === "/new" ||
    raw === "/start" ||
    raw === "שיחה חדשה" ||
    lower === "new chat" ||
    raw === "/reset"
  ) {
    resetAgentSession("00-ceo");
    const reply = isProductWorkEnabled()
      ? "היי, אני נועה. מה על הפרק?"
      : "היי, אני נועה. אפשר לדבר, לבדוק מיילים/מחשב/שרת דרך הצוות. מוצר ב-GitHub — רק אחרי שתאשר ותשלח סיסמה. כתוב «סטטוס» או «עזרה».";
    await sendFounderTelegram(reply);
    appendTelegramThread("system", reply);
    return { intent: "RESET", reply };
  }

  appendTelegramThread("founder", raw);

  const phone = matchPhoneCommand(raw);
  if (phone === "help") {
    const reply = helpHebrew();
    await sendFounderTelegram(reply, { silent: false });
    appendTelegramThread("noa", reply);
    journal("front_desk_help", {});
    return { intent: "HELP", reply };
  }

  // Instant status — never waits on Cursor (founder visibility)
  if (phone === "status" || isStatusAsk(raw)) {
    const reply = buildFounderStatusBrief();
    await sendFounderTelegram(reply, { silent: false });
    appendTelegramThread("noa", reply);
    journal("front_desk_status_shortcut", {});
    return { intent: "STATUS", reply };
  }

  if (
    !isProductWorkEnabled() &&
    /^(התחילי|תתחילי|הפעל|הפעילי|תעבדי)\s*[!.]*$/i.test(raw)
  ) {
    const reply =
      "החברה מוכנה, אבל לא התחלתי עבודה — אין משימה.\nכתוב מה לעשות (למשל: «תבדקי מיילים» או «תבני X»). עד אז אף מוצר לא נגע.";
    await sendFounderTelegram(reply, { silent: false });
    appendTelegramThread("noa", reply);
    return { intent: "STANDBY_NEED_TASK", reply };
  }

  // Gated task pipeline: founder APPROVE → start next Hebrew task automatically
  if (!isProductWorkEnabled()) {
    // Standby: do not kick the old local task board.
  } else try {
    await ensurePipelineBootstrapped();
    const pipe = readPipeline();
    const wantsStart =
      isFounderApprove(raw) ||
      /^(התחילי|תתחילי|תתחילי מהמשימה|המשימה הבאה)\s*[!.]*$/i.test(raw);
    if (wantsStart && (pipe.waitingFounder || pipe.mode === "gated_sequential")) {
      const gate = await approveAndStartNext(raw);
      if (gate.done) {
        return { intent: "TASK_BOARD_DONE", reply: gate.message };
      }
      if (gate.kickPrompt) {
        let acked = false;
        const ackTimer = setTimeout(() => {
          acked = true;
          sendFounderTelegram("רגע, על זה…", { silent: true }).catch(() => {});
        }, ACK_AFTER_MS);
        try {
          let out = await withTimeout(
            chatWithAgent("00-ceo", gate.kickPrompt),
            AGENT_TIMEOUT_MS,
            "Nura task"
          );
          clearTimeout(ackTimer);
          const reply = sanitizeForTelegram(out.text);
          if (reply) await deliverReply(reply, msg);
          journal("front_desk_task_kick", {
            taskId: gate.taskId,
            ok: out.ok,
            softAck: acked,
          });
          return {
            intent: "TASK_APPROVED_NEXT",
            taskId: gate.taskId,
            reply,
            ok: out.ok,
          };
        } catch (err) {
          clearTimeout(ackTimer);
          throw err;
        }
      }
    }
  } catch (err) {
    journal("task_pipeline_gate_error", { error: String(err?.message || err) });
    // fall through to normal chat
  }

  // Soft ack if the turn takes more than a couple seconds — never silent forever
  let acked = false;
  const ackTimer = setTimeout(() => {
    acked = true;
    sendFounderTelegram("רגע, על זה…", { silent: true }).catch(() => {});
  }, ACK_AFTER_MS);

  try {
    const prompt = wrapFounderTelegramTurn(raw, "", msg);
    let out = await runNoaTurn(prompt, raw);

    if (
      !hqCloudOnly() &&
      (out.status === "wedged_reset" ||
        /already has active run/i.test(String(out.error || "")))
    ) {
      resetAgentSession("00-ceo");
      out = await runNoaTurn(prompt, raw);
    }

    clearTimeout(ackTimer);
    const reply = sanitizeForTelegram(out.text);
    if (reply) {
      await deliverReply(reply, msg);
      journal("front_desk_session", {
        ok: out.ok,
        status: out.status,
        runId: out.runId,
        softAck: acked,
      });
    } else {
      await sendFounderTelegram("רגע, יצא לי ריק — תכתוב שוב?", { silent: true });
    }

    return { intent: "SESSION", reply, ok: out.ok, runId: out.runId };
  } catch (err) {
    clearTimeout(ackTimer);
    const errText = String(err?.message || err).slice(0, 200);
    journal("front_desk_session_error", { error: errText });
    if (/Cannot use this model/i.test(errText)) {
      await sendFounderTelegram(
        "יש בעיה במודל של Cursor אצלי — כבר מטפלים. שלח שוב בעוד רגע.",
        { silent: true }
      );
    } else if (/timed out/i.test(errText)) {
      await sendFounderTelegram(
        "נעצרתי על timeout (~5 דק׳) — לא סיימתי לתת תשובה מלאה.\n" +
          "העבודה ברקע אולי המשיכה / אולי לא. כתוב «סטטוס» לראות מי עשה מה, או שלח שוב / «שיחה חדשה».\n" +
          "סליחה על השקט — זה באג שאנחנו סוגרים.",
        { silent: false }
      );
    } else {
      await sendFounderTelegram(
        "נתקעתי רגע. כתוב «סטטוס» או שלח שוב — אל תישאר בלי משוב.",
        { silent: true }
      );
    }
    return { intent: "ERROR", error: errText };
  }
}
