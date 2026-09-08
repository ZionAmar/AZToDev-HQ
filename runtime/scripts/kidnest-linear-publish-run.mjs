/**
 * Publish KidNest audit tasks to Linear via Cursor SDK + Linear MCP (OAuth).
 * Run: node runtime/scripts/kidnest-linear-publish-run.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Agent } from "@cursor/sdk";
import { cursorLocalOptions, cursorModelId } from "../lib/cursor-local.mjs";

const ROOT = join(import.meta.dirname, "../..");
const BOARD = JSON.parse(
  readFileSync(join(ROOT, "ops/intake/kidnest-audit-board.json"), "utf8")
);

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
  console.error("Missing CURSOR_API_KEY");
  process.exit(1);
}

const taskList = BOARD.tasks
  .map(
    (t) =>
      `- ${t.id}: ${t.title} | owner=${t.owner} | phase=${t.phase} | status=${t.status} | priority=${t.priority} | DoD=${t.dod}`
  )
  .join("\n");

const prompt = `You are Amit (PM) for EMET. Linear MCP is CONNECTED (OAuth green).

Use Linear MCP tools NOW to publish KidNest audit tasks.

PROJECT: KidNest / NesTube
Initiative: IDEA-2026-09-07-kidnest-audit
Production: https://nestube.aztodev.com

Steps:
1. List teams — create team EMET if missing (key EMET)
2. Create or find project "KidNest / NesTube"
3. Create all 25 issues. Title format: "KN-001: ..." (include KN id prefix)
4. Labels per task:
   - status in_progress → label build
   - status todo + priority P0/P1 → label plan
   - status blocked → label blocked
   - default todo → label plan
5. Description: owner, phase, priority, DoD from source

TASKS:
${taskList}

After creating ALL 25 issues:
1. Write JSON to ops/linear-issues.json with structure:
   { publishedAt, workspaceUrl, teamName, teamId, projectName, issueCount, issues: [{localId, identifier, title, url, phase, owner}] }
2. Append issue URLs section to ops/linear-setup.md under "## KidNest audit publish"

Return final JSON summary only: { issueCount, workspaceUrl, firstThreeUrls: [url1,url2,url3], manifestPath: "ops/linear-issues.json" }

Use MCP tools. Create every issue. No skipping.`;

console.log("Publishing KidNest audit to Linear via Cursor SDK + MCP...");
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
