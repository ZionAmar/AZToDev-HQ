/**
 * node runtime/scripts/run-tests.mjs
 *
 * Runs every runtime/scripts/test-*.mjs in its own process and reports a
 * pass/fail summary. Wired to `npm test` so a regression can't sit red and
 * unnoticed the way test-live-status.mjs did on 2026-09-09 (nothing ran the
 * suite, so a real bug shipped invisibly) — evidence beats a promise.
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const files = fs
  .readdirSync(HERE)
  .filter((f) => f.startsWith("test-") && f.endsWith(".mjs"))
  .sort();

let failed = 0;
for (const f of files) {
  const full = path.join(HERE, f);
  const res = spawnSync(process.execPath, [full], { encoding: "utf8" });
  const ok = res.status === 0;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${f}`);
  if (!ok) {
    const out = `${res.stdout || ""}${res.stderr || ""}`.trim();
    console.log(out.slice(-1500));
  }
}

console.log(`\n${files.length - failed}/${files.length} passed`);
if (failed) process.exit(1);
