import path from "path";
import {
  RUNTIME_DIR,
  readJson,
  writeJson,
  nowIso,
  journal,
  ensureRuntimeDirs,
} from "./paths.mjs";

const WORK_PATH = path.join(RUNTIME_DIR, "work-board.json");

function defaultBoard() {
  return {
    updatedAt: nowIso(),
    execute: {
      status: "idle", // idle | running
      current: null, // { id, text, startedAt, summary }
      backlog: [], // [{ id, text, enqueuedAt }]
    },
  };
}

export function readWorkBoard() {
  ensureRuntimeDirs();
  return readJson(WORK_PATH, defaultBoard()) || defaultBoard();
}

export function writeWorkBoard(board) {
  board.updatedAt = nowIso();
  writeJson(WORK_PATH, board);
}

export function workStatusSummary() {
  const b = readWorkBoard();
  const ex = b.execute || {};
  if (ex.status === "running" && ex.current) {
    const n = (ex.backlog || []).length;
    return `ביצוע פעיל: «${String(ex.current.summary || ex.current.text).slice(0, 80)}»${
      n ? ` | בתור עוד ${n}` : ""
    }`;
  }
  if ((ex.backlog || []).length) {
    return `אין ביצוע פעיל; בתור ${ex.backlog.length} משימות`;
  }
  return "אין ביצוע כבד פעיל כרגע";
}

export function startExecuteJob(job) {
  const b = readWorkBoard();
  b.execute.status = "running";
  b.execute.current = {
    id: job.id,
    text: job.text,
    summary: String(job.text).replace(/\s+/g, " ").slice(0, 120),
    startedAt: nowIso(),
  };
  writeWorkBoard(b);
  journal("work_execute_start", { id: job.id });
  return b.execute.current;
}

export function finishExecuteJob({ ok = true, note = "" } = {}) {
  const b = readWorkBoard();
  const finished = b.execute.current;
  b.execute.status = "idle";
  b.execute.current = null;
  writeWorkBoard(b);
  journal("work_execute_finish", {
    id: finished?.id,
    ok,
    note: String(note).slice(0, 200),
    backlog: (b.execute.backlog || []).length,
  });
  return { finished, next: (b.execute.backlog || [])[0] || null };
}

export function enqueueExecuteBacklog(job) {
  const b = readWorkBoard();
  b.execute.backlog = b.execute.backlog || [];
  // dedupe similar text
  if (
    b.execute.backlog.some((x) => x.text === job.text) ||
    b.execute.current?.text === job.text
  ) {
    journal("work_execute_dedupe", { id: job.id });
    return { queued: false, reason: "duplicate", position: null };
  }
  b.execute.backlog.push({
    id: job.id,
    text: job.text,
    enqueuedAt: nowIso(),
    summary: String(job.text).replace(/\s+/g, " ").slice(0, 120),
    msg: job.msg
      ? {
          text: job.msg.text,
          wasVoice: job.msg.wasVoice,
          telegramMessageId: job.msg.telegramMessageId || job.id,
          attachments: job.msg.attachments || [],
        }
      : null,
  });
  writeWorkBoard(b);
  const position = b.execute.backlog.length;
  journal("work_execute_backlog", { id: job.id, position });
  return { queued: true, position };
}

export function shiftExecuteBacklog() {
  const b = readWorkBoard();
  const next = (b.execute.backlog || []).shift() || null;
  writeWorkBoard(b);
  return next;
}

export function isExecuteRunning() {
  return readWorkBoard().execute?.status === "running";
}
