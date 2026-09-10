/**
 * PCI-17b — Unified cake-recipe-demo repo create + bundle + DevOps + Pages push.
 * Stages from ops/exports/cake-recipe-demo/ (7 files). Writes ops/reports/pci-17b-unified-push.json.
 */
import fs from "fs";
import path from "path";
import os from "os";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { githubApi, ensurePrivateRepo, readGithubHttpsCreds } from "./github-git-auth.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HQ_ROOT = path.join(__dirname, "../..");
const EXPORT_DIR = path.join(HQ_ROOT, "ops/exports/cake-recipe-demo");
const REPORT_PATH = path.join(HQ_ROOT, "ops/reports/pci-17b-unified-push.json");
const REPO = "ZionAmar/cake-recipe-demo";
const PAGES_URL = "https://zionamar.github.io/cake-recipe-demo/";
const COMMIT_MSG = "feat: RTL cake recipe demo + Docker + GitHub Pages workflow";

const REQUIRED = [
  "index.html",
  "styles.css",
  "README.md",
  "Dockerfile",
  ".dockerignore",
  ".github/workflows/pages.yml",
  "PAGES_SETUP.md",
];

function run(cmd, args, cwd, timeout = 120000) {
  const r = spawnSync(cmd, args, {
    cwd,
    encoding: "utf8",
    timeout,
  });
  return {
    ok: r.status === 0,
    status: r.status,
    stdout: String(r.stdout || "").trim(),
    stderr: String(r.stderr || "").trim(),
  };
}

/** Fallback when git credential helper is empty (Cloud Linux). */
async function ghApi(method, urlPath, body) {
  const args = ["api", "-X", method, urlPath];
  if (body) {
    for (const [k, v] of Object.entries(body)) args.push("-f", `${k}=${v}`);
  }
  const r = run("gh", args, HQ_ROOT, 60000);
  let json = null;
  try {
    json = r.stdout ? JSON.parse(r.stdout) : null;
  } catch {
    json = null;
  }
  const status = Number(json?.status ?? (r.ok ? 200 : r.status || 0));
  return { ok: r.ok && !json?.message?.includes("not accessible"), status, json, stderr: r.stderr };
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function verifyExports() {
  const missing = REQUIRED.filter((rel) => !fs.existsSync(path.join(EXPORT_DIR, rel)));
  return { ok: missing.length === 0, missing, count: REQUIRED.length - missing.length };
}

function curlHead(url) {
  const r = run("curl", ["-sS", "-o", "/dev/null", "-w", "%{http_code}", "-I", "-L", "--max-time", "20", url]);
  const code = parseInt(r.stdout, 10);
  return { ok: r.ok && code > 0, statusCode: Number.isFinite(code) ? code : null, stderr: r.stderr };
}

const report = {
  at: new Date().toISOString(),
  task: "PCI-17b",
  repo: REPO,
  exportDir: "ops/exports/cake-recipe-demo",
  exportVerify: verifyExports(),
  push: { ok: false },
  commitSha: null,
  repoPrivate: null,
  pagesEnable: { ok: false },
  workflow: { ok: false },
  curl: { url: PAGES_URL, statusCode: null },
  errors: [],
};

if (!report.exportVerify.ok) {
  report.errors.push(`missing_export_files: ${report.exportVerify.missing.join(", ")}`);
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
}

const creds = readGithubHttpsCreds();
report.cloudAuth = { gitCredential: creds.ok, ghAccount: run("gh", ["auth", "status"], HQ_ROOT).stdout?.split("\n")[1]?.trim() || null };

let created = await ensurePrivateRepo(REPO);
if (!created.ok && !creds.ok) {
  const probe = await ghApi("GET", `/repos/${REPO}`);
  if (probe.status === 404 || probe.json?.message === "Not Found") {
    const tryCreate = await ghApi("POST", "/user/repos", { name: "cake-recipe-demo", private: "true" });
    created = {
      ok: tryCreate.ok || tryCreate.status === 422,
      existed: tryCreate.status === 422,
      url: `https://github.com/${REPO}`,
      error: tryCreate.ok ? null : tryCreate.json?.message || `create_failed_${tryCreate.status}`,
      status: tryCreate.status,
      via: "gh",
    };
  } else if (probe.ok) {
    created = { ok: true, existed: true, url: probe.json?.html_url, via: "gh" };
  }
}
report.repoCreate = {
  ok: created.ok,
  existed: created.existed ?? null,
  url: created.url ?? null,
  error: created.error ?? null,
  status: created.status ?? null,
  via: created.via ?? (creds.ok ? "git-credential" : "none"),
};
if (!created.ok) {
  report.errors.push(`repo_create_failed: ${created.error || created.status} (Cloud GitHub App cannot mutate founder personal repos — delegate 34-pc-ops)`);
  report.curl = { ...report.curl, ...curlHead(PAGES_URL) };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  process.exit(5);
}

const api = creds.ok ? githubApi : ghApi;
const repoView = await api("GET", `/repos/${REPO}`);
if (repoView.ok && repoView.json) {
  report.repoPrivate = repoView.json.private === true;
  report.repoVisibility = repoView.json.visibility ?? null;
} else {
  report.errors.push(`repo_view_failed: ${repoView.status}`);
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "cake-recipe-demo-"));
copyDir(EXPORT_DIR, workDir);

