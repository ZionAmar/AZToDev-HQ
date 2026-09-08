/**
 * Gated sequential task pipeline:
 * work → mark status → Hebrew voice TG + email report → wait founder APPROVE → next
 */
import fs from "fs";
import path from "path";
import {
  OPS,
  ROOT,
  nowIso,
  journal,
} from "./paths.mjs";
import {
  STATUS,
  statusHe,
  readBoard,
  writeBoard,
  findTask,
  setTaskStatus,
  pickNextTask,
  readPipeline,
  writePipeline,
  boardStatusHebrew,
} from "./task-board.mjs";
import { sendFounderTelegram, sendFounderTelegramVoice } from "./telegram.mjs";
import { synthesizeSpeechChunks, ttsConfigured } from "./telegram-tts.mjs";
import { sendFounderEmail, emailConfigured } from "./mail.mjs";

function reportsDir() {
  const pipe = readPipeline();
  const dir = path.join(ROOT, pipe.reportsDir || "ops/reports/tasks");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function isFounderApprove(text) {
  const t = String(text || "").trim();
  if (!t) return false;
  if (/^(כן|יאללה|המשך|תמשיכי|קדימה|אשר|מאושר|גו|go|ok|okay|approve)\s*[!.]*$/i.test(t)) {
    return true;
  }
  if (/APPROVE|אשר(?:י)? את (?:ה)?(?:המשך|הבאה|המשימה)|המשימה הבאה|למשימה הבאה/i.test(t)) {
    return true;
  }
  return false;
}

/**
 * Mark task done (or waiting_founder if you want gate before marking done).
 * Default: mark done, report, set next to ready + waitingFounder.
 */
export async function completeTaskAndReport({
  taskId,
  summaryHe,
  detailsHe = "",
  artifact = "",
  markDone = true,
} = {}) {
  const board = readBoard();
  const task = findTask(board, taskId);
  if (!task) throw new Error(`Task not found: ${taskId}`);

  const title = task.titleHe || task.title;
  if (markDone) {
    setTaskStatus(taskId, STATUS.done, {
      resultHe: summaryHe,
      artifact: artifact || task.artifact || "",
    });
  } else {
    setTaskStatus(taskId, STATUS.waiting_founder, {
      resultHe: summaryHe,
      artifact: artifact || task.artifact || "",
    });
  }

  const next = pickNextTask(readBoard());
  if (next && next.id !== taskId && next.status === STATUS.todo) {
    setTaskStatus(next.id, STATUS.ready);
  }

  const pipe = readPipeline();
  pipe.lastCompletedId = taskId;
  pipe.lastReportAt = nowIso();
  pipe.waitingFounder = true;
  pipe.currentTaskId = next && next.id !== taskId ? next.id : null;
  writePipeline(pipe);

  const boardSnap = boardStatusHebrew();
  const nextTitle = next ? next.titleHe || next.title : "אין — הלוח הושלם";
  const nextId = next && next.id !== taskId ? next.id : null;

  const reportBody = `משימה ${taskId} — ${title}
סטטוס: ${statusHe(markDone ? STATUS.done : STATUS.waiting_founder)}

סיכום:
${summaryHe}

${detailsHe ? `פירוט:\n${detailsHe}\n` : ""}${artifact ? `קובץ: ${artifact}\n` : ""}
———
המשימה הבאה המוצעת: ${nextId ? `${nextId} — ${nextTitle}` : nextTitle}

APPROVE: אשר להמשיך למשימה הבאה (כתוב «כן» / «המשך» / «אשר»)
או כתוב מה לשנות.

———
${boardSnap}`;

  const reportFile = path.join(
    reportsDir(),
    `${nowIso().slice(0, 10)}_${taskId}.md`
  );
  fs.writeFileSync(
    reportFile,
    `# דוח משימה ${taskId}\n\n${nowIso()}\n\n${reportBody}\n`,
    "utf8"
  );

  // Telegram text
  const tgText = `✅ הושלמה: ${taskId}
${title}

${summaryHe}

סטטוס עודכן בלוח${artifact ? `\nקובץ: ${artifact}` : ""}

הבאה: ${nextId ? `${nextId} — ${nextTitle}` : "אין"}

APPROVE: כתוב «כן» כדי שאתחיל את הבאה.`;

  await sendFounderTelegram(tgText, { silent: false });

  // Voice report
  if (pipe.voiceReports !== false && ttsConfigured()) {
    try {
      const speak = `ציון, סיימתי את משימה ${taskId}. ${title}. ${summaryHe}. המשימה הבאה: ${nextTitle}. אם מאשר — כתוב כן.`;
      const files = await synthesizeSpeechChunks(speak);
      for (const audio of files) {
        if (audio?.path) {
          await sendFounderTelegramVoice(audio.path, {
            caption: `דוח קולי · ${taskId}`,
            silent: false,
          });
        }
      }
    } catch (err) {
      journal("task_voice_report_fail", { error: String(err?.message || err) });
    }
  }

  // Email
  if (pipe.emailReports !== false && emailConfigured()) {
    try {
      await sendFounderEmail({
        subject: `EMET · דוח משימה ${taskId} הושלמה — ממתין לאישורך להמשך`,
        text: reportBody,
        html: `<div dir="rtl" style="font-family:Segoe UI,Arial,sans-serif;line-height:1.55;max-width:720px;color:#111">
  <h2 style="margin-bottom:0.2em">דוח משימה ${esc(taskId)}</h2>
  <p style="color:#555;margin-top:0">${esc(title)}</p>
  <p><strong>סטטוס:</strong> ${esc(statusHe(STATUS.done))}</p>
  <h3>סיכום</h3>
  <p>${esc(summaryHe).replace(/\n/g, "<br>")}</p>
  ${detailsHe ? `<h3>פירוט</h3><p>${esc(detailsHe).replace(/\n/g, "<br>")}</p>` : ""}
  ${artifact ? `<p><strong>קובץ:</strong> <code>${esc(artifact)}</code></p>` : ""}
  <hr>
  <p><strong>המשימה הבאה:</strong> ${esc(nextId ? `${nextId} — ${nextTitle}` : nextTitle)}</p>
  <p style="background:#f6f3ee;padding:12px;border-radius:8px"><strong>APPROVE</strong> — השב בטלגרם «כן» / «המשך» כדי שנתחיל אוטומטית.</p>
  <pre style="white-space:pre-wrap;background:#fafafa;padding:12px;border-radius:8px;font-size:13px">${esc(boardSnap)}</pre>
</div>`,
      });
    } catch (err) {
      journal("task_email_report_fail", { error: String(err?.message || err) });
    }
  }

  // Best-effort Linear status sync
  try {
    const { syncTaskToLinear } = await import("./linear-tasks.mjs");
    await syncTaskToLinear(taskId);
    if (nextId) await syncTaskToLinear(nextId);
  } catch (err) {
    journal("task_linear_sync_skip", { error: String(err?.message || err).slice(0, 160) });
  }

  journal("task_complete_report", { taskId, nextId, reportFile });
  return { taskId, nextId, reportFile, waitingFounder: true };
}

/**
 * Founder approved — start next task (status in_progress) and return brief for Nura.
 */
export async function approveAndStartNext(founderText = "") {
  const pipe = readPipeline();
  const board = readBoard();
  let next = null;

  if (pipe.currentTaskId) {
    next = findTask(board, pipe.currentTaskId);
  }
  if (!next || ["done", "blocked"].includes(next.status)) {
    next = pickNextTask(board);
  }
  if (!next) {
    pipe.waitingFounder = false;
    pipe.currentTaskId = null;
    writePipeline(pipe);
    const msg = "אין משימות פתוחות בלוח — הכל הושלם או חסום.";
    await sendFounderTelegram(msg, { silent: false });
    return { ok: true, done: true, message: msg };
  }

  setTaskStatus(next.id, STATUS.in_progress, {
    startedAt: nowIso(),
  });
  pipe.waitingFounder = false;
  pipe.currentTaskId = next.id;
  writePipeline(pipe);

  try {
    const { syncTaskToLinear } = await import("./linear-tasks.mjs");
    await syncTaskToLinear(next.id);
  } catch {
    /* optional */
  }

  const title = next.titleHe || next.title;
  const kick = `מאשר להמשיך. בצע עכשיו את משימה ${next.id}: ${title}.
Definition of done: ${next.dod || "—"}.
כשסיימת — קרא ל־emet_complete_task עם סיכום בעברית (ואז דוח קולי+מייל יישלחו אוטומטית ואחכה שוב לאישור).`;

  await sendFounderTelegram(
    `מתחילה: ${next.id}\n${title}\nסטטוס בלוח: ${statusHe(STATUS.in_progress)}`,
    { silent: false }
  );

  journal("task_approved_next", { id: next.id, founderText: String(founderText).slice(0, 80) });
  return {
    ok: true,
    done: false,
    taskId: next.id,
    title,
    kickPrompt: kick,
  };
}

export async function ensurePipelineBootstrapped() {
  const pipe = readPipeline();
  writePipeline(pipe);
  const board = readBoard();
  // Hebraize statusHe on all tasks
  let changed = false;
  for (const t of board.tasks || []) {
    const he = statusHe(t.status || "todo");
    if (t.statusHe !== he) {
      t.statusHe = he;
      changed = true;
    }
    if (!t.titleHe && t.title) {
      t.titleHe = t.title; // may already be Hebrew
      changed = true;
    }
  }
  if (changed) writeBoard(board);
  return pipe;
}
