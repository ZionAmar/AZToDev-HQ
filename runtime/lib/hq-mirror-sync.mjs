/**
 * Safe ff-only pull of HQ on the thin desk so Cloud-written inbox files arrive.
 * Never force, never stash secrets, never touch ChemiCloud sites.
 */
import { spawnSync } from "child_process";
import { ROOT, journal } from "./paths.mjs";

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

export function syncHqMirror() {
  if (!shouldSyncHqMirror()) return { ok: true, skipped: true, reason: "not_desk" };
  const dirty = git(["status", "--porcelain"]);
  if (dirty.status !== 0) {
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
