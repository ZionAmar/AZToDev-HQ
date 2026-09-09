/**
 * Publish KidNest GitHub upload board to Linear (idempotent — skips tasks with linearId).
 * Usage: node runtime/scripts/kidnest-github-upload-linear-publish.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = join(ROOT, "ops/intake/kidnest-github-upload-board.json");

const LABELS = ["build", "plan", "blocked"];

function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const m = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* optional */
  }
}
loadEnv();

const apiKey = (process.env.LINEAR_API_KEY || "").trim();
if (!apiKey) {
  console.error(JSON.stringify({ ok: false, error: "LINEAR_API_KEY missing" }));
  process.exit(1);
}

const board = JSON.parse(readFileSync(BOARD_PATH, "utf8"));
const client = new LinearClient({ apiKey });

function labelForTask(t) {
  if (t.status === "ready" || t.status === "in_progress") return "build";
  if (t.status === "blocked") return "blocked";
  return "plan";
}

async function ensureTeam() {
  const teamId = (process.env.LINEAR_TEAM_ID || "").trim();
  if (teamId) return client.team(teamId);
  const teams = await client.teams();
  return teams.nodes.find((t) => t.name.toLowerCase() === "emet") || teams.nodes[0];
}

async function ensureProject(teamId, name) {
  const projects = await client.projects({ filter: { name: { eq: name } } });
  if (projects.nodes[0]) return projects.nodes[0];
  const result = await client.createProject({ name, teamIds: [teamId] });
  return result.project ? await result.project : null;
}

async function ensureLabels(teamId) {
  for (const name of LABELS) {
    const existing = await client.issueLabels({ filter: { name: { eq: name } } });
    if (!existing.nodes[0]) {
      await client.createIssueLabel({ name, teamId });
    }
  }
}

async function main() {
  const team = await ensureTeam();
  await ensureLabels(team.id);
  const project = await ensureProject(team.id, board.project);

  const workflowStates = await team.states();
  const done = workflowStates.nodes.find((s) => s.type === "completed");
  const started =
    workflowStates.nodes.find((s) => s.type === "started") ||
    workflowStates.nodes.find((s) => s.type === "unstarted");
  const backlog = workflowStates.nodes.find((s) => s.type === "backlog");

  const created = [];
  const skipped = [];

  for (const task of board.tasks) {
    if (task.linearId && task.linearUrl) {
      skipped.push({ localId: task.id, linearId: task.linearId, reason: "already set" });
      continue;
    }

    const labelName = labelForTask(task);
    const labels = await client.issueLabels({ filter: { name: { eq: labelName } } });
    const labelIds = labels.nodes[0] ? [labels.nodes[0].id] : [];

    const description = [
      `**Initiative:** ${board.initiative}`,
      `**Phase:** ${task.phase}`,
      `**Owner:** ${task.owner}`,
      `**Priority:** ${task.priority}`,
      `**Status:** ${task.status}`,
      `**DoD:** ${task.dod}`,
      task.artifact ? `**Artifact:** ${task.artifact}` : null,
      board.targetRepo?.url ? `**Target repo:** ${board.targetRepo.url}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    let stateId = backlog?.id;
    if (task.status === "done") stateId = done?.id;
    else if (task.status === "ready" || task.status === "in_progress") stateId = started?.id;

    const result = await client.createIssue({
      teamId: team.id,
      projectId: project?.id,
      title: `${task.id}: ${task.titleHe || task.title}`,
      description,
      stateId,
      labelIds: labelIds.length ? labelIds : undefined,
    });

    const issue = await result.issue;
    if (issue) {
      task.linearId = issue.identifier;
      task.linearUrl = issue.url;
      created.push({
        localId: task.id,
        identifier: issue.identifier,
        url: issue.url,
      });
    }
  }

  board.linearProjectUrl = project?.url || board.linearProjectUrl;
  board.updatedAt = new Date().toISOString();
  writeFileSync(BOARD_PATH, JSON.stringify(board, null, 2) + "\n", "utf8");

  console.log(
    JSON.stringify({
      ok: true,
      created: created.length,
      skipped: skipped.length,
      projectUrl: board.linearProjectUrl,
      issues: created,
      skipped,
    })
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }));
  process.exit(1);
});
