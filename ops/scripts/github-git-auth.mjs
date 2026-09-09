/**
 * GitHub API via git's credential helper (same creds as AZToDev-HQ).
 * Never logs username/password/token.
 */
import { spawnSync } from "child_process";

export function readGithubHttpsCreds() {
  const r = spawnSync("git", ["credential", "fill"], {
    input: "protocol=https\nhost=github.com\n\n",
    encoding: "utf8",
    windowsHide: true,
    timeout: 20000,
  });
  if (r.status !== 0) return { ok: false, error: "credential_fill_failed" };
  const out = String(r.stdout || "");
  const username = (out.match(/^username=(.*)$/m) || [])[1]?.trim() || "";
  const password = (out.match(/^password=(.*)$/m) || [])[1]?.trim() || "";
  if (!username || !password) return { ok: false, error: "credential_empty" };
  return { ok: true, username, password };
}

export async function githubApi(method, urlPath, body) {
  const creds = readGithubHttpsCreds();
  if (!creds.ok) return { ok: false, error: creds.error, status: 0 };
  const res = await fetch(`https://api.github.com${urlPath}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${creds.password}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "AZToDev-HQ",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { ok: res.ok, status: res.status, json };
}

export async function ensurePrivateRepo(fullName) {
  const [owner, name] = String(fullName).split("/");
  const existing = await githubApi("GET", `/repos/${owner}/${name}`);
  if (existing.ok) {
    return {
      ok: true,
      existed: true,
      url: existing.json?.html_url || `https://github.com/${fullName}`,
    };
  }
  const created = await githubApi("POST", "/user/repos", {
    name,
    private: true,
    auto_init: false,
    has_issues: true,
    has_projects: false,
    has_wiki: false,
  });
  if (created.ok || created.status === 422) {
    const view = await githubApi("GET", `/repos/${owner}/${name}`);
    return {
      ok: true,
      existed: created.status === 422,
      url: view.json?.html_url || `https://github.com/${fullName}`,
    };
  }
  return {
    ok: false,
    error: `create_failed_${created.status}`,
    status: created.status,
  };
}
