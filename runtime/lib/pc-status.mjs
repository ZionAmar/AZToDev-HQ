import os from "os";
import fs from "fs";
import path from "path";
import { ROOT } from "./paths.mjs";

export function pcStatus() {
  const total = os.totalmem();
  const free = os.freemem();
  return {
    ok: true,
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    uptimeSec: Math.round(os.uptime()),
    cpuCount: os.cpus()?.length || 0,
    memUsedPct: Math.round((1 - free / total) * 100),
    hqRoot: ROOT,
    hqExists: fs.existsSync(ROOT),
    secretsDir: fs.existsSync(path.join(ROOT, "ops", "secrets")),
  };
}
