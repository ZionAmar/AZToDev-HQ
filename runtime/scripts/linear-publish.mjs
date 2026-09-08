/**
 * Publish ops/board.json tasks to Linear team EMET.
 * Requires LINEAR_API_KEY in .env (Settings → Account → Security → Personal API keys).
 *
 * Usage: node runtime/scripts/linear-publish.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = join(ROOT, "ops/board.json");
const MANIFEST_PATH = join(ROOT, "ops/linear-issues.json");
const SETUP_PATH = join(ROOT, "ops/linear-setup.md");

const LABELS = [
  "intake",
  "discover",
  "shape",
  "architect",
  "plan",
  "build",
  "harden",
  "stage",
  "launch",
  "learn",
  "grow",
  "blocked",
  "waiting-founder",
  "sev1",
  "sev2",
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
  console.error(
    JSON.stringify({
      ok: false,
      error: "LINEAR_API_KEY missing",
      founderSteps: [
        "Linear app → Settings → Account → Security & access → Personal API keys → Create key (Write)",
        "Add to my_company/.env: LINEAR_API_KEY=lin_api_...",
        "Re-run: node runtime/scripts/linear-publish.mjs",
        "Alternative: Cursor → MCP → Linear → ensure connected (green), then re-open PM agent chat",
      ],
    })
  );
  process.exit(1);
}

const board = JSON.parse(readFileSync(BOARD_PATH, "utf8"));
const client = new LinearClient({ apiKey });

const COLUMN_TO_STATE = {
  today: "started",
  in_progress: "started",
  blocked: "started",
  waiting_founder: "started",
  backlog: "backlog",
  done: "completed",
};

const COLUMN_TO_LABEL = {
  blocked: "blocked",
  waiting_founder: "waiting-founder",
};

async function ensureTeam() {
  const teamId = (process.env.LINEAR_TEAM_ID || "").trim();
  if (teamId) {
    const team = await client.team(teamId);
    return team;
  }
  const teams = await client.teams();
  let team = teams.nodes.find((t) => t.name.toLowerCase() === "emet");
  if (!team) {
    const org = await client.organization;
    team = await client.createTeam({
      name: "EMET",
      key: "EMET",
      organizationId: org.id,
    });
    console.error("Created team EMET:", team.id);
  }
  return team;
}

async function ensureLabels(teamId) {
  for (const name of LABELS) {
    try {
      const existing = await client.issueLabels({ filter: { name: { eq: name } } });
      if (!existing.nodes[0]) {
        await client.createIssueLabel({ name, teamId });
      }
    } catch {
      /* label exists workspace-wide */
    }
  }
}

function collectIssues() {
  const issues = [];
  const cols = board.columns || {};
  for (const [column, items] of Object.entries(cols)) {
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      issues.push({
        column,
        id: item.id,
        title: item.title,
        owner: item.owner,
        source: item.source,
        labels: [
          item.label,
          COLUMN_TO_LABEL[column],
          item.source === "intake" ? "intake" : "plan",
        ].filter(Boolean),
        description: [
          `**Board column:** ${column}`,
          item.owner ? `**Owner:** ${item.owner}` : null,
          item.source ? `**Source:** ${item.source}` : null,
          item.id ? `**Local ID:** ${item.id}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    }
  }
  return issues;
}

async function main() {
  const team = await ensureTeam();
  await ensureLabels(team.id);

  const workflowStates = await team.states();
  const stateByType = {};
  for (const s of workflowStates.nodes) {
    stateByType[s.type] = s.id;
  }

  const toPublish = collectIssues();
  const created = [];

  for (const issue of toPublish) {
    const stateId =
      issue.column === "done"
        ? stateByType.completed
        : issue.column === "backlog"
          ? stateByType.backlog
          : stateByType.started || stateByType.unstarted || stateByType.backlog;

    const labelIds = [];
    for (const name of [...new Set(issue.labels)]) {
      const labels = await client.issueLabels({ filter: { name: { eq: name } } });
      if (labels.nodes[0]) labelIds.push(labels.nodes[0].id);
    }

    const result = await client.createIssue({
      teamId: team.id,
      title: issue.title,
      description: issue.description,
      stateId,
      labelIds: labelIds.length ? labelIds : undefined,
    });

    const createdIssue = await result.issue;
    if (createdIssue) {
      created.push({
        localId: issue.id,
        identifier: createdIssue.identifier,
        title: createdIssue.title,
        url: createdIssue.url,
        column: issue.column,
      });
    }
  }

  const org = await client.organization;
  const manifest = {
    publishedAt: new Date().toISOString(),
    workspaceUrl: `https://linear.app/${org.urlKey}`,
    teamName: team.name,
    teamId: team.id,
    issueCount: created.length,
    issues: created,
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");

  const setupDoc = readFileSync(SETUP_PATH, "utf8");
  const block = [
    "",
    "## Last publish",
    `- **At:** ${manifest.publishedAt}`,
    `- **Workspace:** ${manifest.workspaceUrl}`,
    `- **Team:** ${team.name} (\`${team.id}\`)`,
    `- **Issues:** ${created.length}`,
    "",
    "### Issue URLs (founder phone)",
    ...created.map((i) => `- [${i.identifier}](${i.url}) — ${i.title}`),
    "",
  ].join("\n");

  const marker = "## Last publish";
  const updated = setupDoc.includes(marker)
    ? setupDoc.replace(/## Last publish[\s\S]*?(?=\n## |$)/, block.trim())
    : setupDoc + block;

  writeFileSync(SETUP_PATH, updated, "utf8");

  console.log(JSON.stringify({ ok: true, ...manifest }, null, 2));
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message }));
  process.exit(1);
});
