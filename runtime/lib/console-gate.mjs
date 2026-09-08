/**
 * Per-agent turn locks — Nura (00-ceo) can chat while specialists work.
 * Do NOT globally kill CMD windows here (that would interrupt other agents).
 * Each chatWithAgent turn still snapshots/reaps its own new consoles in finally.
 */
import { journal } from "./paths.mjs";
import { reapOrphanConsoles, reapAgentSpawnedConsoles } from "./cleanup-consoles.mjs";

/** agentId → last promise in chain */
const chains = new Map();
/** agentId → depth (reentrant within same agent) */
const depths = new Map();

/** Count cmd.exe that look like Cursor/EMET agent shells (not OEM). */
export async function countAgentCmdWindows() {
  if (process.platform !== "win32") return 0;
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const execFileAsync = promisify(execFile);
  try {
    const { stdout } = await execFileAsync(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        `
$n = 0
$procs = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq 'cmd.exe' })
foreach ($p in $procs) {
  $par = Get-CimInstance Win32_Process -Filter "ProcessId=$($p.ParentProcessId)" -ErrorAction SilentlyContinue
  $parentName = if ($par) { [string]$par.Name } else { '' }
  $parentCmd = if ($par) { [string]$par.CommandLine } else { '' }
  if ($parentName -match '^(Dell\\.|GoogleDrive|PresentMon|httpd)') { continue }
  if ($parentCmd -match 'Dell\\.|Google.?Drive|PresentMon') { continue }
  if (-not $par) { $n++; continue }
  if ($parentName -match '^(node|Cursor)\\.exe$') { $n++; continue }
  if ($parentCmd -match 'cursor|@cursor|agents\\\\|my_company|emet') { $n++; continue }
}
$n
`,
      ],
      { windowsHide: true, timeout: 15000, maxBuffer: 1024 * 1024 }
    );
    const n = Number(String(stdout || "0").trim());
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

/**
 * Soft clear: orphans only — never kill live shells of other agents.
 */
export async function clearAgentConsolesBeforeTurn({
  reason = "before-turn",
  aggressive = false,
} = {}) {
  if (process.platform !== "win32") return { cleared: true, killed: 0 };
  if (aggressive) {
    const r = await reapAgentSpawnedConsoles();
    journal("console_gate_clear", {
      reason,
      aggressive: true,
      killed: (r.killed || []).length,
    });
    return { cleared: true, killed: (r.killed || []).length };
  }
  const r = await reapOrphanConsoles();
  journal("console_gate_clear", {
    reason,
    aggressive: false,
    killed: (r.killed || []).length,
  });
  return { cleared: true, killed: (r.killed || []).length };
}

/**
 * Serialize turns per agentId only.
 * @param {() => Promise<any>} fn
 * @param {string} [agentId]
 */
export function withAgentTurnLock(fn, agentId = "global") {
  const id = String(agentId || "global");
  const depth = depths.get(id) || 0;

  if (depth > 0) {
    depths.set(id, depth + 1);
    return Promise.resolve()
      .then(async () => {
        await clearAgentConsolesBeforeTurn({ reason: `${id}-nested-before` });
        return fn();
      })
      .finally(() => {
        depths.set(id, (depths.get(id) || 1) - 1);
      });
  }

  const prev = chains.get(id) || Promise.resolve();
  const run = prev.then(async () => {
    depths.set(id, 1);
    try {
      await clearAgentConsolesBeforeTurn({ reason: `${id}-before` });
      return await fn();
    } finally {
      await clearAgentConsolesBeforeTurn({ reason: `${id}-after` });
      depths.set(id, 0);
    }
  });

  chains.set(
    id,
    run.then(
      () => undefined,
      () => undefined
    )
  );
  return run;
}

export function agentTurnLockStatus() {
  const out = {};
  for (const [k, v] of depths.entries()) out[k] = v;
  return { depths: out };
}
