import path from "path";
import fs from "fs";
import os from "os";
import { spawn } from "child_process";
import { ROOT } from "./paths.mjs";
import { readFactory } from "./company-state.mjs";

const SSH_EXE =
  process.env.SSH_EXE ||
  (process.platform === "win32"
    ? "C:\\Windows\\System32\\OpenSSH\\ssh.exe"
    : "ssh");

const ALLOWED = new Set([
  "whoami",
  "hostname",
  "uptime",
  "date",
  "pwd",
  "uname -a",
  "df -h",
  "free -m",
  "free -h",
]);

/** @type {string | null} */
let cachedKeyPath = null;
/** @type {string | null} */
let cachedKeySource = null;

function isAllowedCommand(cmd) {
  if (ALLOWED.has(cmd)) return true;
  if (/^ps aux --sort=-%mem \| head -\d{1,2}$/.test(cmd)) return true;
  return false;
}

function resolveChemiCloudConfig() {
  const f = readFactory();
  return {
    host: (process.env.CHEMICLOUD_HOST || f.chemiCloudIp || "").trim(),
    user: (process.env.CHEMICLOUD_USER || f.chemiCloudUser || "").trim(),
    port: String(process.env.CHEMICLOUD_PORT || f.chemiCloudPort || 1988),
  };
}

export function sshKeyPath() {
  const envPath = (process.env.CHEMICLOUD_SSH_KEY_PATH || "").trim();
  if (envPath && fs.existsSync(envPath)) return envPath;

  const pem = (process.env.CHEMICLOUD_SSH_KEY || "").trim();
  if (pem) {
    if (cachedKeyPath && cachedKeySource === pem && fs.existsSync(cachedKeyPath)) {
      return cachedKeyPath;
    }
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "aztodev-ssh-"));
    const keyFile = path.join(dir, "chemicloud");
    fs.writeFileSync(keyFile, pem.endsWith("\n") ? pem : `${pem}\n`, { mode: 0o600 });
    cachedKeyPath = keyFile;
    cachedKeySource = pem;
    return keyFile;
  }

  const nopass = path.join(ROOT, "ops", "secrets", "aztodev-cpanel.nopass");
  const raw = path.join(ROOT, "ops", "secrets", "aztodev-cpanel");
  if (fs.existsSync(nopass)) return nopass;
  if (fs.existsSync(raw)) return raw;
  return "";
}

export function sshConfigured() {
  const { host, user } = resolveChemiCloudConfig();
  const key = sshKeyPath();
  return Boolean(host && user && key);
}

/**
 * Read-only remote command. Never used for deploy/restart.
 * @param {string} command
 */
export function runReadOnlySsh(command = "uptime") {
  const cmd = String(command || "uptime").trim();
  if (!isAllowedCommand(cmd)) {
    return Promise.resolve({
      ok: false,
      error: "command_not_allowed",
      allowed: [...ALLOWED, "ps aux --sort=-%mem | head -15"],
    });
  }
  const { host, user, port } = resolveChemiCloudConfig();
  const key = sshKeyPath();
  if (!host || !user || !key) {
    return Promise.resolve({ ok: false, error: "ssh_not_configured" });
  }

  return new Promise((resolve) => {
    const args = [
      "-4",
      "-p",
      port,
      "-i",
      key,
      "-o",
      "IdentitiesOnly=yes",
      "-o",
      "BatchMode=yes",
      "-o",
      "ConnectTimeout=15",
      "-o",
      "StrictHostKeyChecking=accept-new",
      `${user}@${host}`,
      cmd,
    ];
    const child = spawn(SSH_EXE, args, {
      windowsHide: process.platform === "win32",
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => {
      out += d.toString("utf8");
    });
    child.stderr.on("data", (d) => {
      err += d.toString("utf8");
    });
    child.on("error", (e) =>
      resolve({ ok: false, error: String(e.message || e).slice(0, 200) })
    );
    child.on("close", (code) => {
      resolve({
        ok: code === 0,
        command: cmd,
        stdout: out.slice(0, 4000),
        stderr: err.slice(0, 500),
        code,
      });
    });
  });
}
