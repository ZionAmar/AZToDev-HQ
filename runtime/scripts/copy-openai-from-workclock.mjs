import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = path.join(
  "C:",
  "Users",
  "amazi",
  "Desktop",
  "Projects",
  "in_production",
  "work_clock",
  "server",
  ".env"
);
const DST = path.join(ROOT, ".env");

function parseEnv(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[t.slice(0, i).trim()] = v;
  }
  return out;
}

if (!fs.existsSync(SRC)) {
  console.error("work_clock .env not found:", SRC);
  process.exit(1);
}
const key = parseEnv(fs.readFileSync(SRC, "utf8")).OPENAI_API_KEY;
if (!key) {
  console.error("OPENAI_API_KEY missing in work_clock .env");
  process.exit(1);
}

let env = fs.readFileSync(DST, "utf8");
if (/^OPENAI_API_KEY=.*$/m.test(env)) {
  env = env.replace(/^OPENAI_API_KEY=.*$/m, `OPENAI_API_KEY=${key}`);
} else {
  env = env.replace("# OPENAI_API_KEY=", `OPENAI_API_KEY=${key}`);
}
fs.writeFileSync(DST, env, "utf8");
console.log("OPENAI_API_KEY copied from work_clock to my_company/.env");
