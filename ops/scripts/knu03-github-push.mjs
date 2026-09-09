/**
 * KNU-03 — Create private ZionAmar/kidnest and push (no secrets).
 * Uses git credential helper when `gh` is not logged in — the stall that
 * previously died silently.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { JOURNAL_DIR, nowIso } from "../../runtime/lib/paths.mjs";
import { ensurePrivateRepo } from "./github-git-auth.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = "C:/Users/amazi/Desktop/Projects/in_production/kidnest";
const OUT = path.join(
  __dirname,
  "../../agents/34-pc-ops/outbox/2026-09-09_knu03-repo-url.md"
);
const BOARD = path.join(__dirname, "../intake/kidnest-github-upload-board.json");
const FACTORY = path.join(__dirname, "../config/factory.json");
const REPO = "ZionAmar/kidnest";

function run(cmd, args, cwd = ROOT, timeout = 120000) {
  const r = spawnSync(cmd, args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
    timeout,
  });
  return {
    ok: r.status === 0,
    status: r.status,
    stdout: String(r.stdout || "").trim(),
    stderr: String(r.stderr || "").trim(),
  };
}

const leaked = run("git", ["ls-files"]).stdout
  .split(/\r?\n/)
  .filter((f) => /(^|\/)\.env$|config\.env$/.test(f.replace(/\\/g, "/")));
if (leaked.length) {
  console.error("SECRETS_IN_INDEX:", leaked);
  process.exit(1);
}

const created = await ensurePrivateRepo(REPO);
if (!created.ok) {
  console.error("CREATE_FAIL:", created.error || created.status);
  process.exit(5);
}

run("git", ["remote", "remove", "origin"]);
const add = run("git", [
  "remote",
  "add",
  "origin",
  `https://github.com/${REPO}.git`,
]);
if (!add.ok && !/already exists/i.test(add.stderr + add.stdout)) {
  console.error("REMOTE_ADD_FAIL:", add.stderr || add.stdout);
  process.exit(3);
}

const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]).stdout || "master";
const push = run("git", ["push", "-u", "origin", branch], ROOT, 600000);
if (!push.ok) {
  console.error("PUSH_FAIL:", push.stderr || push.stdout);
  process.exit(4);
}

const url = created.url || `https://github.com/${REPO}`;
const at = new Date().toISOString();
const md = `# KNU-03 — KidNest GitHub repo URL

**Status:** done  
**At:** ${at}  
**Repo:** \`${REPO}\` (private)  
**Source:** \`${ROOT}\`

## URL

${url}

`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md);

let board = {};
try {
  board = JSON.parse(fs.readFileSync(BOARD, "utf8"));
} catch {
  board = {};
}
board.updatedAt = at;
board.status = "done";
board.tasks = Array.isArray(board.tasks) ? board.tasks : [];
let knu03 = board.tasks.find((t) => t.id === "KNU-03");
if (!knu03) {
  knu03 = { id: "KNU-03", title: "Create private GitHub repo and push", owner: "34-pc-ops" };
  board.tasks.unshift(knu03);
}
knu03.status = "done";
knu03.completedAt = at;
knu03.artifact = "agents/34-pc-ops/outbox/2026-09-09_knu03-repo-url.md";
knu03.repo_url = url;
const knu04 = board.tasks.find((t) => t.id === "KNU-04");
if (knu04) {
  knu04.status = "done";
  knu04.completedAt = at;
  knu04.resultHe = `ריפו פרטי: ${url}`;
}
if (Array.isArray(board.phases)) {
  for (const p of board.phases) {
    if (p.id === "P3" || p.id === "P4") p.status = "done";
  }
}
fs.writeFileSync(BOARD, JSON.stringify(board, null, 2));

let factory = {};
try {
  factory = JSON.parse(fs.readFileSync(FACTORY, "utf8"));
} catch {
  factory = {};
}
factory.repos = factory.repos || {};
factory.repos.kidnest = {
  github: url,
  private: true,
  source: ROOT,
  pushedAt: at,
  task: "KNU-03",
};
if (factory.activeWork?.slug === "kidnest-github-upload") {
  factory.activeWork = {
    ...factory.activeWork,
    phase: "done",
    gate: "done",
    status: "done",
    waitingFor: "",
    next: "",
    repoUrl: url,
    finishedAt: at,
  };
}
factory.updatedAt = at.slice(0, 10);
fs.writeFileSync(FACTORY, JSON.stringify(factory, null, 2) + "\n");

const day = new Date().toISOString().slice(0, 10);
fs.mkdirSync(JOURNAL_DIR, { recursive: true });
fs.appendFileSync(
  path.join(JOURNAL_DIR, `${day}.jsonl`),
  `${JSON.stringify({
    at: nowIso(),
    event: "knu03_repo_pushed",
    repo: REPO,
    url,
    artifact: "agents/34-pc-ops/outbox/2026-09-09_knu03-repo-url.md",
    hq_ledger: "ops/config/factory.json",
  })}\n`
);

console.log(JSON.stringify({ ok: true, url, out: OUT }, null, 2));
