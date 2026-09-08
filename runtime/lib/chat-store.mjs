import fs from "fs";
import path from "path";
import { OPS, ensureRuntimeDirs, nowIso, writeJson, readJson } from "./paths.mjs";

export const CHAT_DIR = path.join(OPS, "chat");
export const CHAT_LOG = path.join(CHAT_DIR, "messages.jsonl");
export const ARTIFACTS_DIR = path.join(CHAT_DIR, "artifacts");

export function ensureChatDirs() {
  ensureRuntimeDirs();
  fs.mkdirSync(CHAT_DIR, { recursive: true });
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  if (!fs.existsSync(CHAT_LOG)) fs.writeFileSync(CHAT_LOG, "", "utf8");
}

export function appendMessage(msg) {
  ensureChatDirs();
  const full = {
    id: msg.id || `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    at: msg.at || nowIso(),
    ...msg,
  };
  fs.appendFileSync(CHAT_LOG, JSON.stringify(full) + "\n", "utf8");
  return full;
}

export function listMessages(limit = 200) {
  ensureChatDirs();
  const raw = fs.readFileSync(CHAT_LOG, "utf8");
  const lines = raw.split("\n").filter(Boolean);
  const msgs = lines.map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  }).filter(Boolean);
  return msgs.slice(-limit);
}

export function updateMessage(id, patch) {
  ensureChatDirs();
  const msgs = listMessages(5000);
  let found = false;
  const next = msgs.map((m) => {
    if (m.id !== id) return m;
    found = true;
    return { ...m, ...patch, updatedAt: nowIso() };
  });
  if (!found) return null;
  fs.writeFileSync(
    CHAT_LOG,
    next.map((m) => JSON.stringify(m)).join("\n") + (next.length ? "\n" : ""),
    "utf8"
  );
  return next.find((m) => m.id === id);
}

export function artifactDirFor(messageId) {
  const dir = path.join(ARTIFACTS_DIR, messageId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function listArtifacts(messageId) {
  const dir = path.join(ARTIFACTS_DIR, messageId);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((name) => ({
    name,
    url: `/ops/chat/artifacts/${messageId}/${encodeURIComponent(name)}`,
  }));
}
