/**
 * Publish KidNest GitHub migration board to Linear.
 * Creates project + issues, cancels EMET-66 holding issue.
 *
 * Usage: node runtime/scripts/kidnest-github-linear-publish.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = join(ROOT, "ops/intake/kidnest-github-board.json");
const MANIFEST_PATH = join(ROOT, "ops/linear-kidnest-github-issues.json");

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
    /* optional — Cloud injects LINEAR_API_KEY */
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

const STATUS_TO_LABEL = {
  blocked: "blocked",
  waiting_founder: "waiting-founder",
  in_progress: "build",
  todo: "plan",
};

async function ensureTeam() {
  const teamId = (process.env.LINEAR_TEAM_ID || "").trim();
  if (teamId) return client.team(teamId);
  const teams = await client.teams();
  return teams.nodes.find((t) => t.key === "EMET") || teams.nodes[0];
}

async function ensureProject(teamId, name) {
  const projects = await client.projects({ filter: { name: { eq: name } } });
  if (projects.nodes[0]) return projects.nodes[0];
  const result = await client.createProject({
    name,
    teamIds: [teamId],
    description: `KidNest → private GitHub. Parent: ${board.projectParent}. Venture: ${board.ventureArtifact}`,
  });
  return result.project ? await result.project : null;
}

async function labelId(name) {
  const labels = await client.issueLabels({ filter: { name: { eq: name } } });
  return labels.nodes[0]?.id;
}

async function cancelHoldingIssue(identifier) {
  try {
    const issue = await client.issue(identifier);
    const team = await issue.team;
    const states = await team.states();
    const canceled = states.nodes.find((s) => s.type === "canceled" || s.name === "Canceled");
    if (!canceled) return { ok: false, reason: "no_canceled_state" };
    await client.updateIssue(issue.id, {
      stateId: canceled.id,
      description: [
        issue.description || "",
        "",
        "---",
        `**Superseded:** ${new Date().toISOString().slice(0, 10)} — replaced by KidNest GitHub migration issues (KNG-01..04).`,
        `**Project:** ${board.project}`,
        `**Venture:** \`${board.ventureArtifact}\``,
      ].join("\n"),
    });
    return { ok: true, identifier, url: issue.url };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  const team = await ensureTeam();
  const project = await ensureProject(team.id, board.project);

  const workflowStates = await team.states();
  const backlog = workflowStates.nodes.find((s) => s.type === "backlog");
  const started = workflowStates.nodes.find((s) => s.type === "started");
  const unstarted = workflowStates.nodes.find((s) => s.type === "unstarted");

  const created = [];

  for (const task of board.tasks) {
    const labelName = task.label || STATUS_TO_LABEL[task.status] || "plan";
    const lid = await labelId(labelName);

    const description = [
      `**Initiative:** ${board.initiative}`,
      `**Phase:** ${task.phase}`,
      `**Owner:** ${task.owner} (${task.ownerHe})`,
      `**Priority:** ${task.priority}`,
      `**Status:** ${task.status}`,
      `**DoD:** ${task.dod}`,
      task.artifact ? `**Artifact:** \`${task.artifact}\`` : null,
      task.requiresPin ? `**Requires:** founder PIN + KNG-03 approved` : null,
      `**Local path:** ${board.localPath}`,
      `**Target repo:** ${board.targetRepo}`,
      `**Production:** ${board.productionUrl}`,
      `**Venture:** \`${board.ventureArtifact}\``,
    ]
      .filter(Boolean)
      .join("\n");

    let stateId = backlog?.id || unstarted?.id;
    if (task.status === "in_progress") stateId = started?.id || stateId;
    if (task.status === "waiting_founder" || task.status === "blocked") {
      stateId = started?.id || stateId;
    }

    const result = await client.createIssue({
      teamId: team.id,
      projectId: project?.id,
      title: `[${task.id} · ${task.ownerHe}] ${task.titleHe}`,
      description,
      stateId,
      labelIds: lid ? [lid] : undefined,
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
        ownerHe: task.ownerHe,
        label: labelName,
      });
    }
  }

  const canceled = await cancelHoldingIssue(board.replacesHoldingIssue);

  const org = await client.organization;
  const manifest = {
    publishedAt: new Date().toISOString(),
    source: "ops/intake/kidnest-github-board.json",
    initiative: board.initiative,
    projectName: board.project,
    projectUrl: project?.url,
    projectParent: board.projectParent,
    projectParentUrl: board.projectParentUrl,
    workspaceUrl: `https://linear.app/${org.urlKey}`,
    teamName: team.name,
    teamId: team.id,
    replacedHoldingIssue: board.replacesHoldingIssue,
    holdingCancelResult: canceled,
    issueCount: created.length,
    issues: created,
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");

  console.log(
    JSON.stringify(
      {
        ok: true,
        projectUrl: project?.url,
        issueCount: created.length,
        issues: created.map((i) => ({ id: i.identifier, url: i.url, title: i.title })),
        canceledHolding: canceled,
        manifestPath: "ops/linear-kidnest-github-issues.json",
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }));
  process.exit(1);
});
