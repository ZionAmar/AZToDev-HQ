/**
 * Publish KidNest audit board to Linear via @linear/sdk (needs LINEAR_API_KEY).
 * Usage: node runtime/scripts/kidnest-linear-publish.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = join(ROOT, "ops/intake/kidnest-audit-board.json");
const MANIFEST_PATH = join(ROOT, "ops/linear-issues.json");
const SETUP_PATH = join(ROOT, "ops/linear-setup.md");

const LABELS = ["build", "plan", "blocked", "discover", "harden"];

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
  if (t.status === "in_progress") return "build";
  if (t.status === "blocked") return "blocked";
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
  try {
    const projects = await client.projects({ filter: { name: { eq: name } } });
    if (projects.nodes[0]) return projects.nodes[0];
    const result = await client.createProject({
      name,
      teamIds: [teamId],
    });
    return result.project ? await result.project : null;
  } catch {
    return null;
  }
}

async function ensureLabels(teamId) {
  for (const name of LABELS) {
    try {
      const existing = await client.issueLabels({
        filter: { name: { eq: name } },
      });
      if (!existing.nodes[0]) {
        await client.createIssueLabel({ name, teamId });
      }
    } catch {
      /* label exists workspace-wide */
    }
  }
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

  const created = [];

  for (const task of board.tasks) {
    const labelName = labelForTask(task);
    const labels = await client.issueLabels({
      filter: { name: { eq: labelName } },
    });
    const labelIds = labels.nodes[0] ? [labels.nodes[0].id] : [];

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

    const stateId = task.status === "in_progress" ? started?.id : backlog?.id;

    const result = await client.createIssue({
      teamId: team.id,
      projectId: project?.id,
      title: `${task.id}: ${task.title}`,
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
      });
    }
  }

  const org = await client.organization;
  const manifest = {
    publishedAt: new Date().toISOString(),
    source: "ops/intake/kidnest-audit-board.json",
    initiative: board.initiative,
    projectName: board.project,
    workspaceUrl: `https://linear.app/${org.urlKey}`,
    teamName: team.name,
    teamId: team.id,
    issueCount: created.length,
    issues: created,
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");

  const block = [
    "",
    "## KidNest audit publish",
    `- **At:** ${manifest.publishedAt}`,
    `- **Workspace:** ${manifest.workspaceUrl}`,
    `- **Team:** ${team.name}`,
    `- **Project:** ${board.project}`,
    `- **Issues:** ${created.length}/25`,
    "",
    "### Issue URLs",
    ...created.map((i) => `- [${i.identifier}](${i.url}) — ${i.title}`),
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
      firstThreeUrls: created.slice(0, 3).map((i) => i.url),
      manifestPath: "ops/linear-issues.json",
    })
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }));
  process.exit(1);
});
