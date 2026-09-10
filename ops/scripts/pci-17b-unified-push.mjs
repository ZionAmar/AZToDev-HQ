/**
 * PCI-17b: Unified push for ZionAmar/cake-recipe-demo
 * - Checks founder GitHub credentials (must NOT use Cloud App token)
 * - Verifies 7 export files in ops/exports/cake-recipe-demo/
 * - Creates/ensures private repo ZionAmar/cake-recipe-demo
 * - Commits and pushes to main
 * - Enables GitHub Pages (source: workflow)
 * - Checks workflow status and live curl HTTP status
 * - Returns structured JSON results
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { readGithubHttpsCreds, githubApi, ensurePrivateRepo } from "./github-git-auth.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HQ_ROOT = path.resolve(__dirname, "../..");
const EXPORTS_DIR = path.join(HQ_ROOT, "ops/exports/cake-recipe-demo");
const REPO_OWNER = "ZionAmar";
const REPO_NAME = "cake-recipe-demo";
const FULL_REPO = `${REPO_OWNER}/${REPO_NAME}`;
const LIVE_URL = `https://${REPO_OWNER.toLowerCase()}.github.io/${REPO_NAME}/`;

function runCmd(cmd, args, cwd = HQ_ROOT, timeout = 60000) {
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

async function checkCurlStatus(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "manual" });
    return res.status;
  } catch (err) {
    // Fallback to curl cli if fetch fails
    const c = runCmd("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", url]);
    const num = parseInt(c.stdout, 10);
    return isNaN(num) ? 0 : num;
  }
}

function verifyExportFiles() {
  const required = [
    "index.html",
    "styles.css",
    "README.md",
    "Dockerfile",
    ".dockerignore",
    ".github/workflows/pages.yml",
    "PAGES_SETUP.md",
  ];
  const missing = [];
  const present = [];

  for (const rel of required) {
    const p = path.join(EXPORTS_DIR, rel);
    if (fs.existsSync(p)) {
      present.push(rel);
    } else {
      missing.push(rel);
    }
  }

  return { ok: missing.length === 0, present, missing, count: present.length };
}

async function detectAuth() {
  // 1. Try git credential fill (used on founder PC)
  const gitCreds = readGithubHttpsCreds();
  if (gitCreds.ok && gitCreds.username && gitCreds.password) {
    // If username is ZionAmar or personal token, this is founder creds
    if (gitCreds.username.toLowerCase() === REPO_OWNER.toLowerCase() || !gitCreds.username.startsWith("cursor")) {
      return { ok: true, source: "git_credential_helper", username: gitCreds.username, token: gitCreds.password };
    }
  }

  // 2. Try FOUNDER_GITHUB_TOKEN or GH_TOKEN / GITHUB_TOKEN
  const envToken = process.env.FOUNDER_GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (envToken && !envToken.startsWith("ghs_")) {
    return { ok: true, source: "env_token", username: REPO_OWNER, token: envToken };
  }

  // 3. Check `gh auth status` / `gh api user`
  const ghUser = runCmd("gh", ["api", "user", "-q", ".login"]);
  if (ghUser.ok && ghUser.stdout.toLowerCase() === REPO_OWNER.toLowerCase()) {
    const tokenRes = runCmd("gh", ["auth", "token"]);
    if (tokenRes.ok && tokenRes.stdout) {
      return { ok: true, source: "gh_cli", username: ghUser.stdout, token: tokenRes.stdout };
    }
  }

  // If active user is `cursor` or token starts with `ghs_`, it is the Cloud App, NOT founder credentials
  const currentGhUser = ghUser.ok ? ghUser.stdout : "none";
  return {
    ok: false,
    error: `Founder credentials required. Active user is '${currentGhUser}' (Cursor Cloud App token). Founder credentials exist on founder Windows PC (34-pc-ops / Nadav) or via founder PAT.`,
    activeUser: currentGhUser,
  };
}

export async function main() {
  const result = {
    push: "fail",
    commit_sha: null,
    repo_private_status: null,
    pages_enable: null,
    workflow_status: null,
    curl_status_code: null,
    errors: [],
    details: {},
  };

  // Step 1: Verify 7 export files
  const fileCheck = verifyExportFiles();
  result.details.files = fileCheck;
  if (!fileCheck.ok) {
    result.errors.push(`Missing export files in ${EXPORTS_DIR}: ${fileCheck.missing.join(", ")}`);
  }

  // Step 2: Check current curl status of live URL
  result.curl_status_code = await checkCurlStatus(LIVE_URL);
  result.details.live_url = LIVE_URL;

  // Step 3: Check credentials
  const auth = await detectAuth();
  result.details.auth = {
    ok: auth.ok,
    source: auth.source || null,
    activeUser: auth.activeUser || auth.username || null,
  };

  if (!auth.ok) {
    result.errors.push(`CREDENTIALS_REJECTED: ${auth.error}`);
    // Probe public repo status if possible
    try {
      const probe = await fetch(`https://api.github.com/repos/${FULL_REPO}`, {
        headers: { "User-Agent": "AZToDev-HQ" },
      });
      if (probe.status === 200) {
        const repoData = await probe.json();
        result.repo_private_status = repoData.private;
      } else if (probe.status === 404) {
        result.repo_private_status = null;
        result.details.repo_note = "Repo does not exist or is private and not accessible without founder token.";
      }
    } catch (e) {
      // Ignore network errors on probe
    }

    console.log(JSON.stringify(result, null, 2));
    return result;
  }

  // Step 4: Founder credentials present -> Ensure private repo exists
  const repoRes = await ensurePrivateRepo(FULL_REPO);
  if (!repoRes.ok) {
    result.errors.push(`REPO_CREATE_FAILED: ${repoRes.error || repoRes.status}`);
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
  result.repo_private_status = true; // ensurePrivateRepo creates as private

  // Step 5: Stage and push to ZionAmar/cake-recipe-demo
  const tempDir = path.join(HQ_ROOT, ".tmp-cake-recipe-push");
  try {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });

    // Copy 7 files to tempDir preserving structure
    runCmd("cp", ["-r", `${EXPORTS_DIR}/.`, tempDir]);

    // Init git repo and commit
    runCmd("git", ["init", "-b", "main"], tempDir);
    runCmd("git", ["config", "user.name", "Zion Amar"], tempDir);
    runCmd("git", ["config", "user.email", "amazi1460@gmail.com"], tempDir);
    runCmd("git", ["add", "-A"], tempDir);
    
    const commit = runCmd("git", ["commit", "-m", "feat: RTL cake recipe demo + Docker + GitHub Pages workflow"], tempDir);
    if (!commit.ok) {
      result.errors.push(`COMMIT_FAILED: ${commit.stderr || commit.stdout}`);
      console.log(JSON.stringify(result, null, 2));
      return result;
    }

    const sha = runCmd("git", ["rev-parse", "HEAD"], tempDir);
    result.commit_sha = sha.ok ? sha.stdout : null;

    // Push using authenticated remote URL
    const remoteUrl = `https://${auth.username}:${auth.token}@github.com/${FULL_REPO}.git`;
    const push = runCmd("git", ["push", "-u", remoteUrl, "main", "--force"], tempDir);
    if (!push.ok) {
      result.errors.push(`PUSH_FAILED: ${push.stderr || push.stdout}`);
      console.log(JSON.stringify(result, null, 2));
      return result;
    }
    result.push = "ok";

    // Step 6: Enable Pages via GitHub API
    const pagesRes = await githubApi("POST", `/repos/${FULL_REPO}/pages`, {
      build_type: "workflow",
      source: { branch: "main", path: "/" },
    });
    result.pages_enable = pagesRes.ok ? "enabled" : `api_status_${pagesRes.status}`;

    // Step 7: Check workflow status
    const runsRes = await githubApi("GET", `/repos/${FULL_REPO}/actions/runs`);
    if (runsRes.ok && runsRes.json?.workflow_runs?.length > 0) {
      result.workflow_status = runsRes.json.workflow_runs[0].status;
    } else {
      result.workflow_status = "pending_first_run";
    }

    // Step 8: Final curl check
    result.curl_status_code = await checkCurlStatus(LIVE_URL);

  } catch (err) {
    result.errors.push(`UNEXPECTED_ERROR: ${err.message}`);
  } finally {
    if (fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        // ignore cleanup error
      }
    }
  }

  console.log(JSON.stringify(result, null, 2));
  return result;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().then((r) => {
    if (r.push !== "ok") {
      process.exitCode = 1;
    }
  });
}
