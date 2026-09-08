#!/usr/bin/env node
/**
 * PC / local HQ only — reads .env + ops/secrets, reports readiness for Cursor Cloud.
 * Never prints secret values. Writes ops/runtime/secrets-migration-status.json.
 */
import fs from "fs";
import path from "path";
import { ROOT, OPS, nowIso, writeJson } from "../../runtime/lib/paths.mjs";
import { loadDotEnv } from "../../runtime/lib/load-env.mjs";
import { readFactory } from "../../runtime/lib/company-state.mjs";

const CLOUD_KEYS = [
  "GMAIL_USER",
  "GMAIL_APP_PASS",
  "GMAIL_USER_AMZION",
  "GMAIL_APP_PASS_AMZION",
  "GMAIL_USER_ZION",
  "GMAIL_APP_PASS_ZION",
  "CHEMICLOUD_HOST",
  "CHEMICLOUD_USER",
  "CHEMICLOUD_PORT",
  "CHEMICLOUD_SSH_KEY",
];

const OPTIONAL_KEYS = ["OPENAI_API_KEY", "GEMINI_API_KEY", "CURSOR_API_KEY"];

function sshKeyPresent() {
  for (const name of ["aztodev-cpanel.nopass", "aztodev-cpanel"]) {
    if (fs.existsSync(path.join(ROOT, "ops", "secrets", name))) return true;
  }
  return Boolean((process.env.CHEMICLOUD_SSH_KEY || "").trim());
}

function keyStatus(name) {
  if (name === "CHEMICLOUD_SSH_KEY") {
    return sshKeyPresent() ? "present" : "missing";
  }
  const v = (process.env[name] || "").trim();
  return v ? "present" : "missing";
}

loadDotEnv();
const factory = readFactory();

if (!process.env.CHEMICLOUD_HOST?.trim()) {
  process.env.CHEMICLOUD_HOST = factory.chemiCloudHost || "";
}
if (!process.env.CHEMICLOUD_USER?.trim()) {
  process.env.CHEMICLOUD_USER = factory.chemiCloudUser || "";
}
if (!process.env.CHEMICLOUD_PORT?.trim()) {
  process.env.CHEMICLOUD_PORT = String(factory.chemiCloudPort || 1988);
}

const keys = {};
for (const k of CLOUD_KEYS) keys[k] = keyStatus(k);
const optional = {};
for (const k of OPTIONAL_KEYS) optional[k] = keyStatus(k);

const requiredMissing = CLOUD_KEYS.filter((k) => keys[k] === "missing");
const report = {
  at: nowIso(),
  envFile: fs.existsSync(path.join(ROOT, ".env")),
  opsSecretsDir: fs.existsSync(path.join(ROOT, "ops", "secrets")),
  keys,
  optional,
  readyForCloud: requiredMissing.length === 0,
  missing: requiredMissing,
  dashboard:
    "https://cursor.com/dashboard/cloud-agents/environments/e/ff54fccf-ab90-11f1-b532-320a589b8025",
  note:
    "Cursor Cloud secrets are set in the dashboard Secrets tab — no API for persistent env secrets. Copy values from local .env and ops/secrets manually or via dashboard UI.",
};

const out = path.join(OPS, "runtime", "secrets-migration-status.json");
writeJson(out, report);

console.log(JSON.stringify({ ok: report.readyForCloud, out, missing: requiredMissing }, null, 2));
process.exit(requiredMissing.length ? 1 : 0);
