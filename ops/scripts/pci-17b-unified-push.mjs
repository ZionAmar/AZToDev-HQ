/**
 * PCI-17b — Unified push for cake-recipe-demo
 * Staged 7 files -> Create private repo ZionAmar/cake-recipe-demo -> Push -> Pages setup -> Verification
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { readGithubHttpsCreds } from "./github-git-auth.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EXPORTS_DIR = path.join(ROOT, "ops", "exports", "cake-recipe-demo");
const REPO = "ZionAmar/cake-recipe-demo";
const PAGES_URL = "https://zionamar.github.io/cake-recipe-demo/";

const REQUIRED_FILES = [
  "index.html",
  "styles.css",
  "README.md",
  "Dockerfile",
  ".dockerignore",
  path.join(".github", "workflows", "pages.yml"),
  "PAGES_SETUP.md",
];

function runCmd(cmd, args, cwd = ROOT, timeout = 60000) {
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

async function curlStatusCode(url) {
  const res = runCmd("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", "-I", url]);
  if (res.ok && /^\d+$/.test(res.stdout)) {
    return parseInt(res.stdout, 10);
  }
  return 0;
}

export async function runUnifiedPush() {
  const results = {
    push: "fail",
    commitSha: null,
    repoPrivateStatus: "unknown",
    pagesEnableResult: "not_attempted",
    workflowRunStatus: "not_attempted",
    curlStatusCode: 0,
    errors: [],
  };

  // 1. Verify 7 files in ops/exports/cake-recipe-demo/
  const missingFiles = [];
  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(EXPORTS_DIR, file);
    if (!fs.existsSync(fullPath)) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    const err = `Missing required files in ${EXPORTS_DIR}: ${missingFiles.join(", ")}`;
    results.errors.push(err);
    console.error(err);
    return results;
  }

  // 2. Prepare staging repo with the 7 files
  const stagingDir = path.join("/tmp", "cake-recipe-demo-staging");
  fs.rmSync(stagingDir, { recursive: true, force: true });
  fs.mkdirSync(stagingDir, { recursive: true });

  // Copy files
  for (const file of REQUIRED_FILES) {
    const src = path.join(EXPORTS_DIR, file);
    const dest = path.join(stagingDir, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  // Git init & initial commit
  runCmd("git", ["init", "-b", "main"], stagingDir);
  runCmd("git", ["config", "user.name", "Zion Amar"], stagingDir);
  runCmd("git", ["config", "user.email", "zionamar@gmail.com"], stagingDir);
  runCmd("git", ["add", "."], stagingDir);
  const commitRes = runCmd(
    "git",
    ["commit", "-m", "feat: RTL cake recipe demo + Docker + GitHub Pages workflow"],
    stagingDir
  );
  const shaRes = runCmd("git", ["rev-parse", "HEAD"], stagingDir);
  results.commitSha = shaRes.ok ? shaRes.stdout : "none";

  // 3. Inspect GitHub credentials & environment
  let creds = readGithubHttpsCreds();
  if (creds.ok && creds.password && !process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) {
    process.env.GH_TOKEN = creds.password;
  }
  const ghAuthRes = runCmd("gh", ["auth", "status"]);
  const isCloudApp = /account cursor/i.test(ghAuthRes.stdout + ghAuthRes.stderr);

  // 4. Check repo existence
  const repoView = runCmd("gh", ["repo", "view", REPO, "--json", "isPrivate,visibility"]);
  let repoExists = repoView.ok;

  if (repoExists) {
    try {
      const data = JSON.parse(repoView.stdout);
      results.repoPrivateStatus = data.isPrivate ? "private" : data.visibility || "public";
    } catch {
      results.repoPrivateStatus = "exists";
    }
  } else {
    results.repoPrivateStatus = "not_found_404";
    // Attempt creation
    const createRes = runCmd("gh", ["repo", "create", REPO, "--private"]);
    if (createRes.ok) {
      results.repoPrivateStatus = "created_private";
      repoExists = true;
    } else {
      const createErr = createRes.stderr || createRes.stdout;
      results.errors.push(`gh repo create failed: ${createErr}`);
      if (/Resource not accessible by integration/i.test(createErr)) {
        results.errors.push(
          "AUTH_SCOPE_LIMITATION: Cursor Cloud GitHub App token is scoped to AZToDev-HQ only (repository_selection=selected). It lacks permission to create user repositories under ZionAmar. Founder personal credentials (gh auth on PC / personal PAT) required."
        );
      }
    }
  }

  // 5. If repo exists, attempt push
  if (repoExists) {
    runCmd("git", ["remote", "remove", "origin"], stagingDir);
    const pushUrl = (creds.ok && creds.password)
      ? `https://${creds.username || "x-access-token"}:${creds.password}@github.com/${REPO}.git`
      : `https://github.com/${REPO}.git`;
    runCmd("git", ["remote", "add", "origin", pushUrl], stagingDir);
    const pushRes = runCmd("git", ["push", "-u", "origin", "main"], stagingDir, 120000);
    if (pushRes.ok) {
      results.push = "ok";

      // Attempt to enable pages
      const pagesRes = runCmd("gh", [
        "api",
        "--method",
        "POST",
        `/repos/${REPO}/pages`,
        "-f",
        "build_type=workflow",
      ]);
      results.pagesEnableResult = pagesRes.ok ? "enabled" : `failed: ${pagesRes.stderr || pagesRes.stdout}`;

      // Check workflow run status
      const runsRes = runCmd("gh", [
        "run",
        "list",
        "--repo",
        REPO,
        "--limit",
        "1",
        "--json",
        "status,conclusion",
      ]);
      results.workflowRunStatus = runsRes.ok ? runsRes.stdout : "none";
    } else {
      results.push = "fail";
      results.errors.push(`git push failed: ${pushRes.stderr || pushRes.stdout}`);
    }
  } else {
    results.push = "fail";
    results.pagesEnableResult = "blocked_repo_missing";
    results.workflowRunStatus = "blocked_repo_missing";
  }

  // 6. Live curl check
  results.curlStatusCode = await curlStatusCode(PAGES_URL);

  return results;
}

// Run when called directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  console.log("=== PCI-17b: cake-recipe-demo Unified Push Execution ===");
  const res = await runUnifiedPush();
  console.log("\nFULL RESULTS:");
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.push === "ok" ? 0 : 1);
}
