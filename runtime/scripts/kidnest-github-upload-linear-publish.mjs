/**
 * Publish KidNest GitHub upload board to Linear (EMET team).
 * Idempotent: renames legacy project names, skips issue creation when linearIssue is set.
 *
 * Usage: node runtime/scripts/kidnest-github-upload-linear-publish.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = join(ROOT, "ops/intake/kidnest-github-upload-board.json");
const MANIFEST_PATH = join(ROOT, "ops/linear-kidnest-github-upload-issues.json");
const SETUP_PATH = join(ROOT, "ops/linear-setup.md");

const LABELS = ["plan", "build", "blocked", "waiting-founder"];
const LEGACY_PROJECT_NAMES = [
  "KidNest — העלאה לגיטהאב",
  "KidNest — GitHub Migration",
  "KidNest / NesTube",
];

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
  if (t.requiresPin) return "waiting-founder";
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

async function findProject(name) {
  const projects = await client.projects({ filter: { name: { eq: name } } });
  return projects.nodes[0] || null;
}

async function ensureProject(teamId, name) {
  let project = await findProject(name);
  if (project) return project;

  for (const legacy of LEGACY_PROJECT_NAMES) {
    if (legacy === name) continue;
    const legacyProject = await findProject(legacy);
    if (legacyProject) {
      await client.updateProject(legacyProject.id, { name });
      return client.project(legacyProject.id);
    }
  }

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

async function resolveExistingIssue(task) {
  if (!task.linearIssue) return null;
  try {
    const issue = await client.issue(task.linearIssue);
    return {
      localId: task.id,
      identifier: issue.identifier,
      title: issue.title,
      url: issue.url,
      phase: task.phase,
      owner: task.owner,
      label: labelForTask(task),
      status: task.status,
      existing: true,
    };
  } catch {
    return null;
  }
}

async function createIssue(team, project, task, workflowStates) {
  const completed = workflowStates.nodes.find((s) => s.type === "completed");
  const started = workflowStates.nodes.find((s) => s.type === "started");
  const backlog = workflowStates.nodes.find((s) => s.type === "backlog");

  const labelName = labelForTask(task);
  const labels = await client.issueLabels({ filter: { name: { eq: labelName } } });
  const labelIds = labels.nodes[0] ? [labels.nodes[0].id] : [];

  const phaseMeta = board.phases.find((p) => p.id === task.phase);
  const description = [
    `**Initiative:** ${board.initiative}`,
    `**Project:** ${board.project}`,
    `**Phase:** ${task.phase}${phaseMeta ? ` — ${phaseMeta.nameHe}` : ""}`,
    `**Owner:** ${task.owner}`,
    `**Priority:** ${task.priority}`,
    `**Status:** ${task.status}`,
    `**DoD:** ${task.dod}`,
    task.requiresPin ? "**PIN required:** yes" : null,
    task.artifact ? `**Artifact:** ${task.artifact}` : null,
    board.productionUrl ? `**Production:** ${board.productionUrl}` : null,
    board.projectPath ? `**PC path:** ${board.projectPath}` : null,
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
  if (!issue) return null;
  return {
    localId: task.id,
    identifier: issue.identifier,
    title: issue.title,
    url: issue.url,
    phase: task.phase,
    owner: task.owner,
    label: labelName,
    status: task.status,
    existing: false,
  };
}

async function main() {
  const team = await ensureTeam();
  await ensureLabels(team.id);
  const project = await ensureProject(team.id, board.project);

  const workflowStates = await team.states();
  const synced = [];

  for (const task of board.tasks) {
    const existing = await resolveExistingIssue(task);
    if (existing) {
      synced.push(existing);
      continue;
    }
    const created = await createIssue(team, project, task, workflowStates);
    if (created) synced.push(created);
  }

  const org = await client.organization;
  const manifest = {
    publishedAt: new Date().toISOString(),
    source: "ops/intake/kidnest-github-upload-board.json",
    initiative: board.initiative,
    projectName: board.project,
    projectUrl: project?.url,
    workspaceUrl: `https://linear.app/${org.urlKey}`,
    teamName: team.name,
    teamId: team.id,
    issueCount: synced.length,
    issues: synced,
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");

  const block = [
    "",
    "## KidNest GitHub upload (KG) publish",
    `- **At:** ${manifest.publishedAt}`,
    `- **Workspace:** ${manifest.workspaceUrl}`,
    `- **Team:** ${team.name}`,
    `- **Project:** ${board.project}`,
    `- **Project URL:** ${project?.url}`,
    `- **Issues:** ${synced.length}/${board.tasks.length}`,
    "",
    "### Issue URLs",
    ...synced.map((i) => `- [${i.identifier}](${i.url}) — ${i.title}`),
    "",
  ].join("\n");

  let setupDoc = readFileSync(SETUP_PATH, "utf8");
  const marker = "## KidNest GitHub upload (KG) publish";
  setupDoc = setupDoc.includes(marker)
    ? setupDoc.replace(/## KidNest GitHub upload \(KG\) publish[\s\S]*?(?=\n## |$)/, block.trim())
    : setupDoc + block;
  writeFileSync(SETUP_PATH, setupDoc, "utf8");

  console.log(
    JSON.stringify({
      ok: true,
      issueCount: synced.length,
      projectName: board.project,
      projectUrl: project?.url,
      workspaceUrl: manifest.workspaceUrl,
      issues: synced.map((i) => ({ id: i.localId, url: i.url, existing: i.existing })),
      manifestPath: "ops/linear-kidnest-github-upload-issues.json",
    })
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }));
  process.exit(1);
});
