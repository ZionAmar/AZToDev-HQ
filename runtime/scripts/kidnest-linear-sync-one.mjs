/**
 * Sync one task status from kidnest-audit-board.json → Linear.
 * Usage: node runtime/scripts/kidnest-linear-sync-one.mjs NS-05
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LinearClient } from '@linear/sdk';

const taskId = process.argv[2];
if (!taskId) {
  console.error('Usage: node kidnest-linear-sync-one.mjs NS-05');
  process.exit(1);
}

const ROOT = join(import.meta.dirname, '../..');
const BOARD_PATH = join(ROOT, 'ops/intake/kidnest-audit-board.json');
const MAP_PATH = join(ROOT, 'ops/linear-task-map.json');

function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const m = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* optional */
  }
}
loadEnv();

const apiKey = (process.env.LINEAR_API_KEY || '').trim();
if (!apiKey) {
  console.error(JSON.stringify({ ok: false, error: 'LINEAR_API_KEY missing' }));
  process.exit(1);
}

const board = JSON.parse(readFileSync(BOARD_PATH, 'utf8'));
const map = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
const task = board.tasks.find((t) => t.id === taskId);
const issueId = map.issues?.[taskId];
if (!task || !issueId) {
  console.error(JSON.stringify({ ok: false, error: 'task or issueId not found', taskId }));
  process.exit(1);
}

const client = new LinearClient({ apiKey });

function statusToStateName(status) {
  if (status === 'done') return 'Done';
  if (status === 'in_progress') return 'In Progress';
  if (status === 'cancelled') return 'Canceled';
  return 'Todo';
}

async function main() {
  const issue = await client.issue(issueId);
  const team = await issue.team;
  const states = await team.states();
  const want = statusToStateName(task.status);
  const st =
    states.nodes.find((s) => s.name.toLowerCase() === want.toLowerCase()) ||
    states.nodes.find((s) => s.type === 'completed' && task.status === 'done') ||
    states.nodes.find((s) => s.type === 'started' && task.status === 'in_progress');
  if (!st) throw new Error(`state not found for ${task.status}`);

  const description = [
    `**בקשת המייסד:** ${board.founderAsk}`,
    `**Production:** ${board.productionUrl}`,
    `**Owner:** ${task.owner}`,
    `**סטטוס:** ${task.statusHe || task.status}`,
    `**DoD:** ${task.dod}`,
    task.resultHe ? `\n**תוצאה:**\n${task.resultHe}` : '',
    task.artifact ? `\n**Artifact:** ${task.artifact}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  await client.updateIssue(issueId, { stateId: st.id, description });
  console.log(JSON.stringify({ ok: true, taskId, issueId, state: st.name, url: issue.url }));
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e.message }));
  process.exit(1);
});
