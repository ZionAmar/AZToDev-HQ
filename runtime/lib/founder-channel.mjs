/**
 * Git-tracked founder Telegram ledger — survives Cloud VM resets.
 * Local runtime copy (ops/runtime/telegram-thread.jsonl) is ephemeral; this is not.
 */
import fs from "fs";
import path from "path";
import { OPS, ROOT, ensureRuntimeDirs, nowIso } from "./paths.mjs";

const LEDGER_DIR = path.join(OPS, "founder-channel");
const LEDGER_PATH = path.join(LEDGER_DIR, "ledger.jsonl");
const LOCAL_THREAD_PATH = path.join(OPS, "runtime", "telegram-thread.jsonl");
const MAX_LINE_CHARS = 4000;
const MAX_LEDGER_BYTES = 512 * 1024;

function ensureLedgerDir() {
  fs.mkdirSync(LEDGER_DIR, { recursive: true });
}

function trimLedgerIfNeeded() {
  if (!fs.existsSync(LEDGER_PATH)) return;
  try {
    const stat = fs.statSync(LEDGER_PATH);
    if (stat.size <= MAX_LEDGER_BYTES) return;
    const lines = fs.readFileSync(LEDGER_PATH, "utf8").trim().split("\n").filter(Boolean);
    const keep = lines.slice(-Math.floor(lines.length * 0.6));
    fs.writeFileSync(LEDGER_PATH, keep.join("\n") + "\n", "utf8");
  } catch {
    /* ignore trim errors */
  }
}

/**
 * @param {string} role — founder | noa | system | 34-pc-ops | …
 * @param {string} text
 * @param {{ source?: string }} [meta]
 */
export function appendFounderChannel(role, text, { source = "desk" } = {}) {
  ensureRuntimeDirs();
  ensureLedgerDir();
  const entry = {
    at: nowIso(),
    role: String(role || "system").slice(0, 40),
    text: String(text || "").slice(0, MAX_LINE_CHARS),
    source: String(source || "desk").slice(0, 40),
  };
  const line = JSON.stringify(entry) + "\n";
  fs.appendFileSync(LEDGER_PATH, line, "utf8");
  fs.appendFileSync(LOCAL_THREAD_PATH, line, "utf8");
  trimLedgerIfNeeded();
  return entry;
}

function parseLedgerLines(lines) {
  return lines
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function readLedgerEntries(limit = 24) {
  if (!fs.existsSync(LEDGER_PATH)) return [];
  const lines = fs.readFileSync(LEDGER_PATH, "utf8").trim().split("\n").filter(Boolean);
  return parseLedgerLines(lines.slice(-limit));
}

function readLocalThreadEntries(limit = 24) {
  if (!fs.existsSync(LOCAL_THREAD_PATH)) return [];
  const lines = fs.readFileSync(LOCAL_THREAD_PATH, "utf8").trim().split("\n").filter(Boolean);
  return parseLedgerLines(lines.slice(-limit));
}

/** Merge git ledger + local thread, dedupe, newest last. */
export function recentFounderChannel(limit = 24) {
  const merged = [...readLedgerEntries(limit * 2), ...readLocalThreadEntries(limit * 2)];
  if (!merged.length) return "";

  const seen = new Set();
  const unique = [];
  for (const e of merged) {
    const key = `${e.at}|${e.role}|${e.text?.slice(0, 120)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(e);
  }
  unique.sort((a, b) => String(a.at).localeCompare(String(b.at)));

  return unique
    .slice(-limit)
    .map((j) => `${j.role}: ${j.text}`)
    .join("\n");
}

/** True if ledger already contains a matching specialist deliverable hint. */
export function founderChannelHasHint(re) {
  const entries = readLedgerEntries(200);
  const pattern = re instanceof RegExp ? re : new RegExp(String(re), "i");
  return entries.some((e) => pattern.test(String(e.text || "")));
}

export function founderChannelLedgerPath() {
  return path.relative(ROOT, LEDGER_PATH).replace(/\\/g, "/");
}
