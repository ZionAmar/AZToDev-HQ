/**
 * Audit + patch Keshet Linear board for founder phone.
 * - Confirm dev-only (no active non-Keshet issues)
 * - Only EMET-66 carries waiting-founder until a bet activates
 * - Title prefix [KSH-NN · ownerName] on pipeline stages
 *
 * Usage: node runtime/scripts/keshet-linear-audit.mjs [--apply]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT = join(import.meta.dirname, "../..");
const BOARD_PATH = join(ROOT, "ops/keshet-pipeline-board.json");
const MANIFEST_PATH = join(ROOT, "ops/linear-keshet-issues.json");
const apply = process.argv.includes("--apply");

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

async function getLabelMap(teamId) {
  const labels = await client.issueLabels({ first: 100 });
  const map = new Map();
  for (const l of labels.nodes) {
    map.set(l.name, l.id);
  }
  return map;
}

async function main() {
  const teams = await client.teams();
  const emet = teams.nodes.find((t) => t.name === "EMET");
  if (!emet) throw new Error("EMET team not found");

  const active = await client.issues({
    first: 250,
    filter: {
      team: { id: { eq: emet.id } },
      state: { type: { nin: ["canceled"] } },
    },
  });

  const nonKeshet = [];
  for (const issue of active.nodes) {
    const project = issue.project ? await issue.project : null;
    if (project?.name !== board.projectName) {
      nonKeshet.push({ id: issue.identifier, title: issue.title, project: project?.name });
    }
  }

  const labelMap = await getLabelMap(emet.id);
  const waitingFounderId = labelMap.get("waiting-founder");
  const patches = [];

  for (const stage of board.stages) {
    const issue = await client.issue(stage.identifier);
    const labels = await issue.labels();
    const labelNames = labels.nodes.map((l) => l.name);
    const wantTitle = `[${stage.localId} · ${stage.ownerName}] ${stage.title}`;
    const hasWaiting = labelNames.includes("waiting-founder");
    const shouldWaiting = false; // future gates: label added when stage becomes active

    const patch = { identifier: stage.identifier, localId: stage.localId, changes: [] };

    if (issue.title !== wantTitle) {
      patch.changes.push({ field: "title", from: issue.title, to: wantTitle });
      if (apply) await client.updateIssue(issue.id, { title: wantTitle });
    }

    if (hasWaiting && !shouldWaiting && stage.localId !== "KSH-00") {
      const newLabelIds = labels.nodes.filter((l) => l.name !== "waiting-founder").map((l) => l.id);
      patch.changes.push({ field: "labels", remove: "waiting-founder" });
      if (apply) await client.updateIssue(issue.id, { labelIds: newLabelIds });
    }

    if (patch.changes.length) patches.push(patch);
  }

  // Holding issue: ensure waiting-founder present
  const holding = await client.issue(board.holdingIssue.identifier);
  const holdingLabels = await holding.labels();
  const holdingLabelNames = holdingLabels.nodes.map((l) => l.name);
  if (!holdingLabelNames.includes("waiting-founder") && waitingFounderId) {
    patches.push({
      identifier: board.holdingIssue.identifier,
      localId: "KSH-00",
      changes: [{ field: "labels", add: "waiting-founder" }],
    });
    if (apply) {
      const ids = holdingLabels.nodes.map((l) => l.id);
      if (!ids.includes(waitingFounderId)) ids.push(waitingFounderId);
      await client.updateIssue(holding.id, { labelIds: ids });
    }
  }

  const waitingAfter = [];
  if (apply || patches.length === 0) {
    const recheck = await client.issues({
      first: 250,
      filter: {
        team: { id: { eq: emet.id } },
        labels: { name: { eq: "waiting-founder" } },
        state: { type: { nin: ["canceled"] } },
      },
    });
    for (const i of recheck.nodes) {
      waitingAfter.push({ id: i.identifier, title: i.title });
    }
  }

  const manifest = {
    auditedAt: new Date().toISOString(),
    projectName: board.projectName,
    projectUrl: board.projectUrl,
    devOnlyClean: nonKeshet.length === 0,
    activeIssueCount: active.nodes.length,
    nonKeshetActive: nonKeshet,
    holdingIssue: board.holdingIssue,
    stages: board.stages.map((s) => ({
      localId: s.localId,
      identifier: s.identifier,
      ownerName: s.ownerName,
      ownerAgent: s.ownerAgent,
      url: `https://linear.app/my-company1460/issue/${s.identifier}`,
    })),
    founderPhoneFilter: {
      label: "waiting-founder",
      issues: waitingAfter.length
        ? waitingAfter
        : [{ id: board.holdingIssue.identifier, note: "expected sole gate while armed" }],
    },
  };

  if (apply) writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");

  console.log(
    JSON.stringify(
      {
        ok: true,
        apply,
        devOnlyClean: nonKeshet.length === 0,
        activeIssueCount: active.nodes.length,
        nonKeshetActive: nonKeshet,
        patches,
        founderPhoneWaitingFounder: manifest.founderPhoneFilter,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message }));
  process.exit(1);
});
