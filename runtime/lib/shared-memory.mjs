import fs from "fs";
import path from "path";
import { OPS, ensureRuntimeDirs, nowIso, writeJson, readJson } from "./paths.mjs";

const MEMORY_DIR = path.join(OPS, "memory");
const SHARED = path.join(MEMORY_DIR, "SHARED.md");
const BOARD = path.join(OPS, "board.json");

export function ensureMemory() {
  ensureRuntimeDirs();
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
  if (!fs.existsSync(SHARED)) {
    fs.writeFileSync(
      SHARED,
      `# EMET Shared Memory\n\nLiving company brain — agents read/write here.\n\n## Current focus\n- Bootstrap Parity+\n\n## Open loops\n- (none)\n\n## Decisions log\n\n`,
      "utf8"
    );
  }
  if (!fs.existsSync(BOARD)) {
    writeJson(BOARD, {
      updatedAt: nowIso(),
      note: "Local stand-in for Linear until LINEAR_API_KEY is set — visible via dashboard/API; sync to Linear when keyed.",
      columns: {
        backlog: [],
        today: [],
        in_progress: [],
        blocked: [],
        waiting_founder: [],
        done: [],
      },
    });
  }
}

export function readSharedMemory() {
  ensureMemory();
  return fs.readFileSync(SHARED, "utf8");
}

export function appendSharedMemory(section, text) {
  ensureMemory();
  const stamp = nowIso();
  fs.appendFileSync(SHARED, `\n### ${section} — ${stamp}\n${text.trim()}\n`, "utf8");
}

export function readBoard() {
  ensureMemory();
  return readJson(BOARD, { columns: {} });
}

export function upsertBoardItem(column, item) {
  const board = readBoard();
  board.columns = board.columns || {};
  if (!board.columns[column]) board.columns[column] = [];
  const id = item.id || `task_${Date.now()}`;
  const rest = board.columns[column].filter((x) => x.id !== id);
  rest.push({ ...item, id, updatedAt: nowIso() });
  board.columns[column] = rest;
  // remove from other columns
  for (const [col, arr] of Object.entries(board.columns)) {
    if (col === column) continue;
    board.columns[col] = (arr || []).filter((x) => x.id !== id);
  }
  board.updatedAt = nowIso();
  writeJson(BOARD, board);
  return board;
}

export function listBoardForDigest() {
  const board = readBoard();
  const cols = board.columns || {};
  const lines = [];
  for (const [col, items] of Object.entries(cols)) {
    if (!items?.length) continue;
    lines.push(`*${col}*`);
    for (const it of items.slice(0, 12)) {
      lines.push(`- ${it.title || it.id}${it.owner ? ` (${it.owner})` : ""}`);
    }
  }
  return lines.join("\n") || "אין משימות בלוח עדיין.";
}
