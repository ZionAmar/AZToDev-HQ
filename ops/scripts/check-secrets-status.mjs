/**
 * Report which secret env keys are SET or MISSING — never prints values.
 * Usage: node ops/scripts/check-secrets-status.mjs [--scope cloud|local|all]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function loadEnv() {
  const p = path.join(ROOT, ".env");
  if (!fs.existsSync(p)) return { path: p, loaded: false };
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
  return { path: p, loaded: true };
}

const GMAIL_KEYS = [
  "GMAIL_USER",
  "GMAIL_APP_PASS",
  "GMAIL_USER_AMZION",
  "GMAIL_APP_PASS_AMZION",
  "GMAIL_USER_ZION",
  "GMAIL_APP_PASS_ZION",
];

const CHEMICLOUD_KEYS = [
  "CHEMICLOUD_HOST",
  "CHEMICLOUD_USER",
  "CHEMICLOUD_PORT",
  "CHEMICLOUD_SSH_KEY",
];

const OPTIONAL_KEYS = ["OPENAI_API_KEY", "GEMINI_API_KEY"];

function status(key) {
  const v = (process.env[key] || "").trim();
  return v ? "SET" : "MISSING";
}

function sshKeyFileStatus() {
  const fromEnv = (process.env.CHEMICLOUD_SSH_KEY_PATH || "").trim();
  const candidates = [
    fromEnv,
    path.join(ROOT, "ops", "secrets", "chemicloud.pem"),
    path.join(ROOT, "ops", "secrets", "chemicloud_ssh_key.pem"),
  ].filter(Boolean);
  for (const p of candidates) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        return { status: "SET", path: p.replace(ROOT + path.sep, "") };
      }
    } catch {
      /* ignore */
    }
  }
  return { status: "MISSING", path: null };
}

const scopeArg = process.argv.find((a) => a.startsWith("--scope="));
const scope = scopeArg ? scopeArg.split("=")[1] : "all";

const envInfo = loadEnv();
const sshFile = sshKeyFileStatus();
const chemicloudKey =
  status("CHEMICLOUD_SSH_KEY") === "SET" || sshFile.status === "SET"
    ? "SET"
    : "MISSING";

const report = {
  at: new Date().toISOString(),
  scope,
  envFile: envInfo.loaded ? ".env" : "MISSING",
  gmail: Object.fromEntries(GMAIL_KEYS.map((k) => [k, status(k)])),
  chemicloud: {
    CHEMICLOUD_HOST: status("CHEMICLOUD_HOST"),
    CHEMICLOUD_USER: status("CHEMICLOUD_USER"),
    CHEMICLOUD_PORT: status("CHEMICLOUD_PORT"),
    CHEMICLOUD_SSH_KEY: chemicloudKey,
    sshKeyFile: sshFile,
  },
  optional: Object.fromEntries(OPTIONAL_KEYS.map((k) => [k, status(k)])),
};

const missing = [
  ...GMAIL_KEYS.filter((k) => report.gmail[k] === "MISSING"),
  ...CHEMICLOUD_KEYS.filter((k) => {
    if (k === "CHEMICLOUD_SSH_KEY") return chemicloudKey === "MISSING";
    return report.chemicloud[k] === "MISSING";
  }),
];

report.ok = missing.length === 0;
report.missingCount = missing.length;
report.missing = missing;

const outDir = path.join(ROOT, "ops", "reports");
fs.mkdirSync(outDir, { recursive: true });
const label = scope === "cloud" ? "cloud" : scope === "local" ? "local" : "secrets";
const outPath = path.join(outDir, `${label}-secrets-check-${report.at.slice(0, 10)}.json`);
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log(JSON.stringify({ ...report, reportPath: outPath.replace(ROOT + path.sep, "") }, null, 2));
process.exit(report.ok ? 0 : 1);
