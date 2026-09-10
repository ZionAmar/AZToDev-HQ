/**
 * Living company memory — files on disk (GitHub HQ), injected into every run.
 * Cloud VMs die; these files are the person.
 */
import fs from "fs";
import path from "path";
import { ROOT, OPS, RUNTIME_DIR, nowIso, journal, ensureRuntimeDirs } from "./paths.mjs";
import { readAgentName } from "./router.mjs";
import { stripActivateProduct } from "./product-activate.mjs";
import { companyLessonsPromptBlock } from "./company-lessons.mjs";

export const LIVE_AGENT_IDS = [
  "00-ceo",
  "33-household-ops",
  "34-pc-ops",
  "35-server-ops",
  "32-delivery-lead",
];

const CORE_PATH = path.join(ROOT, "_company", "CORE_CONTEXT.md");
const LOG_MAX_CHARS = 2800;
const ITERATION_KEEP = 40;

export function memoryLogPath(agentId) {
  return path.join(ROOT, "agents", agentId, "memory", "learning-log.md");
}

function peopleLedgerPath() {
  ensureRuntimeDirs();
  return path.join(RUNTIME_DIR, "people-ledger.jsonl");
}

export function readCoreContext() {
  try {
    return fs.readFileSync(CORE_PATH, "utf8").trim();
  } catch {
    return "";
  }
}

export function readLearningLog(agentId) {
  if (!agentId) return "";
  try {
    return fs.readFileSync(memoryLogPath(agentId), "utf8").trim();
  } catch {
    return "";
  }
}

export function memoryPromptBlock(agentId) {
  const core = readCoreContext().slice(0, 1800);
  const log = readLearningLog(agentId);
  const tail = log.length > LOG_MAX_CHARS ? log.slice(-LOG_MAX_CHARS) : log;
  const name = agentId ? readAgentName(agentId) : "agent";
  const lessons = companyLessonsPromptBlock();
  return `
=== SHARED BRAIN (_company/CORE_CONTEXT.md) ===
${core || "(missing CORE_CONTEXT.md)"}

${lessons ? lessons + "\n" : ""}
=== YOUR LEARNING LOG (agents/${agentId || "?"}/memory/learning-log.md) — you have done this before ===
${tail || "(empty — first real day in this folder)"}

End every task with a machine block HQ will store (not for Telegram):
LEARNING:
- do: <one pattern to repeat>
- dont: <one mistake>
- note: <one line what happened>
If you are ${name} (${agentId || "ops"}): stay in this role. Do not do another specialist's tools.
`.trim();
}

