/**
 * PCI-17b — Unified cake-recipe-demo repo creation + 7-file push.
 * Runs directly with Node (no Cursor shell required, bypassing 0xC0000142).
 * Designed for execution on founder PC with personal GitHub credentials,
 * with structured diagnostic fallback for Cloud environments.
 */
import fs from "fs";
import path from "path";
import os from "os";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const REPO = "ZionAmar/cake-recipe-demo";
const EXPORT_DIR = path.join(ROOT, "ops", "exports", "cake-recipe-demo");
const TRIGGER_PATH = path.join(ROOT, "ops", "runtime", "pci-17b-trigger.json");
const OUTBOX_PATH = path.join(
  ROOT,
  "agents",
  "34-pc-ops",
  "outbox",
  "2026-09-10_pci-17b-cake-recipe-unified-result.md"
);

const SOURCE_FILES = [
  {
    src: "agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html",
    dst: "index.html",
  },
  {
    src: "agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/styles.css",
    dst: "styles.css",
  },
  {
    src: "agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/README.md",
    dst: "README.md",
  },
  {
    src: "ops/staging/cake-recipe-demo/Dockerfile",
    dst: "Dockerfile",
  },
  {
    src: "ops/staging/cake-recipe-demo/.dockerignore",
    dst: ".dockerignore",
  },
  {
    src: "ops/staging/cake-recipe-demo/.github/workflows/pages.yml",
    dst: ".github/workflows/pages.yml",
  },
  {
    src: "ops/staging/cake-recipe-demo/PAGES_SETUP.md",
    dst: "PAGES_SETUP.md",
  },
];

function runCmd(cmd, args, cwd = ROOT, timeout = 120000, extraEnv = {}) {
  const r = spawnSync(cmd, args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
    timeout,
    env: { ...process.env, ...extraEnv },
  });
  return {
    ok: r.status === 0,
    status: r.status,
    stdout: String(r.stdout || "").trim(),
    stderr: String(r.stderr || "").trim(),
  };
}

export function readGitCredentialHelper() {
  const r = spawnSync("git", ["credential", "fill"], {
    input: "protocol=https\nhost=github.com\n\n",
    encoding: "utf8",
    windowsHide: true,
    timeout: 15000,
  });
  if (r.status !== 0) return { ok: false, error: "credential_fill_failed", status: r.status };
  const out = String(r.stdout || "");
  const username = (out.match(/^username=(.*)$/m) || [])[1]?.trim() || "";
  const password = (out.match(/^password=(.*)$/m) || [])[1]?.trim() || "";
  if (!username || !password) return { ok: false, error: "credential_empty" };
  return { ok: true, username, password };
}

export async function createRepoViaGithubApi(fullName, token) {
  const [owner, name] = String(fullName).split("/");
  const getRes = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "AZToDev-HQ-PCI17b",
    },
  });
  if (getRes.ok) {
    const json = await getRes.json().catch(() => ({}));
    return { ok: true, existed: true, url: json.html_url || `https://github.com/${fullName}` };
  }

  const postRes = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "AZToDev-HQ-PCI17b",
    },
    body: JSON.stringify({
      name,
      private: true,
      auto_init: false,
      has_issues: true,
      has_projects: false,
      has_wiki: false,
    }),
  });

  if (postRes.ok || postRes.status === 422) {
    return {
      ok: true,
      existed: postRes.status === 422,
      url: `https://github.com/${fullName}`,
    };
  }

  const errJson = await postRes.json().catch(() => ({}));
  return {
    ok: false,
    status: postRes.status,
    error: errJson.message || `http_${postRes.status}`,
  };
}

export async function ensureRepoCreated() {
  // 1. Try gh CLI
  const ghView = runCmd("gh", ["repo", "view", REPO, "--json", "url,isPrivate"]);
  if (ghView.ok) {
    try {
      const data = JSON.parse(ghView.stdout);
      return { ok: true, method: "gh_view", url: data.url, existed: true, isPrivate: data.isPrivate };
    } catch {
      return { ok: true, method: "gh_view", url: `https://github.com/${REPO}`, existed: true };
    }
  }

  // If gh view failed, try gh repo create
  const ghCreate = runCmd("gh", ["repo", "create", REPO, "--private", "--confirm"]);
  if (ghCreate.ok || /already exists/i.test(ghCreate.stderr + ghCreate.stdout)) {
    return {
      ok: true,
      method: "gh_create",
      url: `https://github.com/${REPO}`,
      existed: /already exists/i.test(ghCreate.stderr + ghCreate.stdout),
    };
  }

  // 2. Fall back to git credential helper + GitHub API
  const creds = readGitCredentialHelper();
  if (creds.ok && creds.password) {
    const apiRes = await createRepoViaGithubApi(REPO, creds.password);
    if (apiRes.ok) {
      return { ok: true, method: "git_credential_api", ...apiRes };
    }
    return {
      ok: false,
      method: "git_credential_api",
      error: apiRes.error,
      status: apiRes.status,
    };
  }

  return {
    ok: false,
    method: "none",
    error: "no_valid_founder_credentials",
    ghError: ghCreate.stderr || ghCreate.stdout,
    credentialError: creds.error,
  };
}

export function stageFiles(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  const staged = [];
  for (const item of SOURCE_FILES) {
    const srcAbs = path.join(ROOT, item.src);
    const dstAbs = path.join(targetDir, item.dst);
    if (!fs.existsSync(srcAbs)) {
      throw new Error(`Missing source file: ${item.src}`);
    }
    fs.mkdirSync(path.dirname(dstAbs), { recursive: true });
    fs.copyFileSync(srcAbs, dstAbs);
    staged.push(item.dst);
  }
  return staged;
}

