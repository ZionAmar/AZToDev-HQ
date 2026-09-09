/**
 * Tiny CLI for the PC worker over SSH. Runs on the desk only.
 * Commands:
 *   next
 *   heartbeat <hostname>
 *   finish <jobId> <done|error> [base64urlResult]
 * Never starts Cursor. Never touches site folders.
 */
import { loadDotEnv } from "../../runtime/lib/load-env.mjs";
import {
  claimNextNadavJob,
  writeNadavHeartbeat,
  completeNadavPcJob,
} from "../../runtime/lib/nadav-queue.mjs";

loadDotEnv();

function decodeResult(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  try {
    return Buffer.from(s, "base64url").toString("utf8");
  } catch {
    try {
      return Buffer.from(s, "base64").toString("utf8");
    } catch {
      return "";
    }
  }
}

const cmd = String(process.argv[2] || "").trim();

if (cmd === "next") {
  const job = claimNextNadavJob();
  process.stdout.write(JSON.stringify(job));
  process.exit(0);
}

if (cmd === "heartbeat") {
  const hostname = String(process.argv[3] || "").replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 80);
  writeNadavHeartbeat({ hostname: hostname || "pc" });
  process.stdout.write("ok");
  process.exit(0);
}

if (cmd === "finish") {
  const jobId = process.argv[3];
  const status = process.argv[4];
  const resultText = decodeResult(process.argv[5]);
  const out = await completeNadavPcJob(jobId, status, resultText);
  process.stdout.write(out.ok ? "ok" : "missing");
  process.exit(out.ok ? 0 : 1);
}

console.error("usage: next | heartbeat <host> | finish <jobId> done|error [b64]");
process.exit(2);
