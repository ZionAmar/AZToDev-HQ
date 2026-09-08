import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { ROOT } from "./paths.mjs";
import { readFactory } from "./company-state.mjs";

const SSH_EXE =
  process.env.SSH_EXE ||
  "C:\\Windows\\System32\\OpenSSH\\ssh.exe";

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

export function sshConfigured() {
  const f = readFactory();
  const key = sshKeyPath();
  return Boolean(f.chemiCloudIp && f.chemiCloudUser && key);
}

export function sshKeyPath() {
  const nopass = path.join(ROOT, "ops", "secrets", "aztodev-cpanel.nopass");
  const raw = path.join(ROOT, "ops", "secrets", "aztodev-cpanel");
  if (fs.existsSync(nopass)) return nopass;
  if (fs.existsSync(raw)) return raw;
  return "";
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
  const f = readFactory();
  const key = sshKeyPath();
  const host = f.chemiCloudIp;
  const user = f.chemiCloudUser;
  const port = String(f.chemiCloudPort || 1988);
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
