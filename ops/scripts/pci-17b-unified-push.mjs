/**
 * PCI-17b — Create private ZionAmar/cake-recipe-demo, push unified bundle, enable Pages.
 * Auth: github-git-auth.mjs (git credential helper) → gh auth token fallback.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  readGithubHttpsCreds,
  githubApi,
  ensurePrivateRepo,
} from "./github-git-auth.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPORT = path.join(__dirname, "../exports/cake-recipe-demo");
const REPO = "ZionAmar/cake-recipe-demo";
const COMMIT_MSG = "feat: RTL cake recipe demo + Docker + GitHub Pages workflow";
const PAGES_URL = "https://zionamar.github.io/cake-recipe-demo/";

const REQUIRED = [
  "index.html",
  "styles.css",
  "README.md",
  "Dockerfile",
  ".dockerignore",
  ".github/workflows/pages.yml",
  "PAGES_SETUP.md",
];

function run(cmd, args, cwd = EXPORT, timeout = 120000) {
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

function ghToken() {
  const r = run("gh", ["auth", "token"], __dirname, 15000);
  return r.ok ? r.stdout : "";
}

async function githubApiWithFallback(method, urlPath, body) {
  let res = await githubApi(method, urlPath, body);
  if (res.status === 0 || res.status === 401) {
    const token = ghToken();
    if (!token) return res;
    const r = await fetch(`https://api.github.com${urlPath}`, {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "AZToDev-HQ-pci-17b",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    let json = null;
    try {
      json = await r.json();
    } catch {
      json = null;
    }
    res = { ok: r.ok, status: r.status, json };
  }
  return res;
}

const report = {
  at: new Date().toISOString(),
  bundle: { ok: false, files: [] },
  auth: {},
  repoCreate: {},
  push: {},
  commitSha: null,
  repoPrivate: null,
  pagesEnable: {},
  workflow: {},
  curl: {},
  errors: [],
};

// 1) Verify bundle
for (const f of REQUIRED) {
  const p = path.join(EXPORT, f);
  const exists = fs.existsSync(p);
  report.bundle.files.push({ path: f, exists });
  if (!exists) report.errors.push(`missing:${f}`);
}
report.bundle.ok = report.bundle.files.every((x) => x.exists);
if (!report.bundle.ok) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
}

// 2) Auth probe
const creds = readGithubHttpsCreds();
report.auth.credentialHelper = creds.ok
  ? { ok: true, username: creds.username }
  : { ok: false, error: creds.error };
const userProbe = await githubApiWithFallback("GET", "/user");
report.auth.user = {
  ok: userProbe.ok,
  status: userProbe.status,
  login: userProbe.json?.login ?? null,
};
const repoProbe = await githubApiWithFallback("GET", `/repos/${REPO}`);
report.auth.repoExists = repoProbe.ok;

// 3) Create repo if needed
const created = await ensurePrivateRepo(REPO);
if (!created.ok) {
  const token = ghToken();
  if (token) {
    const [owner, name] = REPO.split("/");
    const post = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        name,
        private: true,
        auto_init: false,
      }),
    });
    const postJson = await post.json().catch(() => null);
    report.repoCreate = {
      ok: post.ok || post.status === 422,
      status: post.status,
      message: postJson?.message ?? null,
      via: "gh_token",
    };
  } else {
    report.repoCreate = {
      ok: false,
      error: created.error || "create_failed",
      status: created.status,
      via: "credential_helper",
    };
  }
} else {
  report.repoCreate = {
    ok: true,
    existed: created.existed,
    url: created.url,
    via: "ensurePrivateRepo",
  };
}

const repoAfter = await githubApiWithFallback("GET", `/repos/${REPO}`);
report.repoPrivate = repoAfter.ok ? repoAfter.json?.private ?? null : null;

if (!repoAfter.ok) {
  report.errors.push(`repo_not_found:${repoAfter.status}`);
  console.log(JSON.stringify(report, null, 2));
  process.exit(5);
}

// 4) Git init + push
const tmpDir = fs.mkdtempSync(path.join("/tmp", "cake-recipe-demo-"));
for (const f of REQUIRED) {
  const src = path.join(EXPORT, f);
  const dest = path.join(tmpDir, f);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

const pushToken =
  (creds.ok ? creds.password : null) || ghToken() || "";
const remoteUrl = pushToken
  ? `https://x-access-token:${pushToken}@github.com/${REPO}.git`
  : `https://github.com/${REPO}.git`;

run("git", ["init", "-b", "main"], tmpDir);
run("git", ["config", "user.email", "devops@aztodev.com"], tmpDir);
run("git", ["config", "user.name", "AZToDev DevOps"], tmpDir);
run("git", ["add", "-A"], tmpDir);
const commit = run("git", ["commit", "-m", COMMIT_MSG], tmpDir);
report.push.commit = {
  ok: commit.ok,
  stderr: commit.stderr.slice(0, 500),
};
report.commitSha = run("git", ["rev-parse", "HEAD"], tmpDir).stdout || null;

run("git", ["remote", "add", "origin", remoteUrl], tmpDir);
const push = run("git", ["push", "-u", "origin", "main"], tmpDir, 300000);
report.push.push = {
  ok: push.ok,
  status: push.status,
  stderr: push.stderr.slice(0, 800),
  stdout: push.stdout.slice(0, 200),
};
if (!push.ok) report.errors.push("push_failed");

// Re-read commit from remote if push succeeded
if (push.ok) {
  const head = await githubApiWithFallback("GET", `/repos/${REPO}/commits/main`);
  report.commitSha = head.json?.sha ?? report.commitSha;
}

// 5) Enable Pages (workflow source)
const pagesPost = await githubApiWithFallback("POST", `/repos/${REPO}/pages`, {
  build_type: "workflow",
});
report.pagesEnable = {
  ok: pagesPost.ok,
  status: pagesPost.status,
  message: pagesPost.json?.message ?? null,
};

// 6) Workflow run status
await new Promise((r) => setTimeout(r, 5000));
const runs = await githubApiWithFallback(
  "GET",
  `/repos/${REPO}/actions/runs?per_page=3`
);
const latest = runs.json?.workflow_runs?.[0];
report.workflow = latest
  ? {
      id: latest.id,
      name: latest.name,
      status: latest.status,
      conclusion: latest.conclusion,
      html_url: latest.html_url,
    }
  : { ok: false, message: runs.json?.message ?? "no_runs" };

// 7) curl Pages URL
const curl = run("curl", ["-sI", "-o", "/dev/null", "-w", "%{http_code}", PAGES_URL], tmpDir);
report.curl = {
  url: PAGES_URL,
  statusCode: curl.stdout || "000",
  ok: curl.stdout === "200",
};

fs.rmSync(tmpDir, { recursive: true, force: true });

console.log(JSON.stringify(report, null, 2));
process.exit(report.push.push?.ok ? 0 : 4);
