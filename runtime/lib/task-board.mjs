/**
 * Local Hebrew task board (KidNest audit + future boards).
 * Statuses are stored in English for code; Hebrew labels for founder/Linear.
 */
import fs from "fs";
import path from "path";
import { OPS, ROOT, nowIso, journal, readJson, writeJson } from "./paths.mjs";

export const STATUS = {
  todo: "todo",
  ready: "ready",
  in_progress: "in_progress",
  waiting_founder: "waiting_founder",
  done: "done",
  blocked: "blocked",
};

export const STATUS_HE = {
  todo: "בתור",
  ready: "מוכנה להתחיל",
  in_progress: "בעבודה",
  waiting_founder: "ממתינה לאישורך",
  done: "הושלמה",
  blocked: "חסומה",
};

const DEFAULT_BOARD = path.join(OPS, "intake", "kidnest-audit-board.json");
const PIPELINE_PATH = path.join(OPS, "runtime", "task-pipeline.json");

export function boardPath() {
  const pipe = readJson(PIPELINE_PATH, {});
  if (pipe.boardPath) {
    return path.isAbsolute(pipe.boardPath)
      ? pipe.boardPath
      : path.join(ROOT, pipe.boardPath);
  }
  return DEFAULT_BOARD;
}

export function readBoard() {
  const p = boardPath();
  if (!fs.existsSync(p)) return { tasks: [], phases: [], summary: {} };
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function writeBoard(board) {
  board.updatedAt = nowIso();
  board.summary = summarize(board.tasks || []);
  fs.writeFileSync(boardPath(), JSON.stringify(board, null, 2) + "\n", "utf8");
  writeJson(path.join(OPS, "runtime", "task-board-snapshot.json"), {
    updatedAt: board.updatedAt,
    summary: board.summary,
    waiting: (board.tasks || []).filter((t) => t.status === STATUS.waiting_founder),
    inProgress: (board.tasks || []).filter((t) => t.status === STATUS.in_progress),
  });
  return board;
}

export function summarize(tasks) {
  const counts = {
    total: tasks.length,
    todo: 0,
    ready: 0,
    in_progress: 0,
    waiting_founder: 0,
    done: 0,
    blocked: 0,
  };
  for (const t of tasks) {
    const s = t.status || "todo";
    if (counts[s] != null) counts[s] += 1;
  }
  return counts;
}

export function statusHe(status) {
  return STATUS_HE[status] || status || "בתור";
}

export function readPipeline() {
  return (
    readJson(PIPELINE_PATH, null) || {
      boardPath: "ops/intake/kidnest-audit-board.json",
      mode: "gated_sequential",
      language: "he",
      currentTaskId: null,
      waitingFounder: false,
      lastCompletedId: null,
      lastReportAt: null,
      reportsDir: "ops/reports/tasks",
      voiceReports: true,
      emailReports: true,
      autoStartNextAfterApprove: true,
    }
  );
}

export function writePipeline(p) {
  writeJson(PIPELINE_PATH, { ...p, updatedAt: nowIso() });
}

export function findTask(board, id) {
  return (board.tasks || []).find((t) => t.id === id) || null;
}

export function setTaskStatus(taskId, status, extra = {}) {
  const board = readBoard();
  const t = findTask(board, taskId);
  if (!t) throw new Error(`Task not found: ${taskId}`);
  t.status = status;
  t.statusHe = statusHe(status);
  t.updatedAt = nowIso();
  Object.assign(t, extra);
  if (status === STATUS.done && !t.completedAt) t.completedAt = nowIso().slice(0, 10);
  writeBoard(board);
  journal("task_status", { id: taskId, status, statusHe: t.statusHe });
  return t;
}

/** Next unfinished task — gated mode prefers board order (id); else priority then id */
export function pickNextTask(board = readBoard()) {
  const pipe = readPipeline();
  const order = { P0: 0, P1: 1, P2: 2, P3: 3 };
  const open = (board.tasks || []).filter(
    (t) => !["done", "blocked"].includes(t.status)
  );
  const waiting = open.find((t) => t.status === STATUS.waiting_founder);
  if (waiting) return waiting;
  const progress = open.find((t) => t.status === STATUS.in_progress);
  if (progress) return progress;
  const ready = open.find((t) => t.status === STATUS.ready);
  if (ready) return ready;

  open.sort((a, b) => {
    if (pipe.mode === "gated_sequential") {
      return String(a.id).localeCompare(String(b.id), "en", { numeric: true });
    }
    const pa = order[a.priority] ?? 9;
    const pb = order[b.priority] ?? 9;
    if (pa !== pb) return pa - pb;
    return String(a.id).localeCompare(String(b.id), "en", { numeric: true });
  });
  return open[0] || null;
}

export function boardStatusHebrew(board = readBoard()) {
  const lines = (board.tasks || []).map(
    (t) =>
      `• ${t.id} [${statusHe(t.status)}] ${t.titleHe || t.title}`
  );
  const s = board.summary || summarize(board.tasks || []);
  return `לוח ${board.project || "AZTODEV"}
הושלמו ${s.done || 0}/${s.total || 0} · בעבודה ${s.in_progress || 0} · ממתינות לאישור ${s.waiting_founder || 0} · בתור ${(s.todo || 0) + (s.ready || 0)}

${lines.join("\n")}`;
}
