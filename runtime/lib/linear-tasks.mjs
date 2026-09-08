/**
 * Sync Hebrew tasks + status to Linear for remote phone visibility.
 */
import fs from "fs";
import path from "path";
import { LinearClient } from "@linear/sdk";
import { ROOT, OPS, journal, readJson, writeJson } from "./paths.mjs";
import { readBoard, findTask, statusHe, STATUS } from "./task-board.mjs";

const MANIFEST = path.join(OPS, "linear-task-map.json");

function loadEnv() {
  try {
    const raw = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim();
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    /* optional */
  }
}

export function linearConfigured() {
  loadEnv();
  return Boolean((process.env.LINEAR_API_KEY || "").trim());
}

function stateForStatus(status) {
  // Linear default state names vary; we set via stateId if we can map
  if (status === STATUS.done) return "Done";
  if (status === STATUS.in_progress) return "In Progress";
  if (status === STATUS.blocked || status === STATUS.waiting_founder) return "In Progress";
  return "Todo";
}

export async function syncTaskToLinear(taskId) {
  if (!linearConfigured()) return { ok: false, reason: "no_key" };
  const apiKey = process.env.LINEAR_API_KEY.trim();
  const client = new LinearClient({ apiKey });
  const board = readBoard();
  const task = findTask(board, taskId);
  if (!task) return { ok: false, reason: "no_task" };

  const map = readJson(MANIFEST, { issues: {} });
  map.issues = map.issues || {};

  let teamId = (process.env.LINEAR_TEAM_ID || "").trim();
  if (!teamId) {
    const teams = await client.teams();
    const emet = teams.nodes.find((t) => /emet/i.test(t.name)) || teams.nodes[0];
    teamId = emet?.id;
  }
  if (!teamId) return { ok: false, reason: "no_team" };

  const title = `[${task.id}] ${task.titleHe || task.title}`;
  const description = `סטטוס: **${statusHe(task.status)}** (${task.status})
עדיפות: ${task.priority || "—"}
שלב: ${task.phase || "—"}
Owner: ${task.owner || "—"}

Definition of done:
${task.dod || "—"}

${task.resultHe ? `תוצאה:\n${task.resultHe}\n` : ""}${task.artifact ? `Artifact: ${task.artifact}\n` : ""}
מקור: לוח EMET המקומי (עדכון אוטומטי)`;

  const existingId = map.issues[taskId];
  if (existingId) {
    try {
      await client.updateIssue(existingId, {
        title,
        description,
      });
      // Try set state by name
      try {
        const issue = await client.issue(existingId);
        const team = await issue.team;
        const states = await team.states();
        const want = stateForStatus(task.status);
        const st = states.nodes.find(
          (s) => s.name.toLowerCase() === want.toLowerCase()
        );
        if (st) await client.updateIssue(existingId, { stateId: st.id });
      } catch {
        /* state optional */
      }
      journal("linear_task_updated", { taskId, issueId: existingId });
      return { ok: true, issueId: existingId, updated: true };
    } catch (err) {
      journal("linear_task_update_fail", { taskId, error: String(err?.message || err) });
    }
  }

  const created = await client.createIssue({
    teamId,
    title,
    description,
  });
  const issue = await created.issue;
  if (issue?.id) {
    map.issues[taskId] = issue.id;
    writeJson(MANIFEST, map);
    journal("linear_task_created", { taskId, issueId: issue.id });
    return { ok: true, issueId: issue.id, created: true };
  }
  return { ok: false, reason: "create_failed" };
}

export async function syncAllOpenTasksToLinear() {
  if (!linearConfigured()) return { ok: false, reason: "no_key" };
  const board = readBoard();
  const results = [];
  for (const t of board.tasks || []) {
    results.push(await syncTaskToLinear(t.id));
  }
  return { ok: true, count: results.length, results };
}
