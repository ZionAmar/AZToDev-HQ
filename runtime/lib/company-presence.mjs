/**
 * Soft presence: notify founder when the live flow fingerprint meaningfully changes.
 * Rate-limited. Never spams routine heartbeats.
 */
import crypto from "crypto";
import path from "path";
import { RUNTIME_DIR, readJson, writeJson, nowIso, journal } from "./paths.mjs";
import { liveStatusHebrew } from "./live-status.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { peekWaitingFounder } from "./waiting-founder.mjs";
import { listLiveRuns } from "./live-runs.mjs";
import { readFactory } from "./company-state.mjs";

const STAMP = path.join(RUNTIME_DIR, "company-presence.json");
const MIN_GAP_MS = 4 * 60 * 1000;

function fingerprint() {
  const w = readFactory().activeWork || {};
  const live = listLiveRuns()
    .map((r) => `${r.specialistId}:${r.cloudAgentId || ""}`)
    .join("|");
  const pin = peekWaitingFounder("pin") ? "pin" : "";
  const confirm = peekWaitingFounder("confirm") ? "confirm" : "";
  const raw = [
    w.slug || "",
    w.gate || "",
    w.waitingFor || "",
    w.status || "",
    live,
    pin,
    confirm,
  ].join("::");
  return crypto.createHash("sha1").update(raw).digest("hex");
}

function meaningful(prev, next) {
  if (!prev) return false; // first boot — don't ping
  return prev !== next;
}

/**
 * @returns {{ sent: boolean, reason?: string }}
 */
export async function tickCompanyPresence() {
  const fp = fingerprint();
  const st = readJson(STAMP, {}) || {};
  const lastAt = Date.parse(st.at || "") || 0;
  const prev = st.fp || "";

  if (!meaningful(prev, fp)) {
    writeJson(STAMP, { ...st, fp, at: nowIso(), quiet: true });
    return { sent: false, reason: "unchanged" };
  }
  if (Date.now() - lastAt < MIN_GAP_MS) {
    writeJson(STAMP, { ...st, fp, at: st.at || nowIso(), deferred: true });
    return { sent: false, reason: "rate_limit" };
  }

  const text = [
    "נועה · הזרימה זזה",
    liveStatusHebrew(),
  ].join("\n");

  await sendFounderTelegram(text, { silent: true }).catch(() => {});
  writeJson(STAMP, { fp, at: nowIso(), prev });
  journal("presence_pulse", {});
  return { sent: true };
}
