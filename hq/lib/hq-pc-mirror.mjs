/**
 * PC → desk mirror of HQ files Cloud agents write to GitHub.
 * Uses founder PC git credentials (desk has no GitHub login).
 * Never touches ChemiCloud customer sites.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { ROOT, journal, RUNTIME_DIR, readJson, writeJson, nowIso } from "../../runtime/lib/paths.mjs";
import { readFactory } from "../../runtime/lib/company-state.mjs";
import { sshKeyPath } from "../../runtime/lib/ssh-chemicloud.mjs";
import { LIVE_AGENT_IDS } from "../../runtime/lib/agent-memory.mjs";

const SSH_EXE = process.env.SSH_EXE || "C:\\Windows\\System32\\OpenSSH\\ssh.exe";
const SCP_EXE = process.env.SCP_EXE || "C:\\Windows\\System32\\OpenSSH\\scp.exe";
const REMOTE_DIR = "/home/aztodevc/aztodev-desk";
const STAMP = path.join(RUNTIME_DIR, "hq-pc-mirror.json");

function git(args) {
  return spawnSync("git", ["-C", ROOT, ...args], {
    encoding: "utf8",
    windowsHide: true,
    timeout: 60000,
  });
}

function sshBase() {
  const f = readFactory();
  const key = sshKeyPath();
  if (!f.chemiCloudIp || !f.chemiCloudUser || !key) return null;
  return {
    host: f.chemiCloudIp,
    user: f.chemiCloudUser,
    port: String(f.chemiCloudPort || 1988),
    key,
  };
}

function collectFiles() {
  const files = [];
  const addIf = (rel) => {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) files.push(rel.replace(/\\/g, "/"));
  };
  addIf("ops/config/factory.json");
  addIf("ops/config/agent-models.json");
  addIf("ops/intake/kidnest-github-upload-board.json");
  for (const id of LIVE_AGENT_IDS) {
    for (const box of ["inbox", "outbox"]) {
      const dir = path.join(ROOT, "agents", id, box);
      if (!fs.existsSync(dir)) continue;
      for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith(".md") || name.startsWith("_")) continue;
        addIf(path.join("agents", id, box, name));
      }
    }
  }
  return files;
}

/**
 * Pull HQ on PC, then SCP hot paths to desk.
 */
export function mirrorHqToDesk() {
  const ssh = sshBase();
  if (!ssh) return { ok: false, error: "ssh_not_configured" };

  const pull = git(["pull", "--ff-only", "origin", "main"]);
  if (pull.status !== 0) {
    // dirty or diverge — still try push of local files we care about
    journal("hq_pc_mirror_pull_soft_fail", {
      error: (pull.stderr || pull.stdout || "").slice(0, 200),
    });
  }

  const files = collectFiles();
  const st = readJson(STAMP, { hashes: {} });
  const hashes = st.hashes || {};
  let sent = 0;
  const remote = `${ssh.user}@${ssh.host}`;

  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    let body;
    try {
      body = fs.readFileSync(abs);
    } catch {
      continue;
    }
    const hash = crypto.createHash("sha1").update(body).digest("hex");
    if (hashes[rel] === hash) continue;
    const remotePath = `${REMOTE_DIR}/${rel}`.replace(/\\/g, "/");
    const remoteDir = remotePath.replace(/\/[^/]+$/, "");
    spawnSync(
      SSH_EXE,
      [
        "-4",
        "-p",
        ssh.port,
        "-i",
        ssh.key,
        "-o",
        "IdentitiesOnly=yes",
        "-o",
        "BatchMode=yes",
        "-o",
        "ConnectTimeout=12",
        "-o",
        "StrictHostKeyChecking=accept-new",
        remote,
        `mkdir -p ${remoteDir}`,
      ],
      { windowsHide: true, timeout: 20000 }
    );
    const scp = spawnSync(
      SCP_EXE,
      [
        "-4",
        "-P",
        ssh.port,
        "-i",
        ssh.key,
        "-o",
        "IdentitiesOnly=yes",
        "-o",
        "BatchMode=yes",
        "-o",
        "StrictHostKeyChecking=accept-new",
        abs,
        `${remote}:${remotePath}`,
      ],
      { windowsHide: true, timeout: 30000 }
    );
    if (scp.status === 0) {
      hashes[rel] = hash;
      sent += 1;
    }
  }

  writeJson(STAMP, { hashes, at: nowIso(), sent });
  if (sent) journal("hq_pc_mirror_sent", { sent });
  return { ok: true, sent, pulled: pull.status === 0 };
}
