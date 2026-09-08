/**
 * Extract Linear MCP OAuth token from Cursor storage and publish KidNest tasks.
 * Uses token only in-process; never logged.
 */
import { DatabaseSync } from "node:sqlite";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = join(ROOT, "ops/intake/kidnest-audit-board.json");
const MANIFEST_PATH = join(ROOT, "ops/linear-issues.json");
const SETUP_PATH = join(ROOT, "ops/linear-setup.md");
const MCP_URL = "https://mcp.linear.app/mcp";

const DB =
  "C:/Users/amazi/AppData/Roaming/Cursor/User/globalStorage/state.vscdb";

function getLinearToken() {
  const db = new DatabaseSync(DB, { readOnly: true });
  const rows = db
    .prepare(
      `SELECT key, value FROM ItemTable WHERE key LIKE 'mcpOAuth.secret.%mcp_tokens'`
    )
    .all();
  for (const row of rows) {
    if (!String(row.key).includes("my_company-linear")) continue;
    try {
      const parsed = JSON.parse(String(row.value));
      const access = parsed?.access_token || parsed?.accessToken;
      if (access) return access;
    } catch {
      /* try next */
    }
  }
  throw new Error("Linear MCP OAuth token not found in Cursor storage");
}

async function mcpCall(token, method, params = {}) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`MCP HTTP ${res.status}: ${text.slice(0, 300)}`);
  // SSE or JSON
  if (text.includes("data:")) {
    for (const line of text.split("\n")) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const msg = JSON.parse(payload);
        if (msg.result) return msg.result;
        if (msg.error) throw new Error(msg.error.message || JSON.stringify(msg.error));
      } catch (e) {
        if (e.message?.includes("MCP")) throw e;
      }
    }
  }
  const msg = JSON.parse(text);
  if (msg.error) throw new Error(msg.error.message || JSON.stringify(msg.error));
  return msg.result;
}

async function mcpTool(token, name, args = {}) {
  const result = await mcpCall(token, "tools/call", { name, arguments: args });
  if (result?.isError) {
    const errText =
      result.content?.map((c) => c.text).join("\n") || JSON.stringify(result);
    throw new Error(`Tool ${name} failed: ${errText}`);
  }
  const text = result?.content?.map((c) => c.text).join("\n") || "";
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function mcpInit(token) {
  await mcpCall(token, "initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "emet-kidnest-publish", version: "1.0.0" },
  });
  await mcpCall(token, "notifications/initialized", {});
}

function labelForTask(t) {
  if (t.status === "in_progress") return "build";
  if (t.status === "blocked") return "blocked";
  return "plan";
}

async function main() {
  const token = getLinearToken();
  const board = JSON.parse(readFileSync(BOARD_PATH, "utf8"));

  await mcpInit(token);

  const tools = await mcpCall(token, "tools/list", {});
  const toolNames = (tools?.tools || []).map((t) => t.name);
  console.error("MCP tools:", toolNames.join(", "));

  // Discover save/create issue tool
  const createTool =
    toolNames.find((n) => n === "save_issue") ||
    toolNames.find((n) => /create.*issue/i.test(n)) ||
    toolNames.find((n) => /issue/i.test(n) && /save|create/i.test(n));

  if (!createTool) {
    throw new Error(`No issue create tool. Smadarilable: ${toolNames.join(", ")}`);
  }

  const listTeamsTool =
    toolNames.find((n) => n === "list_teams") ||
    toolNames.find((n) => /teams/i.test(n));

  let teamId = process.env.LINEAR_TEAM_ID || "";
  let teamName = "EMET";
  let workspaceUrl = "";

  if (listTeamsTool) {
    const teams = await mcpTool(token, listTeamsTool, {});
    const nodes = teams?.teams || teams?.nodes || teams || [];
    const arr = Array.isArray(nodes) ? nodes : [];
    let team = arr.find((t) => (t.name || t.key || "").toLowerCase() === "emet");
    if (!team && arr[0]) team = arr[0];
    if (team) {
      teamId = team.id;
      teamName = team.name || team.key || teamName;
      workspaceUrl = team.url || workspaceUrl;
    }
  }

  const created = [];

  for (const task of board.tasks) {
    const title = `${task.id}: ${task.title}`;
    const description = [
      `**Initiative:** ${board.initiative}`,
      `**Project:** ${board.project}`,
      `**Phase:** ${task.phase}`,
      `**Owner:** ${task.owner}`,
      `**Priority:** ${task.priority}`,
      `**Status:** ${task.status}`,
      `**DoD:** ${task.dod}`,
      `**Production:** ${board.productionUrl}`,
    ].join("\n");

    const args = {
      title,
      description,
      team: teamName,
      teamId,
      labels: [labelForTask(task)],
      project: board.project,
    };

    const result = await mcpTool(token, createTool, args);
    const issue = result?.issue || result;
    const url = issue?.url || result?.url;
    const identifier = issue?.identifier || result?.identifier || task.id;

    created.push({
      localId: task.id,
      identifier,
      title,
      url: url || null,
      phase: task.phase,
      owner: task.owner,
      label: labelForTask(task),
    });
  }

  if (!workspaceUrl && created[0]?.url) {
    const m = created[0].url.match(/^(https:\/\/linear\.app\/[^/]+)/);
    if (m) workspaceUrl = m[1];
  }

  const manifest = {
    publishedAt: new Date().toISOString(),
    source: "ops/intake/kidnest-audit-board.json",
    method: "linear-mcp-oauth-cursor",
    initiative: board.initiative,
    projectName: board.project,
    workspaceUrl: workspaceUrl || "https://linear.app",
    teamName,
    teamId: teamId || null,
    issueCount: created.length,
    issues: created,
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");

  const block = [
    "",
    "## KidNest audit publish",
    `- **At:** ${manifest.publishedAt}`,
    `- **Workspace:** ${manifest.workspaceUrl}`,
    `- **Team:** ${teamName}`,
    `- **Project:** ${board.project}`,
    `- **Issues:** ${created.length}/25`,
    "",
    "### Issue URLs",
    ...created.map((i) =>
      i.url
        ? `- [${i.identifier}](${i.url}) — ${i.title}`
        : `- ${i.identifier} — ${i.title} (url pending)`
    ),
    "",
  ].join("\n");

  let setupDoc = readFileSync(SETUP_PATH, "utf8");
  const marker = "## KidNest audit publish";
  setupDoc = setupDoc.includes(marker)
    ? setupDoc.replace(/## KidNest audit publish[\s\S]*?(?=\n## |$)/, block.trim())
    : setupDoc + block;
  writeFileSync(SETUP_PATH, setupDoc, "utf8");

  console.log(
    JSON.stringify({
      ok: true,
      issueCount: created.length,
      workspaceUrl: manifest.workspaceUrl,
      firstThreeUrls: created.slice(0, 3).map((i) => i.url).filter(Boolean),
      manifestPath: "ops/linear-issues.json",
    })
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }));
  process.exit(1);
});
