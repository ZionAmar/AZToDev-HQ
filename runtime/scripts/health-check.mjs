/**
 * EMET health check — exit 0 if core systems look OK.
 */
import fs from "fs";
import path from "path";
import { ROOT, OPS, RUNTIME_DIR } from "../lib/paths.mjs";

function loadEnv() {
  const p = path.join(ROOT, ".env");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
}

loadEnv();

const checks = [];
const ok = (name, pass, detail = "") => {
  checks.push({ name, pass: Boolean(pass), detail });
};

ok("CURSOR_API_KEY", Boolean(process.env.CURSOR_API_KEY?.trim()));
ok("TELEGRAM_BOT_TOKEN", Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim()));
ok("TELEGRAM_FOUNDER_CHAT_ID", Boolean(process.env.TELEGRAM_FOUNDER_CHAT_ID?.trim()));
ok("OPENAI_API_KEY", Boolean(process.env.OPENAI_API_KEY?.trim()), "voice+optional");
ok("GMAIL", Boolean(process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASS?.trim()), "email digest");
ok(
  "cursor_model",
  (process.env.EMET_CURSOR_MODEL || "composer-2.5") === "composer-2.5" &&
    !(process.env.EMET_CURSOR_FAST_MODEL || "").includes("fast"),
  process.env.EMET_CURSOR_FAST_MODEL || process.env.EMET_CURSOR_MODEL
);

const agentsDir = path.join(ROOT, "agents");
const agentIds = fs.existsSync(agentsDir)
  ? fs.readdirSync(agentsDir).filter((d) =>
      fs.existsSync(path.join(agentsDir, d, "SYSTEM_PROMPT.md"))
    )
  : [];
ok("agents", agentIds.length >= 30, `${agentIds.length} agents`);

ok("ops", fs.existsSync(OPS));
ok("runtime", fs.existsSync(RUNTIME_DIR));
ok("dashboard", fs.existsSync(path.join(ROOT, "dashboard", "index.html")));

let dash = false;
try {
  const r = await fetch("http://127.0.0.1:8787/api/status");
  const j = await r.json();
  dash = j.power === "on" && j.alive;
  ok("emet_on", dash, j.resumeNote || j.cursor?.resumeNote || "");
  ok("parity_telegram", j.parity?.telegram === true);
  ok("parity_llm", j.parity?.llm === true);
} catch (e) {
  ok("emet_on", false, String(e.message || e));
}

const failed = checks.filter((c) => !c.pass);
const report = {
  at: new Date().toISOString(),
  ok: failed.length === 0,
  checks,
  failed: failed.map((c) => c.name),
};
fs.mkdirSync(path.join(OPS, "reports"), { recursive: true });
const out = path.join(OPS, "reports", `health-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(failed.length ? 1 : 0);
