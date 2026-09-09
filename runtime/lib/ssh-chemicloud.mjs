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

function isAllowedCommand(cmd) {
  if (ALLOWED.has(cmd)) return true;
  if (/^ps aux --sort=-%mem \| head -\d{1,2}$/.test(cmd)) return true;
  return false;
}

/** Cloud env first, then factory.json (PC may use ops/secrets/). */
export function sshConnection() {
  const f = readFactory();
  return {
    host: (
      process.env.CHEMICLOUD_HOST ||
      f.chemiCloudHost ||
      f.chemiCloudIp ||
      ""
    ).trim(),
    user: (process.env.CHEMICLOUD_USER || f.chemiCloudUser || "").trim(),
    port: String(process.env.CHEMICLOUD_PORT || f.chemiCloudPort || 1988).trim(),
  };
}

function pcKeyPath() {
  const nopass = path.join(ROOT, "ops", "secrets", "aztodev-cpanel.nopass");
  const raw = path.join(ROOT, "ops", "secrets", "aztodev-cpanel");
  if (fs.existsSync(nopass)) return nopass;
  if (fs.existsSync(raw)) return raw;
  return "";
}

let inlineKeyTempPath = "";

function writeInlineKeyTemp() {
  const inline = process.env.CHEMICLOUD_SSH_KEY;
  if (!inline || inline.length === 0) return "";
  if (inlineKeyTempPath && fs.existsSync(inlineKeyTempPath)) {
    return inlineKeyTempPath;
  }
  const p = path.join(os.tmpdir(), `aztodev-chemicloud-${process.pid}.key`);
  // Do not trim PEM — trailing newline matters for OpenSSH.
  fs.writeFileSync(p, inline, { mode: 0o600 });
  inlineKeyTempPath = p;
  return p;
}

export function sshKeyPath() {
  const envPath = (process.env.CHEMICLOUD_SSH_KEY_PATH || "").trim();
  if (envPath && fs.existsSync(envPath)) return envPath;
  const inline = writeInlineKeyTemp();
  if (inline) return inline;
  return pcKeyPath();
}

export function sshConfigured() {
  const { host, user } = sshConnection();
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
  const { host, user, port } = sshConnection();
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
    const child = spawn(SSH_EXE, args, { windowsHide: true });
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
