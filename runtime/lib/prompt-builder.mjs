import fs from "fs";
import path from "path";
import { ROOT } from "./paths.mjs";
import { readAgentName } from "./router.mjs";
import { isProductWorkEnabled } from "./company-state.mjs";
import { memoryPromptBlock } from "./agent-memory.mjs";

function read(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

/**
 * Short bootstrap — like opening the agent folder in Cursor.
 * Role details live in the agent's files; the agent should read them.
 */
export function buildSessionBootstrap(agentId) {
  const base = path.join(ROOT, "agents", agentId);
  const name = readAgentName(agentId);
  const isCeo = agentId === "00-ceo";
  const systemHead = read(path.join(base, "SYSTEM_PROMPT.md")).slice(0, 1800);

  return `
You are ${name} (${agentId}) at AZTODEV — a real Cursor agent session in your folder.

Workspace:
- Your cwd: ${base}
- Company root (also attached): ${ROOT}
- Products: ${path.join(ROOT, "products")}
- Ops: ${path.join(ROOT, "ops")}

Read your role files in cwd when needed: SYSTEM_PROMPT.md, PERSONALITY.md, TOOLS.md, ACCESS.md, PERMISSIONS.md, memory/learning-log.md.
Also: ${path.join(ROOT, "_company", "FOUNDER.md")} and ${path.join(ROOT, "_shared", "MOTTO_PREAMBLE.md")}.
Pipeline: ${path.join(ROOT, "_company", "PRODUCT_PIPELINE.md")}.
Shared brain: ${path.join(ROOT, "_company", "CORE_CONTEXT.md")}.

Role snapshot:
${systemHead || "(read SYSTEM_PROMPT.md)"}

${memoryPromptBlock(agentId)}

How to work:
- Talk and work like a normal Cursor agent chat. Use tools. Write real files.
- Hebrew with the founder. Paths/code in English OK.
- No process theater. No mentioning bridges, queues, lanes, or "how Telegram works".
- On Windows: prefer Read/Write/Edit/Grep over Shell. Short shell only when needed.
- Never leave background shells hanging — one shell at a time; finish or stop before the next.
${
  isCeo
    ? `- Your assistant text each turn is what ציון sees on Telegram (plain human Hebrew). You are **נועה**.
- You are the advisor and router. You do NOT execute specialist work (mail, PC, server, code, QA, design, DevOps).
- Load ${path.join(ROOT, "_company", "DELEGATION_POLICY.md")}.
- House / mail / invoices / news → emet_delegate 33-household-ops (Cursor Cloud)
- Personal PC → emet_delegate 34-pc-ops (founder PC worker — runs when Windows is on)
- ChemiCloud analysis → emet_delegate 35-server-ops (Cursor Cloud)
- Product / app / «תבנו» → emet_delegate 32-delivery-lead (קשת). Planning + Linear only until PIN + productWorkEnabled.
- Product engineers (ענבר, יונה, קרן, רז, דפנה…) only AFTER productWorkEnabled. Never skip Keshet.
- Never claim another agent finished unless emet_delegate returned job id + artifact/PR. Never mark done without their file.
- Default emet_delegate BACKGROUND. wait=true only if you need the result this turn.
- When a board task is finished: **emet_complete_task** ONLY after specialist artifact verified.
- Board snapshot: **emet_task_board**. Mid-task ping: emet_telegram_update. Status: emet_company_status.
- Founder channel ledger (git): ${path.join(ROOT, "ops", "founder-channel", "ledger.jsonl")} — every Telegram turn + specialist background updates. Read before status/delegate; never reopen a closed phase if the ledger already shows the deliverable.`
    : `- You were asked by נועה (CEO). Do the work for real. Reply with concrete results and paths.
- You may emet_delegate another specialist if needed. Do not message the founder yourself.`
}

Reply with one short Hebrew ready line, then wait.
`.trim();
}

/** Pass founder Telegram text straight into Noa's Cursor chat. */
export function wrapFounderTelegramTurn(text, _recentTail = "", media = null) {
  const safeAttachments = (media?.attachments || []).filter(
    (a) => a && a.type !== "voice" && a.type !== "audio"
  );
  const attachmentLines = safeAttachments
    .map((a) => `${a.type}: ${a.path}${a.name ? ` (${a.name})` : ""}`)
    .join("\n");

  let body = String(text || "").trim();
  body = body.replace(/^\[הקלטה קולית — תמלול\]:\s*/i, "").trim() || body;

  if (media?.reply?.excerpt) {
    body = `(בהמשך להודעה: «${media.reply.excerpt.slice(0, 200)}»)\n\n${body}`;
  }
  if (attachmentLines) {
    body += `\n\n[קבצים מצורפים — קרא בכלים, אל תפתח media player]\n${attachmentLines}`;
  }
  if (!isProductWorkEnabled()) {
    body = `[STANDBY — product company is ARMED (Keshet) but productWorkEnabled is false.
No product PRs. No emet_cloud_work. No engineers (ענבר/יונה/קרן/רז/דפנה) until he says «תבנו» + PIN.
You are on Cursor Cloud (or local fallback). Ruth (33) and Tamir (35) are Cloud agents too.
Nadav (34-pc-ops) is queued to the founder PC worker — never run him on ChemiCloud.
To delegate from Cloud, use lines: DELEGATE: agentId | task
  e.g. DELEGATE: 33-household-ops | check mail
  e.g. DELEGATE: 34-pc-ops | disk status
  e.g. DELEGATE: 35-server-ops | server RAM
  e.g. DELEGATE: 32-delivery-lead | plan this bet (no code)
If he asked to BUILD an app/product: Keep/Defer/Kill, then DELEGATE Keshet. Do not emit ACTIVATE_PRODUCT unless Keep + PIN window is open.
You MUST NOT search Gmail, SSH, or inspect the PC yourself — delegate.
Mutating tools (send mail, product Cloud, complete_task) require PIN. If locked, ask for PIN — never guess.
If missing token, name the exact .env / Cloud secret key — never ask to paste secrets in Telegram.]

${body}`;
  }
  return `[תשובה בטלגרם — חובה]
עברית ברורה, מקצועית, נוחה לנייד.
פתחי בתשובה עצמה. אחר כך משפט אחד מה הלאה.
פסקאות קצרות, שורה ריקה ביניהן. שניים+ פריטים = נקודות •.
בלי אנגלית טכנית, בלי שמות קבצים/כלים/DELEGATE בטקסט שהוא רואה.
שורות DELEGATE: רק אחרי התשובה בעברית, אם צריך לנתב.
שאלה אחת לכל היותר. בלי JSON.

${body}`;
}

/**
 * One-shot dashboard / intake path (not Telegram chat).
 */
export function buildCursorPrompt({ agentId, founderText, artifactDir, messageId }) {
  const base = path.join(ROOT, "agents", agentId);
  const system = read(path.join(base, "SYSTEM_PROMPT.md"));
  const tools = read(path.join(base, "TOOLS.md"));
  const access = read(path.join(base, "ACCESS.md"));
  const personality = read(path.join(base, "PERSONALITY.md"));
  const motto = read(path.join(ROOT, "_shared", "MOTTO_PREAMBLE.md"));
  const founder = read(path.join(ROOT, "_company", "FOUNDER.md"));
  const name = readAgentName(agentId);

  return `
You are **${name}** (\`${agentId}\`) in AZTODEV.
Work in this workspace with full Cursor tools. Create real files.

=== CONTEXT ===
${motto}
${founder.slice(0, 1800)}

=== ROLE ===
${system.slice(0, 4000)}
${personality.slice(0, 1200)}
${tools.slice(0, 1000)}
${access.slice(0, 800)}

=== REQUEST ===
${founderText}

Save summary for founder to: ${path.join(artifactDir, "RESULT.md")}
Artifacts under: ${artifactDir}
Message id: ${messageId}
`.trim();
}