const LEARNING_BLOCK =
  /LEARNING:\s*\n((?:[-*]\s*(?:do|dont|don't|note)\s*:[^\n]*\n?)+)/i;

export function parseLearningBlock(text) {
  const raw = String(text || "");
  const m = raw.match(LEARNING_BLOCK);
  if (!m) return null;
  const doM = m[1].match(/[-*]\s*do\s*:\s*(.+)/i);
  const dontM = m[1].match(/[-*]\s*don'?t\s*:\s*(.+)/i);
  const noteM = m[1].match(/[-*]\s*note\s*:\s*(.+)/i);
  const doLine = (doM?.[1] || "").trim();
  const dontLine = (dontM?.[1] || "").trim();
  const note = (noteM?.[1] || "").trim();
  if (!doLine && !dontLine && !note) return null;
  return { do: doLine, dont: dontLine, note };
}

export function stripLearningBlock(text) {
  return String(text || "")
    .replace(LEARNING_BLOCK, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function stripFakeSpecialistClaims(text) {
  let t = String(text || "");
  t = t.replace(
    /(?:רות|נדב|תמיר|קשת)\s+(?:כבר\s+)?(?:בדק(?:ה|ו)?|מצא(?:ה)?|שלח(?:ה)?|עשתה|סיימ(?:ה|ו)).{0,100}/gi,
    ""
  );
  t = t.replace(/הפעלתי את (?:רות|נדב|תמיר|קשת).{0,80}/gi, "");
  return t.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * If Noa skipped DELEGATE but the founder clearly asked specialist work, HQ starts it.
 */
export function inferRequiredDelegate(founderText) {
  const t = String(founderText || "");
  if (!t.trim()) return null;
  const task = t.replace(/\[STANDBY[\s\S]*?\]\s*/g, "").slice(0, 500).trim();

  if (
    /גיטהב|github|העלה\s+ל|ריפו פרטי/i.test(t)
  ) {
    return {
      agentId: "32-delivery-lead",
      task: task || "Plan GitHub upload — wait for founder אשר before Nadav/push",
    };
  }

  if (
    /תבנו|תבנה|תפעיל(?:י|ו)?\s+(?:את\s+)?קשת|לבנות\s+(?:מוצר|אפליק)|לפתח\s+(?:מוצר|אפליק)|פיתוח מוצר|מוצר חדש|תפתח(?:ו|י)?\s+(?:מוצר|אפליק|סאאס|saas)|keshet|(?:^|\s)קשת(?:\s|$|[.,!?])/i.test(
      t
    )
  ) {
    return {
      agentId: "32-delivery-lead",
      task: task || "Founder asked to start product work — plan only until PIN + explicit build",
    };
  }

  if (
    /(?:תבדוק|תבדקי|בדוק|בדקי) את (?:ה)?שרת|סטטוס (?:ה)?שרת|זיכרון בשרת|עומס (?:על )?השרת|(?:^|[\s,])תמיר(?:\s|$)|swap/i.test(
      t
    )
  ) {
    return { agentId: "35-server-ops", task: task || "Read-only server RAM/swap/load" };
  }

  const action =
    /בדק|מצא|חפש|תרא|תציג|סטטוס|מה יש|תביא|תוציא|תפתח|תקרא|תרים|check|find|search|status|show|open/i.test(
      t
    );
  if (!action && !/חשבונית|כביש\s*6|כרמל/.test(t)) return null;

  if (
    /חדשות|האיי-?אי|ai news|בינה מלאכותית|hamivzakk|המבזק|tech news/i.test(t)
  ) {
    return {
      agentId: "33-household-ops",
      task: task || "Summarize today's AI/tech news headlines only — Hebrew brief for founder",
    };
  }

  if (
    /מייל|gmail|חשבונית|כביש\s*6|מנהרות הכרמל|כרמל|pdf|inbox|חשבון/i.test(t)
  ) {
    return { agentId: "33-household-ops", task: task || "Check household mail / invoices" };
  }
  if (
    /דיסק|תיקי[הה]|windows|שולחן העבודה|במחשב|C:\\|מקום פנוי|קבצים אצלי/i.test(t)
  ) {
    return { agentId: "34-pc-ops", task: task || "PC disk / folder status" };
  }
  return null;
}

function ensureLogSkeleton(agentId) {
  const p = memoryLogPath(agentId);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (!fs.existsSync(p)) {
    const name = readAgentName(agentId);
    fs.writeFileSync(
      p,
      `# Learning log — ${name} (\`${agentId}\`)\n\n## Active patterns\n\n## Never again\n\n## Iteration log\n`,
      "utf8"
    );
  }
  return p;
}

function trimIterationLog(full) {
  const marker = "## Iteration log";
  const i = full.indexOf(marker);
  if (i < 0) return full;
  const head = full.slice(0, i + marker.length);
  const rest = full.slice(i + marker.length);
  const chunks = rest.split(/\n(?=### )/).filter((s) => s.trim());
  const kept = chunks.slice(-ITERATION_KEEP);
  return `${head}\n${kept.join("\n").trim()}\n`;
}

export function appendLearning(agentId, { do: doLine, dont, note, task } = {}) {
  if (!agentId) return { ok: false };
  const p = ensureLogSkeleton(agentId);
  const day = nowIso().slice(0, 10);
  const lines = [`### ${day}`];
  if (task) lines.push(`- task: ${String(task).replace(/\s+/g, " ").slice(0, 220)}`);
  if (doLine) lines.push(`- do: ${String(doLine).slice(0, 240)}`);
  if (dont) lines.push(`- dont: ${String(dont).slice(0, 240)}`);
  if (note) lines.push(`- note: ${String(note).slice(0, 240)}`);
  if (lines.length < 2) return { ok: false };
  let cur = fs.readFileSync(p, "utf8");
  if (!cur.includes("## Iteration log")) cur += "\n## Iteration log\n";
  cur = `${cur.trim()}\n${lines.join("\n")}\n`;
  fs.writeFileSync(p, trimIterationLog(cur), "utf8");
  journal("agent_memory_append", { agentId });
  return { ok: true, path: p };
}

export function appendPeopleLedger(row) {
  ensureRuntimeDirs();
  const line =
    JSON.stringify({
      at: nowIso(),
      agentId: row.agentId || "",
      name: row.agentId ? readAgentName(row.agentId) : "",
      fromAgentId: row.fromAgentId || "",
      ok: Boolean(row.ok),
      jobId: row.jobId || "",
      cloudAgentId: row.cloudAgentId || "",
      url: row.cloudAgentId ? `https://cursor.com/agents/${row.cloudAgentId}` : "",
      task: String(row.task || "").slice(0, 300),
      preview: String(row.preview || "").slice(0, 240),
    }) + "\n";
  fs.appendFileSync(peopleLedgerPath(), line, "utf8");
}

export function recordAgentTurn({
  agentId,
  task = "",
  text = "",
  ok = true,
  cloudAgentId = "",
  fromAgentId = "",
  jobId = "",
} = {}) {
  if (!agentId) return;
  const parsed = parseLearningBlock(text);
  if (parsed) {
    appendLearning(agentId, { ...parsed, task });
  } else if (ok && String(text || "").trim()) {
    appendLearning(agentId, {
      note: String(text).replace(/\s+/g, " ").slice(0, 200),
      task,
    });
  }
  appendPeopleLedger({
    agentId,
    fromAgentId,
    ok,
    jobId,
    cloudAgentId,
    task,
    preview: stripLearningBlock(text),
  });
}

export function founderFacingText(text) {
  return stripFakeSpecialistClaims(
    stripActivateProduct(stripLearningBlock(text)).replace(/^DELEGATE:\s*.+$/gim, "")
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
