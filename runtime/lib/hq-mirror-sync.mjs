/**
 * Safe ff-only pull of HQ on the thin desk so Cloud-written inbox files arrive.
 * Never force, never stash secrets, never touch ChemiCloud sites.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { ROOT, journal, RUNTIME_DIR, readJson, writeJson, nowIso } from "./paths.mjs";

const WARN_STAMP = path.join(RUNTIME_DIR, "hq-mirror-warn.json");

function git(args) {
  return spawnSync("git", ["-C", ROOT, ...args], {
    encoding: "utf8",
    windowsHide: true,
    timeout: 25000,
  });
}

export function shouldSyncHqMirror() {
  if (process.env.HQ_SKIP_GIT_SYNC === "1") return false;
  return process.env.HQ_CLOUD_ONLY === "1" || process.env.HQ_GIT_SYNC === "1";
}

function isGitRepo() {
  return fs.existsSync(path.join(ROOT, ".git"));
}

function warnOnce(reason, detail = "") {
  const st = readJson(WARN_STAMP, {});
  const last = Date.parse(st.at || "") || 0;
  if (st.reason === reason && Date.now() - last < 6 * 60 * 60 * 1000) {
    return;
  }
  writeJson(WARN_STAMP, { reason, detail: String(detail).slice(0, 200), at: nowIso() });
  journal("hq_mirror_warn", { reason, detail: String(detail).slice(0, 200) });
}

export function syncHqMirror() {
  if (!shouldSyncHqMirror()) return { ok: true, skipped: true, reason: "not_desk" };
  if (!isGitRepo()) {
    warnOnce(
      "not_a_git_repo",
      "Desk needs git clone of AZToDev-HQ — see ops/scripts/bootstrap-desk-git.sh"
    );
    return { ok: false, error: "not_a_git_repo" };
  }
  const dirty = git(["status", "--porcelain"]);
  if (dirty.status !== 0) {
    warnOnce("status_fail", dirty.stderr || dirty.stdout || "");
    return { ok: false, error: (dirty.stderr || dirty.stdout || "").slice(0, 200) };
  }
  const porcelain = String(dirty.stdout || "").trim();
  if (porcelain) {
    journal("hq_mirror_skip_dirty", { n: porcelain.split("\n").length });
    return { ok: true, skipped: true, reason: "dirty" };
  }
  const pull = git(["pull", "--ff-only", "origin", "HEAD"]);
  if (pull.status !== 0) {
    const err = (pull.stderr || pull.stdout || "").slice(0, 240);
    journal("hq_mirror_pull_fail", { error: err });
    return { ok: false, error: err };
  }
  journal("hq_mirror_pulled", {});
  return { ok: true, pulled: true };
}