export async function executePush() {
  const startTime = new Date().toISOString();
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  const staged = stageFiles(EXPORT_DIR);

  // Check repo creation
  const repoRes = await ensureRepoCreated();
  if (!repoRes.ok) {
    const isCloud = process.env.CURSOR_AGENT_ENV === "cloud" || !process.env.HOMEPATH;
    const result = {
      ok: false,
      marker: "PCI17B_CAKE_RECIPE_PUSH",
      targetRepo: REPO,
      stageFilesCount: staged.length,
      stagedFiles: staged,
      stagingDir: path.relative(ROOT, EXPORT_DIR),
      environment: isCloud ? "cursor_cloud" : "founder_pc",
      error: repoRes.error || "repo_creation_failed",
      methodAttempted: repoRes.method,
      details: repoRes,
      at: startTime,
      message: isCloud
        ? "Cloud environment lacks personal GitHub account credentials for ZionAmar. Files staged and ready for Nadav on PC boot."
        : "Failed to create or access GitHub repository on local PC.",
    };

    // Update trigger file
    fs.mkdirSync(path.dirname(TRIGGER_PATH), { recursive: true });
    fs.writeFileSync(TRIGGER_PATH, JSON.stringify(result, null, 2) + "\n");
    return result;
  }

  // Work in EXPORT_DIR as git repo
  if (!fs.existsSync(path.join(EXPORT_DIR, ".git"))) {
    const init = runCmd("git", ["init"], EXPORT_DIR);
    if (!init.ok) throw new Error(`git init failed: ${init.stderr}`);
  }

  // Ensure default branch is main
  runCmd("git", ["branch", "-M", "main"], EXPORT_DIR);

  // Check for leaked secrets
  const files = runCmd("git", ["status", "--porcelain"], EXPORT_DIR).stdout;
  if (/(\.env|secret)/i.test(files)) {
    throw new Error("Secret detected in staging area!");
  }

  // Stage & commit
  runCmd("git", ["add", "."], EXPORT_DIR);
  const commit = runCmd(
    "git",
    ["commit", "-m", "feat: RTL cake recipe demo + Docker + GitHub Pages workflow"],
    EXPORT_DIR
  );

  // Remote setup
  runCmd("git", ["remote", "remove", "origin"], EXPORT_DIR);
  const remoteAdd = runCmd(
    "git",
    ["remote", "add", "origin", `https://github.com/${REPO}.git`],
    EXPORT_DIR
  );
  if (!remoteAdd.ok) {
    throw new Error(`git remote add failed: ${remoteAdd.stderr}`);
  }

  // Push to main
  const push = runCmd("git", ["push", "-u", "origin", "main"], EXPORT_DIR, 180000);
  if (!push.ok) {
    // If push failed due to auth, check if credentials can be supplied
    const creds = readGitCredentialHelper();
    if (creds.ok && creds.password) {
      const authUrl = `https://${encodeURIComponent(creds.username)}:${encodeURIComponent(creds.password)}@github.com/${REPO}.git`;
      const pushWithAuth = runCmd("git", ["push", "-u", authUrl, "main"], EXPORT_DIR, 180000);
      if (!pushWithAuth.ok) {
        return {
          ok: false,
          marker: "PCI17B_CAKE_RECIPE_PUSH",
          targetRepo: REPO,
          error: "push_failed_with_credentials",
          stderr: pushWithAuth.stderr,
          stdout: pushWithAuth.stdout,
        };
      }
    } else {
      return {
        ok: false,
        marker: "PCI17B_CAKE_RECIPE_PUSH",
        targetRepo: REPO,
        error: "push_failed",
        stderr: push.stderr,
        stdout: push.stdout,
      };
    }
  }

  const shaRes = runCmd("git", ["rev-parse", "HEAD"], EXPORT_DIR);
  const sha = shaRes.ok ? shaRes.stdout : "unknown";

  const successResult = {
    ok: true,
    marker: "PCI17B_CAKE_RECIPE_PUSH",
    targetRepo: REPO,
    repoUrl: repoRes.url || `https://github.com/${REPO}`,
    visibility: "private",
    commitSha: sha,
    branch: "main",
    filesPushed: staged.length,
    stagedFiles: staged,
    at: new Date().toISOString(),
  };

  // Write outbox evidence
  const outboxContent = `# PCI-17b Cake Recipe Demo — Push Result

**Status:** done  
**At:** ${successResult.at}  
**Repo:** \`${REPO}\` (private)  
**URL:** ${successResult.repoUrl}  
**Commit SHA:** \`${sha}\`  
**Branch:** \`main\`  
**Files Pushed (${staged.length}):**
${staged.map((f) => `- \`${f}\``).join("\n")}

## Setup Verification Steps
1. Navigate to: https://github.com/${REPO}/settings/pages
2. Source: **GitHub Actions**
3. Workflow run: Deploy to GitHub Pages (Actions tab)
4. Target URL: https://zionamar.github.io/cake-recipe-demo/
`;
  fs.mkdirSync(path.dirname(OUTBOX_PATH), { recursive: true });
  fs.writeFileSync(OUTBOX_PATH, outboxContent, "utf8");

  // Write trigger status
  fs.mkdirSync(path.dirname(TRIGGER_PATH), { recursive: true });
  fs.writeFileSync(TRIGGER_PATH, JSON.stringify(successResult, null, 2) + "\n", "utf8");

  return successResult;
}

// Execute if run as script
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  try {
    const res = await executePush();
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.ok ? 0 : 1);
  } catch (err) {
    const errObj = {
      ok: false,
      marker: "PCI17B_CAKE_RECIPE_PUSH",
      error: String(err?.message || err),
    };
    console.error(JSON.stringify(errObj, null, 2));
    process.exit(2);
  }
}
