import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Agent } from "@cursor/sdk";
import { cursorLocalOptions, cursorModelId } from "../lib/cursor-local.mjs";

const ROOT = join(import.meta.dirname, "../..");
function loadEnv() {
  for (const line of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const prompt = `Linear MCP is connected. Use list_teams Linear MCP tool. Return JSON: { toolWorked: true, teams: [...] } or { toolWorked: false, error: "..." }`;

const result = await Agent.prompt(prompt, {
  apiKey: process.env.CURSOR_API_KEY,
  model: { id: cursorModelId() },
  local: cursorLocalOptions(),
});

console.log(JSON.stringify(result, null, 2));
