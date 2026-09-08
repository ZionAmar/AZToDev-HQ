/**
 * Deprecated standalone dashboard server.
 * Use the company power switch instead:
 *   node runtime/emet.mjs on
 *   EMET-ON.bat
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
console.log("Redirecting to EMET runtime (power ON)...");
spawn(process.execPath, [path.join(root, "runtime", "emet.mjs"), "on"], {
  stdio: "inherit",
  cwd: root,
  shell: false,
});
