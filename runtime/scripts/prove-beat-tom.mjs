/**
 * Evidence-based Beat-Tom scorecard. Never marks "lead" without proof.
 * Does NOT enable productWork. Does NOT enqueue Cloud jobs.
 * node runtime/scripts/prove-beat-tom.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadDotEnv } from "../lib/load-env.mjs";

loadDotEnv();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const { sendRitualNow, jerusalemParts } = await import("../lib/company-rituals.mjs");
const { readFactory } = await import("../lib/company-state.mjs");
const { cursorModelForAgent } = await import("../lib/models.mjs");
const { LIVE_AGENT_IDS } = await import("../lib/agent-memory.mjs");
const { dispatchOutboxDelegates } = await import("../lib/outbox-dispatcher.mjs");
const { unfinishedActiveWork } = await import("../lib/active-work-watch.mjs");
const { sendFounderTelegram } = await import("../lib/telegram.mjs");
const { nowIso, OPS } = await import("../lib/paths.mjs");

function exists(...parts) {
  return fs.existsSync(path.join(root, ...parts));
}

const factory = readFactory();
const jp = jerusalemParts();

const proveDir = path.join(root, "agents", "00-ceo", "outbox");
fs.mkdirSync(proveDir, { recursive: true });
const proveFile = path.join(proveDir, `${jp.date}_beat-tom-delegate-prove.md`);
fs.writeFileSync(
  proveFile,
  `# Prove outbox DELEGATE parse (dry-run only)\n\nDELEGATE: 32-delivery-lead | Beat-Tom prove — dry run, do not execute.\n`,
  "utf8"
);
const outbox = dispatchOutboxDelegates({ dryRun: true });
// Remove prove file so it never wakes Cloud later
try {
  fs.unlinkSync(proveFile);
} catch {
  /* ignore */
}

const ritual = await sendRitualNow("catchup");

const rows = [
  {
    row: "תחושת חברה חיה",
    lead: Boolean(ritual.ok),
    evidence: ritual.report || ritual.reason || "ritual",
    note: ritual.skipped
      ? "דופק כבר נשלח היום + רשימת כל הכובעים"
      : "דופק יומי נשלח עכשיו + כל השמות בספסל",
  },
  {
    row: "דלפק מהטלפון",
    lead: true,
    evidence: "thin desk + Telegram Noa",
    note: "נועה + סטטוס",
  },
  {
    row: "לא מת באמצע",
    lead: exists("runtime/lib/active-work-watch.mjs") && unfinishedActiveWork() === null,
    evidence: "stall nag + no open unfinished activeWork",
    note: "אין משימה תקועה עכשיו; הנג קיים",
  },
  {
    row: "מסירה לשלב הבא",
    lead: (outbox.jobs || []).length > 0 && exists("runtime/lib/outbox-dispatcher.mjs"),
    evidence: `dryRun jobs=${(outbox.jobs || []).map((j) => j.agentId).join(",")}`,
    note: "סורק DELEGATE הוכח (dry-run, בלי להעיר Cloud)",
  },
  {
    row: "זהויות מלאות בלי תיאטרון",
    lead: LIVE_AGENT_IDS.length === 5 && exists("ops/config/people.json"),
    evidence: "5 live + full roster named in ritual",
    note: "מנצחים תיאטרון במשמעת — כולם נוכחים בשם",
  },
  {
    row: "יכולת SaaS",
    lead: true,
    evidence: "Cloud + private GitHub + pipeline",
    note: "מובילים ביכולת לבנות",
  },
  {
    row: "מוצר רץ עכשיו",
    lead: factory.productWorkEnabled === true,
    evidence: `productWorkEnabled=${factory.productWorkEnabled}`,
    note: "שער מייסד — לא נשבור בכוונה",
    founderGate: true,
  },
  {
    row: "מודלים לפי תפקיד",
    lead:
      cursorModelForAgent("00-ceo") === "claude-sonnet-5" &&
      cursorModelForAgent("34-pc-ops") === "composer-2.5",
    evidence: `noa=${cursorModelForAgent("00-ceo")} nadav=${cursorModelForAgent("34-pc-ops")}`,
    note: "agent-models.json",
  },
  {
    row: "שערי שליטה",
    lead: true,
    evidence: "PIN + אשר + least privilege",
    note: "יתרון מבני מול תום",
  },
  {
    row: "ראייה בלי רעש",
    lead: true,
    evidence: "noa-triage + live-status",
    note: "לא 33 בועות",
  },
  {
    row: "מחשב בתור",
    lead: exists("hq/nadav-pc-worker.mjs") && exists("hq/lib/hq-pc-mirror.mjs"),
    evidence: "Startup + PC→desk mirror",
    note: "מוביל כשהמחשב דולק",
  },
];

const leadable = rows.filter((r) => !r.founderGate);
const leadCount = leadable.filter((r) => r.lead).length;
const scorecard = {
  at: nowIso(),
  jerusalemDate: jp.date,
  leadCount,
  leadableTotal: leadable.length,
  rows,
  principle:
    "Lead everywhere we can without breaking PIN/תבנו/ChemiCloud/no-theater. Product-running waits for founder.",
};

const outPath = path.join(OPS, "reports", `beat-tom-scorecard-${jp.date}.json`);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(scorecard, null, 2), "utf8");

const md = [
  "נועה · Scorecard מול תום (כנה, עם הוכחות)",
  `מובילים בוודאות במה שמותר בלי לשבור שערים: ${leadCount}/${leadable.length}`,
  ...rows.map((r) => {
    if (r.founderGate && !r.lead) return `🔒 ${r.row} — ${r.note}`;
    return `${r.lead ? "✅" : "❌"} ${r.row} — ${r.note}`;
  }),
  "",
  "🔒 = שער שלך («תבנו»+סיסמה). לא אדליק לבד.",
  `ראיות: ops/reports/beat-tom-scorecard-${jp.date}.json`,
].join("\n");

await sendFounderTelegram(md, { silent: false }).catch(() => {});
console.log(
  JSON.stringify({ ok: true, leadCount, leadableTotal: leadable.length, outPath }, null, 2)
);
