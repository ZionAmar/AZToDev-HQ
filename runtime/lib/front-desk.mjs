import path from "path";
import {
  chatWithAgent,
  appendTelegramThread,
  resetAgentSession,
  sanitizeForTelegram,
  recentTelegramThread,
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
import { takeWaitingFounder } from "./waiting-founder.mjs";
import { enqueueWork } from "./work-queue.mjs";
import { dispatchNextInbox, releaseHeldInbox } from "./inbox-dispatcher.mjs";
import { readPipeline, boardStatusHebrew } from "./task-board.mjs";
import { isProductWorkEnabled, readFactory, writeFactory } from "./company-state.mjs";
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
import { classifyFounderSpeed } from "./models.mjs";
import { llmChat, llmConfigured } from "./llm.mjs";
import { appendLearning, founderFacingText } from "./agent-memory.mjs";
import { recordCompanyLesson } from "./company-lessons.mjs";
import { liveStatusHebrew } from "./live-status.mjs";
import { executeDelegateRelay } from "../../hq/lib/delegate-relay.mjs";

export { hqCloudOnly };

export { shouldPushUnsolicited, extractFounderPush } from "./front-desk-push.mjs";

function kickHeldJobs(jobs, { preferKeshet = false, founderText = "" } = {}) {
  let list = (jobs || []).filter((j) => j?.agentId && j?.task);
  if (preferKeshet) {
    const keshet = list.filter((j) => j.agentId === "32-delivery-lead");
    if (keshet.length) list = keshet;
  }
  enqueueWork(list, { founderText, fromAgentId: "00-ceo" });
  return list.length;
}

const AGENT_TIMEOUT_MS = Number(process.env.EMET_TELEGRAM_AGENT_TIMEOUT_MS || 420000);
const ACK_AFTER_MS = Number(process.env.EMET_TELEGRAM_ACK_MS || 2500);
const PROGRESS_EVERY_MS = Number(process.env.EMET_TELEGRAM_PROGRESS_MS || 90000);

async function fastNoaReply(founderText) {
  const status = liveStatusHebrew();
  const thread = recentTelegramThread(8);
  if (!llmConfigured()) {
    return {
      ok: true,
      status: "fast_local",
      text: [
        "קיבלתי. תשובה קצרה בלי Cloud (כדי לא ליפול על timeout):",
        "",
        status,
        "",
        "אם צריך ביצוע עמוק — כתוב במפורש מה לעשות (מיילים / מחשב / «תבנו»).",
      ].join("\n"),
    };
  }
  const out = await llmChat({
    prefer: "fast",
    maxTokens: 700,
    system:
      "את נועה, דלפק AZToDev. עברית קצרה ומקצועית. עני קודם. אל תמציאי שרצים/PR. " +
      "אם צריך מומחה — צייני DELEGATE: id | task בשורה נפרדת. אל תגידי שהפעלת מישהו בלי DELEGATE. " +
      "LIVE STATUS למטה הוא האמת.",
    user: `LIVE STATUS:\n${status}\n\nTHREAD:\n${thread || "(none)"}\n\nFOUNDER:\n${founderText}`,
  });
  const rawText = String(out.text || "").trim();
  // Same choke point Cloud Noa uses: real DELEGATE lines here become real jobs
  // (previously the fast lane's DELEGATE lines were silently discarded — the
  // exact "theater" root cause: text claimed a specialist was contacted but
  // nothing was ever queued). Also runs the false-claim + forced-delegate
  // safety net so a bare mention ("תפני לקשת") still starts real work instead
  // of a promise.
  const relay = await executeDelegateRelay(rawText, {
    background: true,
    fromAgentId: "00-ceo",
    founderText,
  });
  let text = founderFacingText(relay.cleanedText);
  const names = [...new Set(relay.delegateResults.filter(Boolean))];
  if (names.length === 1) {
    text = `${text}\n\n${names[0]} על זה ברקע. אעדכן כשיהיה תשובה.`.trim();
  } else if (names.length > 1) {
    text = `${text}\n\n${names.join(" ו")} על זה ברקע. אעדכן כשיהיה תשובה.`.trim();
  }
  return { ok: true, status: "fast_llm", text };
}

function learnFromTimeout(founderText) {
  appendLearning("00-ceo", {
    task: String(founderText || "").slice(0, 200),
    do: "For chat/status/compare questions use fast desk reply; reserve Cloud for real execute work",
    dont: "Spin a full Cursor Cloud Noa turn for every Telegram line — that hits the 5–7m timeout",
    note: "Front-desk timeout — recorded so next run improves",
  });
  recordCompanyLesson({
    kind: "noa_timeout",
    do: "Route short/chat founder asks to fast LLM; Cloud only for execute",
    dont: "Block the founder on a 5–7 minute Cloud turn for a status/compare question",
    note: "Telegram Noa timed out — lesson persisted to company-lessons.md",
  });
}

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
  const lines = [companyStatusHebrew()];
  try {
    const brief = boardStatusHebrew();
    if (brief) lines.push("", brief.slice(0, 600));
  } catch {
    /* ignore */
  }
  lines.push("", "פקודות: «סטטוס» · «עזרה» · «שיחה חדשה».");
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
  const speed = classifyFounderSpeed(founderText, recentTelegramThread(6));
  if (speed.lane === "chat") {
    journal("front_desk_fast_lane", { reason: speed.reason });
    return fastNoaReply(founderText);
  }

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
    try {
      const out = await withTimeout(
        chatWithCloudCeo(prompt, { founderText }),
        AGENT_TIMEOUT_MS,
        "Noa Cloud"
      );
      if (!out.ok) throw new Error(out.error || "cloud_ceo_failed");
      return { ok: true, text: out.text, status: "cloud" };
    } catch (err) {
      if (/timed out/i.test(String(err?.message || err))) {
        learnFromTimeout(founderText);
        const fast = await fastNoaReply(founderText).catch(() => null);
        if (fast?.text) {
          return {
            ok: true,
            status: "cloud_timeout_fast_fallback",
            text:
              "Cloud נעצר על זמן — עונה מהר מהדלפק (למדנו מזה):\n\n" +
              fast.text,
          };
        }
      }
      throw err;
    }
  }

  if (cloudOpsConfigured()) {
    try {
      const out = await withTimeout(
        chatWithCloudCeo(prompt, { founderText }),
        AGENT_TIMEOUT_MS,
        "Noa Cloud"
      );
      if (out.ok) return { ok: true, text: out.text, status: "cloud" };
      if (!out.fallback) throw new Error(out.error || "cloud_ceo_failed");
    } catch (err) {
      if (/timed out/i.test(String(err?.message || err))) {
        learnFromTimeout(founderText);
        const fast = await fastNoaReply(founderText).catch(() => null);
        if (fast?.text) {
          return {
            ok: true,
            status: "cloud_timeout_fast_fallback",
            text:
              "Cloud נעצר על זמן — עונה מהר מהדלפק (למדנו מזה):\n\n" +
              fast.text,
          };
        }
      }
      throw err;
    }
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
    const pending = takeWaitingFounder("pin");
    if (pending?.jobs?.length || pending?.agentId) {
      const jobs = pending.jobs?.length
        ? pending.jobs
        : [{ agentId: pending.agentId, task: pending.task }];
      const n = kickHeldJobs(jobs, {
        preferKeshet: false,
        founderText: pending.task || "",
      });
      const reply =
        "הסיסמה אושרה. ממשיכים מיד באותה משימה — בלי שתחזור עליה.";
      await sendFounderTelegram(reply, { silent: false });
      appendTelegramThread("system", "[founder sent action PIN — redacted]");
      journal("front_desk_action_pin_resume", { n });
      return { intent: "ACTION_PIN_RESUME", reply };
    }
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

  if (isFounderApprove(raw)) {
    const pending = takeWaitingFounder("confirm");
    releaseHeldInbox();
    const factory = readFactory();
    if (factory.activeWork?.gate === "confirm") {
      writeFactory({
        activeWork: {
          ...factory.activeWork,
          gate: "pin",
          waitingFor: `סיסמה כדי להמשיך «${factory.activeWork.bet || factory.activeWork.slug}»`,
          next: factory.activeWork.next || "המומחה הבא רץ — נדב על דיסק אם צריך GitHub",
        },
      });
    }
    if (pending?.jobs?.length) {
      const n = kickHeldJobs(pending.jobs, {
        preferKeshet: true,
        founderText: pending.task || "",
      });
      const reply =
        "מאושר. קשת/הצוות ממשיכים לפי התוכנית. אעדכן בטיקטים ובטלגרם.";
      await sendFounderTelegram(reply, { silent: false });
      appendTelegramThread("noa", reply);
      journal("front_desk_confirm_resume", { n });
      return { intent: "CONFIRM_RESUME", reply };
    }
    dispatchNextInbox();
    const reply =
      "מאושר. מעירים את מי שחיכה בתיבה — אחד בכל פעם. אעדכן כשצריך סיסמה או כשזה זז.";
    await sendFounderTelegram(reply, { silent: false });
    appendTelegramThread("noa", reply);
    journal("front_desk_confirm_inbox_release", {});
    return { intent: "CONFIRM_INBOX", reply };
  }

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
      learnFromTimeout(raw);
      let recovery = "";
      try {
        const fast = await fastNoaReply(raw);
        recovery = fast?.text ? `\n\n${fast.text}` : "";
      } catch {
        /* ignore */
      }
      await sendFounderTelegram(
        "נעצרתי על timeout — רשמתי שיעור לחברה ולנועה, ולא אחזור על אותו דפוס.\n" +
          "שאלות קצרות/סטטוס רצות עכשיו במסלול מהיר; Cloud רק לביצוע." +
          recovery,
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
