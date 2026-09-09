/**
 * Idempotent Linear publish for ops/intake/*-board.json
 * Usage: node runtime/scripts/intake-board-linear-publish.mjs [boardPath]
 * Requires LINEAR_API_KEY (env or .env)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = process.argv[2]
  ? join(ROOT, process.argv[2])
  : join(ROOT, "ops/intake/kidnest-github-upload-board.json");

const LABELS = ["plan", "build", "blocked", "discover", "waiting-founder"];

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

let board = JSON.parse(readFileSync(BOARD_PATH, "utf8"));
const client = new LinearClient({ apiKey });

function labelForTask(t) {
  if (t.status === "blocked") return "blocked";
  if (t.status === "waiting_founder") return "waiting-founder";
  if (t.status === "in_progress") return "build";
  return "plan";
}

async function ensureTeam() {
  const teamId = (process.env.LINEAR_TEAM_ID || "").trim();
  if (teamId) return client.team(teamId);
  const teams = await client.teams();
  let team = teams.nodes.find((t) => t.name.toLowerCase() === "emet");
  if (!team) {
    const org = await client.organization;
    team = await client.createTeam({ name: "EMET", key: "EMET", organizationId: org.id });
  }
  return team;
}

async function ensureProject(teamId, name) {
  const projects = await client.projects({ filter: { name: { eq: name } } });
  if (projects.nodes[0]) return projects.nodes[0];
  const result = await client.createProject({ name, teamIds: [teamId] });
  return result.project ? await result.project : null;
}

async function ensureLabels(teamId) {
  for (const name of LABELS) {
    try {
      const existing = await client.issueLabels({ filter: { name: { eq: name } } });
      if (!existing.nodes[0]) await client.createIssueLabel({ name, teamId });
    } catch {
      /* exists workspace-wide */
    }
  }
}

async function findIssueByTitle(teamId, title) {
  const issues = await client.issues({
    filter: { team: { id: { eq: teamId } }, title: { eq: title } },
    first: 1,
  });
  return issues.nodes[0] || null;
}

async function main() {
  const team = await ensureTeam();
  await ensureLabels(team.id);
  const project = await ensureProject(team.id, board.project);

  const workflowStates = await team.states();
  const started =
    workflowStates.nodes.find((s) => s.type === "started") ||
    workflowStates.nodes.find((s) => s.type === "unstarted");
  const backlog = workflowStates.nodes.find((s) => s.type === "backlog");
  const completed = workflowStates.nodes.find((s) => s.type === "completed");

  const created = [];
  let boardChanged = false;

  for (const task of board.tasks) {
    const issueTitle = `${task.id}: ${task.titleHe || task.title}`;
    const labelName = labelForTask(task);
    const labels = await client.issueLabels({ filter: { name: { eq: labelName } } });
    const labelIds = labels.nodes[0] ? [labels.nodes[0].id] : [];

    const description = [
      `**Initiative:** ${board.initiative}`,
      `**Project:** ${board.project}`,
      `**Phase:** ${task.phase}`,
      `**Owner:** ${task.owner}`,
      `**Priority:** ${task.priority}`,
      `**Status:** ${task.status} (${task.statusHe || ""})`,
      `**DoD:** ${task.dod}`,
      task.pinRequired ? `**PIN required:** yes` : null,
      task.blockedReason ? `**Blocked:** ${task.blockedReason}` : null,
      task.artifact ? `**Artifact:** ${task.artifact}` : null,
      board.projectPath ? `**PC path:** ${board.projectPath}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    let stateId = backlog?.id;
    if (task.status === "done") stateId = completed?.id;
    else if (task.status === "in_progress") stateId = started?.id;

    let issue = null;
    if (task.linearIssue) {
      try {
        issue = await client.issue(task.linearIssue);
      } catch {
        issue = null;
      }
    }
    if (!issue) {
      issue = await findIssueByTitle(team.id, issueTitle);
    }

    if (issue) {
      await client.updateIssue(issue.id, {
        title: issueTitle,
        description,
        projectId: project?.id,
        stateId,
        labelIds: labelIds.length ? labelIds : undefined,
      });
      created.push({
        localId: task.id,
        identifier: issue.identifier,
        title: issueTitle,
        url: issue.url,
        action: "updated",
      });
      if (task.linearIssue !== issue.identifier || task.linearUrl !== issue.url) {
        task.linearIssue = issue.identifier;
        task.linearUrl = issue.url;
        boardChanged = true;
      }
      continue;
    }

    const result = await client.createIssue({
      teamId: team.id,
      projectId: project?.id,
      title: issueTitle,
      description,
      stateId,
      labelIds: labelIds.length ? labelIds : undefined,
    });
    issue = await result.issue;
    if (issue) {
      task.linearIssue = issue.identifier;
      task.linearUrl = issue.url;
      boardChanged = true;
      created.push({
        localId: task.id,
        identifier: issue.identifier,
        title: issueTitle,
        url: issue.url,
        action: "created",
      });
    }
  }

  if (project?.url && board.linearProjectUrl !== project.url) {
    board.linearProjectUrl = project.url;
    boardChanged = true;
  }
  board.updatedAt = new Date().toISOString();
  if (boardChanged) {
    writeFileSync(BOARD_PATH, JSON.stringify(board, null, 2) + "\n", "utf8");
  }

  const org = await client.organization;
  console.log(
    JSON.stringify({
      ok: true,
      boardPath: BOARD_PATH.replace(ROOT + "/", ""),
      project: board.project,
      projectUrl: board.linearProjectUrl || project?.url,
      workspaceUrl: `https://linear.app/${org.urlKey}`,
      issueCount: created.length,
      issues: created,
    })
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }));
  process.exit(1);
});
