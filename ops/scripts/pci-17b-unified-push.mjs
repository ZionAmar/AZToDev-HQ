/**
 * PCI-17b — Create private ZionAmar/cake-recipe-demo, push unified bundle,
 * enable Pages (workflow source), verify deploy + live URL.
 * Uses github-git-auth.mjs (git credential helper / founder PC creds).
 * Writes ops/reports/pci-17b-unified-push.json with full results.
 */
import fs from "fs";
import path from "path";
import os from "os";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  ensurePrivateRepo,
  githubApi,
  readGithubHttpsCreds,
} from "./github-git-auth.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HQ_ROOT = path.join(__dirname, "../..");
const EXPORT = path.join(HQ_ROOT, "ops/exports/cake-recipe-demo");
const REPORT = path.join(HQ_ROOT, "ops/reports/pci-17b-unified-push.json");
const REPO = "ZionAmar/cake-recipe-demo";
const COMMIT_MSG = "feat: RTL cake recipe demo + Docker + GitHub Pages workflow";
const PAGES_URL = "https://zionamar.github.io/cake-recipe-demo/";
const REQUIRED = [
  "index.html",
  "styles.css",
  "README.md",
  "Dockerfile",
  ".dockerignore",
  "PAGES_SETUP.md",
  ".github/workflows/pages.yml",
];

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: "utf8",
    windowsHide: true,
    timeout: opts.timeout ?? 120000,
    cwd: opts.cwd,
    env: opts.env ?? process.env,
    input: opts.input,
  });
  return {
    ok: r.status === 0,
    status: r.status,
    stdout: String(r.stdout || "").trim(),
    stderr: String(r.stderr || "").trim(),
  };
}

function copyExport(destRoot) {
  for (const rel of REQUIRED) {
    const src = path.join(EXPORT, rel);
    const dest = path.join(destRoot, rel);
    if (!fs.existsSync(src)) {
      return { ok: false, missing: rel };
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
  return { ok: true };
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

async function enablePagesWorkflowSource(owner, name) {
  return githubApi("POST", `/repos/${owner}/${name}/pages`, {
    build_type: "workflow",
  });
}

async function getLatestWorkflowRun(owner, name) {
  const r = await githubApi(
    "GET",
    `/repos/${owner}/${name}/actions/workflows/pages.yml/runs?per_page=1`
  );
  if (!r.ok) return { ok: false, status: r.status, error: "workflow_list_failed" };
  const run = r.json?.workflow_runs?.[0];
  return { ok: true, run: run || null };
}

async function curlHead(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return { ok: true, status: res.status, url: res.url };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

const report = {
  at: new Date().toISOString(),
  task: "PCI-17b",
  repo: REPO,
  exportDir: EXPORT,
  bundle: { required: REQUIRED.length, present: [], missing: [] },
  auth: {},
  repoCreate: null,
  push: null,
  commitSha: null,
  repoPrivate: null,
  pagesEnable: null,
  workflowRun: null,
  curl: null,
  ok: false,
  blockedReason: null,
};

for (const rel of REQUIRED) {
  const p = path.join(EXPORT, rel);
  if (fs.existsSync(p)) report.bundle.present.push(rel);
  else report.bundle.missing.push(rel);
}

if (report.bundle.missing.length) {
  report.blockedReason = "export_bundle_incomplete";
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
}

const credProbe = run("git", ["credential", "fill"], {
  input: "protocol=https\nhost=github.com\n\n",
});
report.auth.gitCredentialFill = credProbe.ok ? "ok" : "failed";
if (!credProbe.ok) {
  report.auth.gitCredentialDetail = credProbe.stderr || "credential_fill_failed";
}

const ghToken = run("gh", ["auth", "token"]);
report.auth.ghTokenAvailable = ghToken.ok;
report.auth.ghAccount = run("gh", ["auth", "status"]).stdout.match(/account (\S+)/)?.[1] || null;
const authCreds = readGithubHttpsCreds();
report.auth.apiSource = authCreds.source ?? null;
report.auth.apiOk = authCreds.ok;

const [owner, name] = REPO.split("/");
const repoCreate = await ensurePrivateRepo(REPO);
report.repoCreate = {
  ok: repoCreate.ok,
  existed: repoCreate.existed ?? null,
  url: repoCreate.url ?? null,
  error: repoCreate.error ?? null,
  status: repoCreate.status ?? null,
};

if (!repoCreate.ok) {
  report.blockedReason = "repo_create_failed";
  const pre = await githubApi("GET", `/repos/${owner}/${name}`);
  report.repoCreate.preCheck = {
    status: pre.status,
    private: pre.json?.private ?? null,
    message: pre.json?.message ?? null,
  };
  report.curl = await curlHead(PAGES_URL);
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  process.exit(5);
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "pci-17b-cake-recipe-"));
const copied = copyExport(workDir);
if (!copied.ok) {
  report.blockedReason = "copy_failed";
  report.push = { error: `missing ${copied.missing}` };
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  process.exit(3);
}

run("git", ["init", "-b", "main"], { cwd: workDir });
run("git", ["config", "user.email", "devops@aztodev.com"], { cwd: workDir });
run("git", ["config", "user.name", "AZToDev DevOps"], { cwd: workDir });
run("git", ["add", "-A"], { cwd: workDir });
const commit = run("git", ["commit", "-m", COMMIT_MSG], { cwd: workDir });
if (!commit.ok) {
  report.blockedReason = "commit_failed";
  report.push = { step: "commit", stderr: commit.stderr, stdout: commit.stdout };
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  process.exit(4);
}

report.commitSha = run("git", ["rev-parse", "HEAD"], { cwd: workDir }).stdout || null;

run("git", ["remote", "remove", "origin"], { cwd: workDir });
const remoteAdd = run(
  "git",
  ["remote", "add", "origin", `https://github.com/${REPO}.git`],
  { cwd: workDir }
);
if (!remoteAdd.ok) {
  report.blockedReason = "remote_add_failed";
  report.push = { step: "remote", stderr: remoteAdd.stderr };
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  process.exit(3);
}

const push = run("git", ["push", "-u", "origin", "main", "--force"], {
  cwd: workDir,
  timeout: 600000,
});
report.push = {
  ok: push.ok,
  status: push.status,
  stderr: push.stderr,
  stdout: push.stdout,
};

if (!push.ok) {
  report.blockedReason = "push_failed";
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  process.exit(4);
}

const repoView = await githubApi("GET", `/repos/${owner}/${name}`);
report.repoPrivate = repoView.json?.private ?? null;

const pagesEnable = await enablePagesWorkflowSource(owner, name);
report.pagesEnable = {
  ok: pagesEnable.ok,
  status: pagesEnable.status,
  message: pagesEnable.json?.message ?? null,
};

let workflowRun = null;
for (let i = 0; i < 12; i++) {
  sleep(15000);
  const wr = await getLatestWorkflowRun(owner, name);
  if (wr.ok && wr.run) {
    workflowRun = wr.run;
    if (wr.run.status === "completed") break;
  }
}
report.workflowRun = workflowRun
  ? {
      id: workflowRun.id,
      status: workflowRun.status,
      conclusion: workflowRun.conclusion,
      html_url: workflowRun.html_url,
    }
  : { error: "no_run_found_within_3min" };

report.curl = await curlHead(PAGES_URL);
report.ok =
  push.ok &&
  report.repoPrivate === true &&
  (report.curl.ok && report.curl.status === 200);

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 6);
