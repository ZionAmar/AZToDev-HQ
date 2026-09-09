/**
 * Nadav on the founder PC — no Telegram poll, no Cursor on ChemiCloud.
 * Polls a JSON queue under /home/aztodevc/aztodev-desk only.
 */
import "../runtime/lib/windows-hide.mjs";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import { loadDotEnv } from "../runtime/lib/load-env.mjs";
import { RUNTIME_DIR, writeJson, nowIso, journal } from "../runtime/lib/paths.mjs";
import { hqCloudOnly } from "../runtime/lib/specialist-runtime.mjs";
import { chatWithAgent, sanitizeForTelegram } from "../runtime/lib/agent-sessions.mjs";
import { sendFounderTelegram } from "../runtime/lib/telegram.mjs";
import { readFactory } from "../runtime/lib/company-state.mjs";
import { sshKeyPath } from "../runtime/lib/ssh-chemicloud.mjs";
import { mirrorHqToDesk } from "./lib/hq-pc-mirror.mjs";

loadDotEnv();

if (hqCloudOnly()) {
  console.error("nadav-pc-worker must not run on the ChemiCloud desk");
  process.exit(1);
}

const PID_PATH = path.join(RUNTIME_DIR, "nadav-pc-worker.pid");
const POLL_MS = Number(process.env.NADAV_POLL_MS || 12000);
const BACKOFF_MS = 30000;
const SSH_EXE = process.env.SSH_EXE || "C:\\Windows\\System32\\OpenSSH\\ssh.exe";
const REMOTE_NODE = "/opt/alt/alt-nodejs22/root/usr/bin/node";
const REMOTE_DIR = "/home/aztodevc/aztodev-desk";
let mirrorEvery = 0;

function alreadyRunning() {
  try {
    const pid = Number(fs.readFileSync(PID_PATH, "utf8").trim());
    if (!pid || pid === process.pid) return false;
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

if (alreadyRunning()) {
  console.error("nadav-pc-worker already running");
  process.exit(0);
}

fs.mkdirSync(RUNTIME_DIR, { recursive: true });
fs.writeFileSync(PID_PATH, String(process.pid));
process.on("exit", () => {
  try {
    if (fs.readFileSync(PID_PATH, "utf8").trim() === String(process.pid)) {
      fs.unlinkSync(PID_PATH);
    }
  } catch {
    /* ignore */
  }
});

function sshRun(remoteArgv) {
  const f = readFactory();
  const key = sshKeyPath();
  const host = f.chemiCloudIp;
  const user = f.chemiCloudUser;
  const port = String(f.chemiCloudPort || 1988);
  if (!host || !user || !key) {
    return Promise.resolve({ ok: false, stdout: "", error: "ssh_not_configured" });
  }
  const remote = `cd ${REMOTE_DIR} && ${REMOTE_NODE} hq/lib/nadav-queue-cli.mjs ${remoteArgv}`;
  return new Promise((resolve) => {
    const child = spawn(
      SSH_EXE,
      [
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
        "ConnectTimeout=8",
        "-o",
        "StrictHostKeyChecking=accept-new",
        `${user}@${host}`,
        remote,
      ],
      { windowsHide: true }
    );
    let out = "";
    let err = "";
    const t = setTimeout(() => {
      child.kill();
      resolve({ ok: false, stdout: out, error: "ssh_timeout" });
    }, 20000);
    child.stdout.on("data", (d) => {
      out += d.toString("utf8");
    });
    child.stderr.on("data", (d) => {
      err += d.toString("utf8");
    });
    child.on("error", (e) => {
      clearTimeout(t);
      resolve({ ok: false, stdout: "", error: String(e.message || e).slice(0, 200) });
    });
    child.on("close", (code) => {
      clearTimeout(t);
      resolve({
        ok: code === 0,
        stdout: out.trim(),
        error: err.slice(0, 300),
      });
    });
  });
}

function applyJobPin(job) {
  const until = job?.actionUnlockedUntil;
  if (!until || Date.parse(until) <= Date.now()) return;
  writeJson(path.join(RUNTIME_DIR, "action-pin-unlock.json"), {
    until,
    at: nowIso(),
    source: "nadav-queue",
  });
}

async function runJob(job) {
  applyJobPin(job);
  const out = await chatWithAgent("34-pc-ops", job.task, {
    asDelegation: true,
    fromAgentId: job.fromAgentId || "00-ceo",
  });
  const text = sanitizeForTelegram(String(out.text || "")).slice(0, 1200);
  await sendFounderTelegram(
    `נדב · המחשב\n${text || "(בלי טקסט)"}\n\nאפשר להמשיך עם נועה בטלגרם.`,
    { silent: false }
  );
  return { ok: Boolean(out.ok), text: String(out.text || "") };
}

async function tick() {
  mirrorEvery += 1;
  if (mirrorEvery === 1 || mirrorEvery % 5 === 0) {
    try {
      const mirrored = mirrorHqToDesk();
      if (mirrored.sent) journal("nadav_mirror_tick", { sent: mirrored.sent });
    } catch (err) {
      journal("nadav_mirror_error", { error: String(err?.message || err).slice(0, 160) });
    }
  }
  const host = os.hostname().replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 60) || "pc";
  const beat = await sshRun(`heartbeat ${host}`);
  if (!beat.ok) return { ok: false, error: beat.error || "heartbeat_fail" };
  const nxt = await sshRun("next");
  if (!nxt.ok) return { ok: false, error: nxt.error || "next_fail" };
  if (!nxt.stdout || nxt.stdout === "null") return { ok: true, job: false };
  let job;
  try {
    job = JSON.parse(nxt.stdout);
  } catch {
    return { ok: false, error: "bad_job_json" };
  }
  if (!job?.id || !job?.task) return { ok: true, job: false };
  journal("nadav_pc_job_start", { jobId: job.id });
  let ok = false;
  let resultText = "";
  try {
    const r = await runJob(job);
    ok = r.ok;
    resultText = r.text || "";
  } catch (err) {
    journal("nadav_pc_job_error", { jobId: job.id, error: String(err?.message || err).slice(0, 200) });
    await sendFounderTelegram(
      `נדב נתקע על המחשב: ${String(err?.message || err).slice(0, 200)}`,
      { silent: true }
    ).catch(() => {});
  }
  const payload = Buffer.from(resultText.slice(0, 3500), "utf8").toString("base64url");
  await sshRun(`finish ${job.id} ${ok ? "done" : "error"} ${payload}`);
  return { ok: true, job: true };
}

console.log(`AZToDev Nadav PC worker  poll=${POLL_MS}ms`);
journal("nadav_pc_worker_start", { pid: process.pid });

async function loop() {
  let delay = POLL_MS;
  try {
    const r = await tick();
    delay = r.ok ? POLL_MS : BACKOFF_MS;
  } catch (err) {
    journal("nadav_pc_worker_tick_error", { error: String(err?.message || err).slice(0, 200) });
    delay = BACKOFF_MS;
  }
  setTimeout(loop, delay);
}

loop();
