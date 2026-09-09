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

let cloudKeyTempPath = "";

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

function sshConnectionParams() {
  const f = readFactory();
  return {
    host: (process.env.CHEMICLOUD_HOST || "").trim() || f.chemiCloudIp || "",
    user: (process.env.CHEMICLOUD_USER || "").trim() || f.chemiCloudUser || "",
    port: String(
      (process.env.CHEMICLOUD_PORT || "").trim() || f.chemiCloudPort || 1988
    ),
  };
}

export function sshConfigured() {
  const { host, user } = sshConnectionParams();
  const key = sshKeyPath();
  return Boolean(host && user && key);
}

export function sshKeyPath() {
  const fromPath = (process.env.CHEMICLOUD_SSH_KEY_PATH || "").trim();
  if (fromPath && fs.existsSync(fromPath)) return fromPath;

  const inline = (process.env.CHEMICLOUD_SSH_KEY || "").trim();
  if (inline) {
    if (!cloudKeyTempPath) {
      cloudKeyTempPath = path.join(
        os.tmpdir(),
        `aztodev-chemicloud-${process.pid}.key`
      );
      const pem = inline.includes("\\n")
        ? inline.replace(/\\n/g, "\n")
        : inline;
      fs.writeFileSync(cloudKeyTempPath, pem.endsWith("\n") ? pem : `${pem}\n`, {
        mode: 0o600,
      });
    }
    return cloudKeyTempPath;
  }

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
  const { host, user, port } = sshConnectionParams();
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