run("git", ["init", "-b", "main"], workDir);
run("git", ["config", "user.email", "devops@aztodev.local"], workDir);
run("git", ["config", "user.name", "AZToDev DevOps"], workDir);
run("git", ["add", "-A"], workDir);
const commit = run("git", ["commit", "-m", COMMIT_MSG], workDir);
if (!commit.ok) {
  report.errors.push(`commit_failed: ${commit.stderr || commit.stdout}`);
} else {
  const sha = run("git", ["rev-parse", "HEAD"], workDir);
  report.commitSha = sha.stdout || null;
}

const remoteAdd = run(
  "git",
  ["remote", "add", "origin", `https://github.com/${REPO}.git`],
  workDir
);
if (!remoteAdd.ok && !/already exists/i.test(remoteAdd.stderr + remoteAdd.stdout)) {
  report.errors.push(`remote_add_failed: ${remoteAdd.stderr || remoteAdd.stdout}`);
}

const push = run("git", ["push", "-u", "origin", "main", "--force"], workDir, 600000);
report.push = {
  ok: push.ok,
  status: push.status,
  stderr: push.stderr || null,
  stdout: push.stdout || null,
};
if (!push.ok) {
  report.errors.push(`push_failed: ${push.stderr || push.stdout || push.status}`);
}

const pagesEnable = await api("POST", `/repos/${REPO}/pages`, {
  build_type: "workflow",
});
report.pagesEnable = {
  ok: pagesEnable.ok || pagesEnable.status === 409,
  status: pagesEnable.status,
  message: pagesEnable.json?.message ?? null,
};
if (!report.pagesEnable.ok) {
  report.errors.push(`pages_enable_failed: ${pagesEnable.status} ${pagesEnable.json?.message || ""}`.trim());
}

await new Promise((r) => setTimeout(r, 8000));

const runs = await api("GET", `/repos/${REPO}/actions/workflows/pages.yml/runs?per_page=1`);
if (runs.ok && runs.json?.workflow_runs?.length) {
  const w = runs.json.workflow_runs[0];
  report.workflow = {
    ok: w.status === "completed" && w.conclusion === "success",
    id: w.id,
    status: w.status,
    conclusion: w.conclusion,
    html_url: w.html_url,
  };
} else {
  report.workflow = {
    ok: false,
    status: runs.status,
    message: runs.json?.message ?? "no_runs_yet",
  };
  if (!runs.ok) report.errors.push(`workflow_list_failed: ${runs.status}`);
}

report.curl = { ...report.curl, ...curlHead(PAGES_URL) };

fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n");

try {
  fs.rmSync(workDir, { recursive: true, force: true });
} catch {
  /* ignore */
}

console.log(JSON.stringify(report, null, 2));
process.exit(report.push.ok ? 0 : 4);
