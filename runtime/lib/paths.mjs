import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// This file lives in runtime/lib → company root is ../..
export const ROOT = path.resolve(__dirname, "..", "..");
export const OPS = path.join(ROOT, "ops");
export const RUNTIME_DIR = path.join(OPS, "runtime");
export const STATUS_PATH = path.join(RUNTIME_DIR, "status.json");
export const CHECKPOINT_PATH = path.join(RUNTIME_DIR, "checkpoint.json");
export const JOURNAL_DIR = path.join(RUNTIME_DIR, "journal");
export const STATE_PATH = path.join(OPS, "state.json");
export const PID_PATH = path.join(RUNTIME_DIR, "emet.pid");

export function ensureRuntimeDirs() {
  fs.mkdirSync(RUNTIME_DIR, { recursive: true });
  fs.mkdirSync(JOURNAL_DIR, { recursive: true });
  fs.mkdirSync(path.join(OPS, "intake", "ideas"), { recursive: true });
  fs.mkdirSync(path.join(OPS, "intake", "problems"), { recursive: true });
  fs.mkdirSync(path.join(OPS, "bus"), { recursive: true });
  fs.mkdirSync(path.join(OPS, "meetings"), { recursive: true });
  fs.mkdirSync(path.join(OPS, "daily"), { recursive: true });
}

export function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function nowIso() {
  return new Date().toISOString();
}

export function listIntakeFiles(kind) {
  const dir = path.join(OPS, "intake", kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => ({
      name: f,
      path: path.join(dir, f),
      mtime: fs.statSync(path.join(dir, f)).mtimeMs,
    }))
    .sort((a, b) => a.mtime - b.mtime);
}

export function journal(event, payload = {}) {
  ensureRuntimeDirs();
  const day = new Date().toISOString().slice(0, 10);
  const line = JSON.stringify({ at: nowIso(), event, ...payload }) + "\n";
  fs.appendFileSync(path.join(JOURNAL_DIR, `${day}.jsonl`), line, "utf8");
}
