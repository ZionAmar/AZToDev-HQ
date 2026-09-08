/**
 * Cancel old KidNest Linear issues + publish new focused Hebrew board.
 * Usage: node runtime/scripts/kidnest-linear-reset.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = join(ROOT, "ops/intake/kidnest-audit-board.json");
const OLD_MANIFEST = join(ROOT, "ops/linear-issues.json");
const MAP_PATH = join(ROOT, "ops/linear-task-map.json");

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
const oldManifest = JSON.parse(readFileSync(OLD_MANIFEST, "utf8"));
const client = new LinearClient({ apiKey });

function statusToStateName(status) {
  if (status === "done") return "Done";
  if (status === "in_progress") return "In Progress";
  if (status === "cancelled") return "Canceled";
  return "Todo";
}

async function ensureTeam() {
  const teamId = (process.env.LINEAR_TEAM_ID || "").trim();
  if (teamId) return client.team(teamId);
  const teams = await client.teams();
  return teams.nodes.find((t) => /emet/i.test(t.name)) || teams.nodes[0];
}

async function ensureProject(teamId, name) {
  const projects = await client.projects({ filter: { name: { eq: name } } });
  if (projects.nodes[0]) return projects.nodes[0];
  const result = await client.createProject({ name, teamIds: [teamId] });
  return result.project ? await result.project : null;
}

async function getStateId(team, status) {
  const states = await team.states();
  const want = statusToStateName(status);
  const st =
    states.nodes.find((s) => s.name.toLowerCase() === want.toLowerCase()) ||
    states.nodes.find((s) => s.type === "completed" && status === "done") ||
    states.nodes.find((s) => s.type === "started" && status === "in_progress") ||
    states.nodes.find((s) => s.type === "canceled" && status === "cancelled") ||
    states.nodes.find((s) => s.type === "backlog");
  return st?.id;
}

async function main() {
  const team = await ensureTeam();
  const canceledStateId = await getStateId(team, "cancelled");
  const project = await ensureProject(team.id, board.project);

  const cancelled = [];
  for (const item of oldManifest.issues || []) {
    try {
      const issues = await client.issues({
        filter: { id: { eq: undefined }, number: { eq: parseInt(item.identifier.split("-")[1], 10) } },
      });
      // Resolve by identifier
      const search = await client.issues({
        filter: { team: { id: { eq: team.id } }, title: { containsIgnoreCase: item.localId } },
      });
      const issue = search.nodes[0];
      if (issue && canceledStateId) {
        await client.updateIssue(issue.id, {
          stateId: canceledStateId,
          description: `${issue.description || ""}\n\n---\n**בוטל 2026-09-07** — הוחלף בלוח ביקורת פרודקshן (NS-01..NS-08).`.trim(),
        });
        cancelled.push(issue.identifier);
      }
    } catch (e) {
      /* continue */
    }
  }

  // Cancel by KN- prefix in title (fallback bulk)
  const knIssues = await client.issues({
    filter: { team: { id: { eq: team.id } }, title: { containsIgnoreCase: "KN-" } },
  });
  for (const issue of knIssues.nodes) {
    if (canceledStateId && !cancelled.includes(issue.identifier)) {
      await client.updateIssue(issue.id, {
        stateId: canceledStateId,
        description: `${issue.description || ""}\n\n---\n**בוטל 2026-09-07** — לא תואם בקשת המייסד (ביקורת פרודקshן + דוח).`.trim(),
      });
      cancelled.push(issue.identifier);
    }
  }

  const created = [];
  const map = { issues: {}, updatedAt: new Date().toISOString() };

  for (const task of board.tasks) {
    const title = `[${task.id}] ${task.titleHe}`;
    const description = [
      `**בקשת המייסד:** ${board.founderAsk}`,
      `**Production:** ${board.productionUrl}`,
      `**Owner:** ${task.owner}`,
      `**סטטוס:** ${task.statusHe || task.status}`,
      `**DoD:** ${task.dod}`,
      task.resultHe ? `\n**תוצאה:**\n${task.resultHe}` : "",
      task.artifact ? `\n**Artifact:** ${task.artifact}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const stateId = await getStateId(team, task.status);
    const result = await client.createIssue({
      teamId: team.id,
      projectId: project?.id,
      title,
      description,
      stateId,
    });
    const issue = await result.issue;
    if (issue) {
      created.push({ localId: task.id, identifier: issue.identifier, url: issue.url, status: task.status });
      map.issues[task.id] = issue.id;
    }
  }

  writeFileSync(MAP_PATH, JSON.stringify(map, null, 2), "utf8");

  const org = await client.organization;
  const manifest = {
    publishedAt: new Date().toISOString(),
    source: "ops/intake/kidnest-audit-board.json",
    initiative: board.initiative,
    projectName: board.project,
    workspaceUrl: `https://linear.app/${org.urlKey}`,
    teamName: team.name,
    teamId: team.id,
    projectId: project?.id,
    projectUrl: project?.url || `https://linear.app/${org.urlKey}/team/${team.key}/active`,
    cancelledCount: cancelled.length,
    cancelled,
    issueCount: created.length,
    issues: created,
  };
  writeFileSync(OLD_MANIFEST.replace("linear-issues.json", "linear-issues.json"), JSON.stringify(manifest, null, 2), "utf8");
  writeFileSync(join(ROOT, "ops/linear-issues.json"), JSON.stringify(manifest, null, 2), "utf8");

  console.log(
    JSON.stringify({
      ok: true,
      cancelled: cancelled.length,
      created: created.length,
      workspaceUrl: manifest.workspaceUrl,
      projectUrl: manifest.projectUrl,
      teamUrl: `https://linear.app/${org.urlKey}/team/${team.key}/active`,
      issues: created.map((i) => ({ id: i.localId, url: i.url })),
    })
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message, stack: e.stack }));
  process.exit(1);
});
