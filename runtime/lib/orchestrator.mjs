import fs from "fs";
import path from "path";
import { ROOT, OPS, nowIso, journal } from "./paths.mjs";
import { llmChat, llmConfigured } from "./llm.mjs";
import {
  readSharedMemory,
  appendSharedMemory,
  upsertBoardItem,
  ensureMemory,
} from "./shared-memory.mjs";

function readAgentPrompt(agentId) {
  const p = path.join(ROOT, "agents", agentId, "SYSTEM_PROMPT.md");
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : `You are agent ${agentId}.`;
}

function writeBus({ from, to, type, body, initiativeId }) {
  const day = nowIso().slice(0, 10);
  const dir = path.join(OPS, "bus", day);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(
    dir,
    `${Date.now()}_${from}_to_${to || "broadcast"}.md`
  );
  const md = `# BUS — from:${from} to:${to || "broadcast"} — ${nowIso()}
## Re: initiative ${initiativeId || "general"}
## Type: ${type}
## Body
${body}
`;
  fs.writeFileSync(file, md, "utf8");
  return file;
}

function writeMeeting({ type, initiativeId, transcript, decisions }) {
  const dir = path.join(OPS, "meetings");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(
    dir,
    `${nowIso().slice(0, 10)}_${type}_${initiativeId || "general"}.md`
  );
  const md = `# Meeting — ${type} — ${initiativeId || "general"} — ${nowIso()}

## Goal of meeting
Parity+ live orchestration (${type})

## Attendees
${transcript.map((t) => `- ${t.agentId}`).join("\n")}

## Discussion notes (by speaker order)
${transcript
  .map((t) => `### ${t.agentId}\n${t.text}\n`)
  .join("\n")}

## Decisions (explicit)
${decisions || "- (see transcript)"}

## Action items
- See board.json / Linear sync
`;
  fs.writeFileSync(file, md, "utf8");
  return file;
}

/**
 * Run a multi-agent round like Tom Even's company meetings — locally.
 * agendaAgents: [{ id, brief }]
 */
export async function runMeeting({
  type = "daily",
  initiativeId = null,
  topic,
  agendaAgents,
}) {
  ensureMemory();
  const memory = readSharedMemory().slice(-6000);
  const transcript = [];
  let context = `Meeting type: ${type}\nTopic: ${topic}\nInitiative: ${initiativeId || "n/a"}\n`;

  if (!llmConfigured()) {
    const stub =
      "LLM key missing (ANTHROPIC_API_KEY or OPENAI_API_KEY). Meeting queued as skeleton only — Parity+ brain offline.";
    journal("meeting_stub", { type, reason: "no_llm" });
    for (const a of agendaAgents) {
      const text = `[STUB] ${a.id}: awaiting LLM key. Brief was: ${a.brief}`;
      transcript.push({ agentId: a.id, text });
      writeBus({
        from: a.id,
        to: "broadcast",
        type: "fyí",
        body: text,
        initiativeId,
      });
    }
    const file = writeMeeting({
      type,
      initiativeId,
      transcript,
      decisions: stub,
    });
    appendSharedMemory("Meeting stub", `${type}: ${topic}\n${stub}`);
    return { ok: false, missingKey: true, file, transcript, decisions: stub };
  }

  for (const a of agendaAgents) {
    const system = readAgentPrompt(a.id).slice(0, 12000);
    const user = `You are in a live AZTODEV company meeting (${type}).
Shared memory (tail):
"""
${memory}
"""

Meeting so far:
"""
${context}
"""

Your specific brief: ${a.brief}

Respond in character. Output:
1) Your view (short)
2) Decisions you propose (bullets)
3) Action items you own (bullets, concrete)
4) Whether founder (ציון) must be asked (yes/no + ask)
Hebrew OK for founder-facing asks; keep technical terms clear.`;

    const out = await llmChat({ system, user, maxTokens: 1000 });
    const text = out.text || "(empty)";
    transcript.push({ agentId: a.id, text, provider: out.provider });
    context += `\n\n[${a.id}]:\n${text}\n`;
    writeBus({
      from: a.id,
      to: "broadcast",
      type: "decision",
      body: text,
      initiativeId,
    });
  }

  // Nura consolidates
  const consolidate = await llmChat({
    system: readAgentPrompt("00-ceo").slice(0, 8000),
    user: `Consolidate this AZTODEV ${type} meeting into:
- Decisions (bullets)
- Priority order (if idea flood)
- Board tasks to create (title | owner agent id | column: today|backlog|blocked|waiting_founder)
- founderPush: null
  OR a short Hebrew message (max 6 lines) ONLY if ציון must APPROVE|CHOOSE|EMERGENCY / waiting_founder / SEV1.
  Default is founderPush: null — do NOT spam him with routine intake/daily chatter.

Transcript:
${context}`,
    maxTokens: 1200,
  });

  const decisions = consolidate.text || "";
  const file = writeMeeting({ type, initiativeId, transcript, decisions });
  appendSharedMemory(`Meeting ${type}`, `${topic}\n\n${decisions.slice(0, 2000)}`);

  // naive task extraction lines with |
  for (const line of decisions.split("\n")) {
    if (!line.includes("|")) continue;
    const parts = line.replace(/^\s*[-*]\s*/, "").split("|").map((s) => s.trim());
    if (parts.length >= 2) {
      const [title, owner, column] = parts;
      if (title && title.length < 120) {
        upsertBoardItem(column || "today", {
          title,
          owner: owner || "07-product-manager",
          source: type,
        });
      }
    }
  }

  journal("meeting_done", { type, file, providers: transcript.map((t) => t.provider) });
  return {
    ok: true,
    file,
    transcript,
    decisions,
    telegramSummary: decisions,
  };
}

export async function runDailyMeeting() {
  return runMeeting({
    type: "daily",
    topic: "Daily standup + priority guard (Parity+)",
    agendaAgents: [
      {
        id: "32-delivery-lead",
        brief: "Facilitate: WIP, blockers >24h, what must NOT start today.",
      },
      {
        id: "07-product-manager",
        brief: "Propose today's max 3 company focuses; park overflowing ideas in backlog.",
      },
      {
        id: "11-tech-lead",
        brief: "Technical sequencing; forbid stage skipping into build without plan/architect.",
      },
      {
        id: "00-ceo",
        brief: "Kill thrash; decide what waits for founder; prepare end summary seed.",
      },
    ],
  });
}

export async function runIntakeMeeting(ideaText, initiativeId) {
  return runMeeting({
    type: "intake",
    initiativeId,
    topic: ideaText.slice(0, 500),
    agendaAgents: [
      { id: "00-ceo", brief: `Classify Keep/Defer/Kill/Explore for: ${ideaText}` },
      { id: "04-cpo", brief: "Problem, user, wedge, non-goals draft." },
      { id: "03-cto", brief: "Technical risk / trust risks coarse." },
      { id: "07-product-manager", brief: "Next stage + tickets seed; never jump to coding." },
    ],
  });
}
