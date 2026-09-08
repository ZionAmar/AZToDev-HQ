/**
 * Restructure Linear for dev-only policy + Keshet product pipeline.
 * - Cancel/archive non-dev issues (ops, intake, hygiene, household)
 * - Seed pipeline stages in AZToDev Product — Keshet with blocked-by chain
 *
 * Usage: node runtime/scripts/linear-keshet-restructure.mjs [--dry-run]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = join(ROOT, "ops/keshet-pipeline-board.json");
const MANIFEST_PATH = join(ROOT, "ops/linear-keshet.json");

const DRY_RUN = process.argv.includes("--dry-run");

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

function matchesCancel(title, patterns) {
  const t = title.toLowerCase();
  return patterns.some((p) => t.includes(p.toLowerCase()));
}

function shouldCancel(issue, boardConfig) {
  const { identifier, title, canceled, project } = issue;
  if (canceled) return { cancel: false, reason: "already_canceled" };
  if (identifier === "EMET-66") return { cancel: false, reason: "holding_issue" };

  const p = boardConfig.cancelPatterns;
  const allPatterns = [
    ...(p.opsHygiene || []),
    ...(p.inventory || []),
    ...(p.hqDesk || []),
    ...(p.intakeBoard || []),
    ...(p.kidnest || []),
    ...(p.smoke || []),
  ];

  if (matchesCancel(title, allPatterns)) {
    return { cancel: true, reason: "non_dev_pattern" };
  }

  // KidNest projects — historical audit, not active Keshet dev
  if (
    project &&
    /kidnest|nestube/i.test(project) &&
    identifier !== "EMET-66"
  ) {
    return { cancel: true, reason: "kidnest_project" };
  }

  // EMET-65 explicitly HQ ops
  if (identifier === "EMET-65") {
    return { cancel: true, reason: "hq_ops" };
  }

  return { cancel: false, reason: "keep" };
}

async function labelId(teamId, name) {
  const labels = await client.issueLabels({
    filter: { name: { eq: name } },
    first: 5,
  });
  const hit = labels.nodes.find((l) => l.name === name);
  if (hit) return hit.id;
  if (DRY_RUN) return null;
  const created = await client.createIssueLabel({ name, teamId });
  const label = await created.issueLabel;
  return label?.id;
}

async function main() {
  const teams = await client.teams();
  const team = teams.nodes.find((t) => t.name === "EMET");
  if (!team) throw new Error("EMET team not found");

  const states = await team.states();
  const stateByName = Object.fromEntries(states.nodes.map((s) => [s.name, s.id]));
  const canceledStateId = stateByName.Canceled;
  const backlogStateId = stateByName.Backlog;

  const keshetProjectId = board.projectId;

  // Fetch all team issues
  const allIssues = [];
  let cursor = undefined;
  do {
    const page = await client.issues({
      first: 100,
      after: cursor,
      filter: { team: { id: { eq: team.id } } },
    });
    for (const i of page.nodes) {
      const state = await i.state;
      const project = await i.project;
      allIssues.push({
        id: i.id,
        identifier: i.identifier,
        title: i.title,
        canceled: !!i.canceledAt,
        stateType: state?.type,
        project: project?.name || null,
      });
    }
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : undefined;
  } while (cursor);

  const canceled = [];
  const kept = [];

  for (const issue of allIssues) {
    const decision = shouldCancel(issue, board);
    if (decision.cancel) {
      if (!DRY_RUN) {
        await client.updateIssue(issue.id, { stateId: canceledStateId });
      }
      canceled.push({ ...issue, reason: decision.reason });
    } else {
      kept.push({ ...issue, reason: decision.reason });
    }
  }

  // Resolve EMET-66
  const holding = allIssues.find((i) => i.identifier === "EMET-66");
  if (!holding) throw new Error("EMET-66 holding issue missing");

  if (!DRY_RUN) {
    const labelIds = [];
    for (const name of ["WIP-1", "waiting-founder", "plan"]) {
      const id = await labelId(team.id, name);
      if (id) labelIds.push(id);
    }
    await client.updateIssue(holding.id, {
      projectId: keshetProjectId,
      stateId: backlogStateId,
      labelIds,
      description: [
        "**WIP=1 holding issue** — no product build until founder says «תבנו» + PIN window.",
        "",
        "**Owner agent:** `32-delivery-lead` (קשת)",
        "**Stage:** plan / armed",
        "**Artifact:** `ACTIVATE_PRODUCT: <slug> | <one-line bet>` then unblock KSH-01",
        "",
        "Project: AZToDev Product — Keshet",
        "Pipeline source: `ops/keshet-pipeline-board.json`",
      ].join("\n"),
    });
  }

  const createdStages = [];
  const stageIdByLocal = { "KSH-00": holding.id };

  for (const stage of board.stages) {
    if (stage.id === "KSH-00") {
      createdStages.push({
        localId: stage.id,
        identifier: "EMET-66",
        issueId: holding.id,
        url: `https://linear.app/my-company1460/issue/EMET-66`,
        existed: true,
      });
      continue;
    }

    const labelNames = [stage.stageLabel, ...(stage.extraLabels || [])].filter(Boolean);
    const labelIds = [];
    for (const name of labelNames) {
      const id = await labelId(team.id, name);
      if (id) labelIds.push(id);
    }

    const description = [
      `**Pipeline stage:** ${stage.id}`,
      `**Owner agent:** \`${stage.ownerAgent}\` (${stage.ownerName})`,
      `**Stage label:** ${stage.stageLabel}`,
      stage.blockedBy ? `**Blocked by:** ${stage.blockedBy}` : null,
      stage.artifact ? `**Artifact:** ${stage.artifact}` : null,
      "",
      "WIP=1 — only one stage In Progress at a time.",
      "Source: `ops/keshet-pipeline-board.json`",
    ]
      .filter(Boolean)
      .join("\n");

    const title = `[${stage.id}] ${stage.title}`;

    if (DRY_RUN) {
      createdStages.push({ localId: stage.id, title, dryRun: true });
      continue;
    }

    const result = await client.createIssue({
      teamId: team.id,
      projectId: keshetProjectId,
      title,
      description,
      stateId: backlogStateId,
      labelIds: labelIds.length ? labelIds : undefined,
      priority: stage.stageLabel === "waiting-founder" ? 1 : 2,
    });
    const created = await result.issue;
    if (!created) throw new Error(`Failed to create ${stage.id}`);

    stageIdByLocal[stage.id] = created.id;
    createdStages.push({
      localId: stage.id,
      identifier: created.identifier,
      issueId: created.id,
      url: created.url,
      title: created.title,
    });
  }

  // Blocked-by relations (sequential chain)
  const relations = [];
  for (const stage of board.stages) {
    if (!stage.blockedBy || DRY_RUN) continue;
    const issueId = stageIdByLocal[stage.id];
    const blockerId = stageIdByLocal[stage.blockedBy];
    if (!issueId || !blockerId) continue;

    const rel = await client.createIssueRelation({
      issueId: blockerId,
      relatedIssueId: issueId,
      type: "blocks",
    });
    const payload = await rel.issueRelation;
    relations.push({
      from: stage.blockedBy,
      to: stage.id,
      relationId: payload?.id,
    });
  }

  const manifest = {
    restructuredAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    projectName: board.projectName,
    projectId: keshetProjectId,
    projectUrl: "https://linear.app/my-company1460/project/aztodev-product-keshet-938f19d950dd",
    holdingIssue: "EMET-66",
    wipLimit: 1,
    canceledCount: canceled.length,
    canceled: canceled.map((c) => c.identifier),
    keptCount: kept.length,
    kept: kept.map((k) => k.identifier),
    pipelineStages: createdStages,
    relations,
  };

  if (!DRY_RUN) {
    writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  }

  console.log(JSON.stringify({ ok: true, ...manifest }, null, 2));
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message, stack: err.stack }));
  process.exit(1);
});
