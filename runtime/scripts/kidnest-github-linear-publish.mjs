/**
 * Publish KidNest GitHub migration board to Linear.
 * Usage: node runtime/scripts/kidnest-github-linear-publish.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = join(ROOT, "ops/intake/kidnest-github-board.json");
const MANIFEST_PATH = join(ROOT, "ops/linear-kidnest-github-issues.json");
const SETUP_PATH = join(ROOT, "ops/linear-setup.md");

const LABELS = ["plan", "build", "blocked", "waiting-founder"];

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
  if (t.status === "done") return "build";
  if (t.status === "blocked") return "blocked";
  if (t.pinRequired) return "waiting-founder";
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
      if (!existing.nodes[0]) {
        await client.createIssueLabel({ name, teamId });
      }
    } catch {
      /* exists workspace-wide */
    }
  }
}

async function cancelHoldingIssue(teamId) {
  const holdingId = board.replacesHoldingIssue;
  if (!holdingId) return null;
  try {
    const issue = await client.issue(holdingId);
    const states = await client.workflowStates({
      filter: { team: { id: { eq: teamId } } },
    });
    const canceled = states.nodes.find((s) => s.type === "canceled");
    if (canceled) {
      await client.updateIssue(issue.id, {
        stateId: canceled.id,
        description: `${issue.description || ""}\n\n---\nReplaced by concrete bet: ${board.project} (${new Date().toISOString()})`.trim(),
      });
    }
    return { identifier: issue.identifier, url: issue.url, canceled: !!canceled };
  } catch (e) {
    return { error: e.message };
  }
}

async function main() {
  const team = await ensureTeam();
  await ensureLabels(team.id);
  const project = await ensureProject(team.id, board.project);

  const workflowStates = await team.states();
  const completed = workflowStates.nodes.find((s) => s.type === "completed");
  const started = workflowStates.nodes.find((s) => s.type === "started");
  const backlog = workflowStates.nodes.find((s) => s.type === "backlog");

  const created = [];

  for (const task of board.tasks) {
    const labelName = labelForTask(task);
    const labels = await client.issueLabels({ filter: { name: { eq: labelName } } });
    const labelIds = labels.nodes[0] ? [labels.nodes[0].id] : [];

    const description = [
      `**Initiative:** ${board.initiative}`,
      `**Project:** ${board.project}`,
      `**Phase:** ${task.phase}`,
      `**Owner:** ${task.owner}`,
      `**Priority:** ${task.priority}`,
      `**Status:** ${task.status}`,
      `**DoD:** ${task.dod}`,
      task.pinRequired ? `**PIN required:** yes (${task.founderGate || "mutation"})` : null,
      task.artifact ? `**Artifact:** ${task.artifact}` : null,
      `**Target repo:** ${board.targetRepo}`,
      `**Production:** ${board.productionUrl}`,
    ]
      .filter(Boolean)
      .join("\n");

    let stateId = backlog?.id;
    if (task.status === "done") stateId = completed?.id;
    else if (task.status === "in_progress") stateId = started?.id;

    const result = await client.createIssue({
      teamId: team.id,
      projectId: project?.id,
      title: `${task.id}: ${task.titleHe}`,
      description,
      stateId,
      labelIds: labelIds.length ? labelIds : undefined,
    });

    const issue = await result.issue;
    if (issue) {
      created.push({
        localId: task.id,
        identifier: issue.identifier,
        title: issue.title,
        url: issue.url,
        phase: task.phase,
        owner: task.owner,
        label: labelName,
        status: task.status,
      });
    }
  }

  const holdingResult = await cancelHoldingIssue(team.id);

  const org = await client.organization;
  const manifest = {
    publishedAt: new Date().toISOString(),
    source: "ops/intake/kidnest-github-board.json",
    initiative: board.initiative,
    projectName: board.project,
    projectUrl: project?.url,
    workspaceUrl: `https://linear.app/${org.urlKey}`,
    teamName: team.name,
    teamId: team.id,
    issueCount: created.length,
    holdingIssueCanceled: holdingResult,
    issues: created,
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");

  const block = [
    "",
    "## KidNest GitHub migration publish",
    `- **At:** ${manifest.publishedAt}`,
    `- **Workspace:** ${manifest.workspaceUrl}`,
    `- **Team:** ${team.name}`,
    `- **Project:** ${board.project}`,
    `- **Issues:** ${created.length}/4`,
    holdingResult?.identifier
      ? `- **EMET-66 canceled:** [${holdingResult.identifier}](${holdingResult.url})`
      : null,
    "",
    "### Issue URLs",
    ...created.map((i) => `- [${i.identifier}](${i.url}) — ${i.title}`),
    "",
  ]
    .filter(Boolean)
    .join("\n");

  let setupDoc = readFileSync(SETUP_PATH, "utf8");
  const marker = "## KidNest GitHub migration publish";
  setupDoc = setupDoc.includes(marker)
    ? setupDoc.replace(/## KidNest GitHub migration publish[\s\S]*?(?=\n## |$)/, block.trim())
    : setupDoc + block;
  writeFileSync(SETUP_PATH, setupDoc, "utf8");

  console.log(
    JSON.stringify({
      ok: true,
      issueCount: created.length,
      projectUrl: project?.url,
      workspaceUrl: manifest.workspaceUrl,
      holdingIssueCanceled: holdingResult,
      issues: created.map((i) => ({ id: i.localId, url: i.url })),
      manifestPath: "ops/linear-kidnest-github-issues.json",
    })
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }));
  process.exit(1);
});
