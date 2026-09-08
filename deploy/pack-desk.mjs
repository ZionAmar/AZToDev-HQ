/**
 * Pack a slim HQ desk (no secrets, no node_modules, no chat dumps).
 * node deploy/pack-desk.mjs
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "ops", "outbox-founder", "_desk-pack");
const TAR = path.join(ROOT, "ops", "outbox-founder", "aztodev-desk.tgz");

const DIRS = ["hq", "runtime", "_company", "_shared", "ops/config"];
const AGENT_IDS = [
  "00-ceo",
  "33-household-ops",
  "34-pc-ops",
  "35-server-ops",
];
const FILES = ["package.json", "package-lock.json", "AGENTS.md"];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".git") continue;
    const from = path.join(src, ent.name);
    const to = path.join(dest, ent.name);
    if (ent.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const d of DIRS) {
  const src = path.join(ROOT, d);
  if (!fs.existsSync(src)) continue;
  copyDir(src, path.join(OUT_DIR, d));
}
for (const id of AGENT_IDS) {
  const src = path.join(ROOT, "agents", id);
  if (!fs.existsSync(src)) continue;
  copyDir(src, path.join(OUT_DIR, "agents", id));
}
for (const f of FILES) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(OUT_DIR, f));
}

const r = spawnSync(
  "tar",
  ["-czf", TAR, "-C", OUT_DIR, "."],
  { windowsHide: true, encoding: "utf8" }
);
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
const bytes = fs.statSync(TAR).size;
console.log(JSON.stringify({ tar: TAR, bytes, mb: +(bytes / 1024 / 1024).toFixed(2) }));
