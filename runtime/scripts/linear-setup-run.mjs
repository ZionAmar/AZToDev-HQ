/**
 * One-shot: set up EMET Linear board via Cursor SDK + project MCP (OAuth).
 * Run from company root: node runtime/scripts/linear-setup-run.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Agent } from "@cursor/sdk";
import { cursorLocalOptions, cursorModelId } from "../lib/cursor-local.mjs";

const ROOT = join(import.meta.dirname, "../..");

function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* optional */
  }
}

loadEnv();

const apiKey = (process.env.CURSOR_API_KEY || "").trim();
if (!apiKey) {
  console.error("Missing CURSOR_API_KEY in .env");
  process.exit(1);
}

const prompt = `You are Amit (PM) for EMET. Linear OAuth is connected via Cursor MCP.

Use Linear MCP tools to set up the remote task board:

1. Team/project: EMET (create if missing, or use existing workspace team)
2. Create workspace labels (skip if already exist): intake, discover, shape, architect, plan, build, harden, stage, launch, learn, grow, blocked, waiting-founder, sev1, sev2
3. Seed 5 starter issues from bootstrap state:
   - Boot company OS (plan)
   - Ready intake for first IDEA (intake)
   - Keep WIP empty until founder drops an idea (plan)
   - Complete Intake — IDEA-2026-09-06-1788719375161 (intake, in progress)
   - Linear remote board — founder phone visibility (build, mark Done or In Progress)
4. Return JSON only with: workspaceUrl, teamName, teamId, projectName, labelsCreated, labelsSkipped, issuesCreated (array of {identifier, title, url, state})

Do the work with MCP tools. No API keys from user.`;

console.log("Starting Linear setup via Cursor SDK + MCP...");
const result = await Agent.prompt(prompt, {
  apiKey,
  model: { id: cursorModelId() },
  local: cursorLocalOptions(),
});

const text =
  typeof result?.result === "string"
    ? result.result
    : JSON.stringify(result?.result ?? result, null, 2);

console.log("--- RESULT ---");
console.log(text);
console.log("--- STATUS ---", result?.status ?? "unknown");
