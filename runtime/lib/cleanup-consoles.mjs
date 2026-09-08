/**
 * Reap leftover Windows console hosts (cmd/conhost) from Cursor agent shells.
 * Never touch Dell / Google Drive / XAMPP / explorer system consoles.
 *
 * Also kills "empty" visible CMD windows (no title) from node/Cursor — those
 * are the blank windows the founder keeps seeing.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { journal } from "./paths.mjs";

const execFileAsync = promisify(execFile);

function ps(command) {
  return execFileAsync(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", command],
    {
      windowsHide: true,
      timeout: 25000,
      maxBuffer: 2 * 1024 * 1024,
    }
  );
}

const REAP_CORE = `
function IsOemParent($parentName, $parentCmd) {
  if ($parentName -match '^(Dell\\.|GoogleDrive|PresentMon|httpd|explorer|Services|svchost|System)') { return $true }
  if ($parentCmd -match 'Dell\\.|Google.?Drive|PresentMon|xampp') { return $true }
  return $false
}
function IsAgentParent($parentName, $parentCmd) {
  if ($parentName -match '^(node|Cursor|OpenConsole|cmd)\\.exe$') {
    if ($parentCmd -match 'cursor|@cursor|agents\\\\|my_company|composer|Agent|emet|helpers\\\\node') { return $true }
    if ($parentName -eq 'node.exe') { return $true }
    if ($parentName -eq 'cmd.exe') { return $true }
  }
  return $false
}
function WindowTitle($procId) {
  try {
    $gp = Get-Process -Id $procId -ErrorAction SilentlyContinue
    if ($gp) { return [string]$gp.MainWindowTitle }
  } catch {}
  return ''
}
`;

/** Snapshot cmd/conhost/OpenConsole PIDs currently alive. */
export async function snapshotConsolePids() {
  if (process.platform !== "win32") return new Set();
  try {
    const { stdout } = await ps(
      `@(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^(cmd|conhost|OpenConsole)\\.exe$' } | ForEach-Object { $_.ProcessId }) -join ','`
    );
    const set = new Set();
    for (const part of String(stdout || "").split(",")) {
      const n = Number(String(part).trim());
      if (Number.isFinite(n) && n > 0) set.add(n);
    }
    return set;
  } catch {
    return new Set();
  }
}

function reapScript({ beforeList = null, orphansOnly = false, emptyWindows = true, maxAgeHours = 6 } = {}) {
  const beforeInit =
    beforeList && beforeList.length
      ? `foreach ($b in @(${beforeList.join(",")})) { if ($b -gt 0) { [void]$beforeSet.Add([int]$b) } }`
      : "";
  const orphansFlag = orphansOnly ? "$true" : "$false";
  const emptyFlag = emptyWindows ? "$true" : "$false";

  return `
${REAP_CORE}
$beforeSet = [System.Collections.Generic.HashSet[int]]::new()
${beforeInit}
$orphansOnly = ${orphansFlag}
$emptyWindows = ${emptyFlag}
$killed = New-Object System.Collections.Generic.List[int]
$procs = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
  $_.Name -match '^(cmd|conhost|OpenConsole)\\.exe$'
})
foreach ($p in $procs) {
  $procId = [int]$p.ProcessId
  if ($beforeSet.Count -gt 0 -and $beforeSet.Contains($procId)) { continue }

  $ppid = [int]$p.ParentProcessId
  $par = Get-CimInstance Win32_Process -Filter "ProcessId=$ppid" -ErrorAction SilentlyContinue
  $parentName = if ($par) { [string]$par.Name } else { '' }
  $parentCmd = if ($par) { [string]$par.CommandLine } else { '' }
  $parentAlive = $null -ne $par

  if (IsOemParent $parentName $parentCmd) { continue }

  $orphan = -not $parentAlive
  $fromAgent = IsAgentParent $parentName $parentCmd
  $title = WindowTitle $procId
  $emptyTitle = [string]::IsNullOrWhiteSpace($title)

  $recent = $true
  try {
    $created = [Management.ManagementDateTimeConverter]::ToDateTime($p.CreationDate)
    $recent = $created -gt (Get-Date).AddHours(-${maxAgeHours})
  } catch {}

  $doKill = $false
  if ($recent -and $orphan) { $doKill = $true }
  elseif ($recent -and $fromAgent -and -not $orphansOnly) { $doKill = $true }
  # Blank visible CMD left behind by agent shells
  elseif ($emptyWindows -and $recent -and $p.Name -eq 'cmd.exe' -and $emptyTitle -and ($fromAgent -or $orphan)) {
    $doKill = $true
  }
  # Orphan / empty conhost not owned by OEM
  elseif ($emptyWindows -and $recent -and $p.Name -match 'conhost|OpenConsole' -and $orphan) {
    $doKill = $true
  }

  if ($doKill) {
    try {
      Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
      $killed.Add($procId) | Out-Null
    } catch {}
  }
}
($killed | Select-Object -Unique) -join ','
`;
}

export async function killNewConsoles(before, { reason = "agent-turn-end" } = {}) {
  if (process.platform !== "win32") return { killed: [] };
  const beforeSet = before instanceof Set ? before : new Set(before || []);
  const beforeList = [...beforeSet].filter((n) => Number.isFinite(n) && n > 0);

  try {
    const { stdout } = await ps(
      reapScript({ beforeList, orphansOnly: false, emptyWindows: true, maxAgeHours: 2 })
    );
    const killed = parseKilled(stdout);
    if (killed.length) journal("console_cleanup", { reason, killed, count: killed.length });
    return { killed };
  } catch (err) {
    journal("console_cleanup_error", { reason, error: String(err?.message || err) });
    return { killed: [], error: String(err?.message || err) };
  }
}

export async function reapOrphanConsoles(before = null) {
  if (process.platform !== "win32") return { killed: [] };
  const beforeSet = before instanceof Set ? before : new Set(before || []);
  const beforeList = [...beforeSet].filter((n) => Number.isFinite(n) && n > 0);
  try {
    const { stdout } = await ps(
      reapScript({ beforeList, orphansOnly: true, emptyWindows: true, maxAgeHours: 2 })
    );
    const killed = parseKilled(stdout);
    if (killed.length) journal("console_orphan_reap", { killed, count: killed.length });
    return { killed };
  } catch (err) {
    return { killed: [], error: String(err?.message || err) };
  }
}

export async function reapAgentSpawnedConsoles() {
  if (process.platform !== "win32") return { killed: [] };
  try {
    const { stdout } = await ps(
      reapScript({ beforeList: null, orphansOnly: false, emptyWindows: true, maxAgeHours: 6 })
    );
    const killed = parseKilled(stdout);
    if (killed.length) journal("console_agent_reap", { killed, count: killed.length });
    return { killed };
  } catch (err) {
    return { killed: [], error: String(err?.message || err) };
  }
}

/** Explicit pass for blank CMD windows the user sees on the desktop. */
export async function reapEmptyCmdWindows() {
  if (process.platform !== "win32") return { killed: [] };
  const script = `
${REAP_CORE}
Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Collections.Generic;
public class EmEnum {
  public delegate bool CB(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(CB f, IntPtr l);
  [DllImport("user32.dll")] public static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint p);
  [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h, uint Msg, IntPtr w, IntPtr l);
  public static List<uint> EmptyConsolePids() {
    var set = new HashSet<uint>();
    EnumWindows((h,l) => {
      if (!IsWindowVisible(h)) return true;
      var cls = new StringBuilder(256);
      GetClassName(h, cls, 256);
      if (cls.ToString() != "ConsoleWindowClass") return true;
      var title = new StringBuilder(512);
      GetWindowText(h, title, 512);
      if (!string.IsNullOrWhiteSpace(title.ToString())) return true;
      uint pid; GetWindowThreadProcessId(h, out pid);
      set.Add(pid);
      return true;
    }, IntPtr.Zero);
    return new List<uint>(set);
  }
}
"@
$killed = New-Object System.Collections.Generic.List[int]
foreach ($pid in [EmEnum]::EmptyConsolePids()) {
  $p = Get-CimInstance Win32_Process -Filter "ProcessId=$pid" -ErrorAction SilentlyContinue
  if (-not $p) { continue }
  if ($p.Name -notmatch '^(cmd|conhost|OpenConsole|powershell|pwsh)\\.exe$') { continue }
  $par = Get-CimInstance Win32_Process -Filter "ProcessId=$($p.ParentProcessId)" -ErrorAction SilentlyContinue
  $parentName = if ($par) { [string]$par.Name } else { '' }
  $parentCmd = if ($par) { [string]$par.CommandLine } else { '' }
  if (IsOemParent $parentName $parentCmd) { continue }
  # Don't kill our own hidden powershell reaper
  if ($p.Name -match 'powershell|pwsh' -and $parentCmd -match 'emet|cleanup') { continue }
  try {
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    $killed.Add([int]$pid) | Out-Null
  } catch {}
}
foreach ($gp in @(Get-Process -Name cmd -ErrorAction SilentlyContinue)) {
  $title = [string]$gp.MainWindowTitle
  if (-not [string]::IsNullOrWhiteSpace($title)) { continue }
  $p = Get-CimInstance Win32_Process -Filter "ProcessId=$($gp.Id)" -ErrorAction SilentlyContinue
  if (-not $p) { continue }
  $par = Get-CimInstance Win32_Process -Filter "ProcessId=$($p.ParentProcessId)" -ErrorAction SilentlyContinue
  $parentName = if ($par) { [string]$par.Name } else { '' }
  $parentCmd = if ($par) { [string]$par.CommandLine } else { '' }
  if (IsOemParent $parentName $parentCmd) { continue }
  if (-not $par -or (IsAgentParent $parentName $parentCmd)) {
    try {
      Stop-Process -Id $gp.Id -Force -ErrorAction SilentlyContinue
      $killed.Add([int]$gp.Id) | Out-Null
    } catch {}
  }
}
foreach ($p in @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^(conhost|OpenConsole)\\.exe$' })) {
  $par = Get-CimInstance Win32_Process -Filter "ProcessId=$($p.ParentProcessId)" -ErrorAction SilentlyContinue
  if ($par) { continue }
  try {
    Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
    $killed.Add([int]$p.ProcessId) | Out-Null
  } catch {}
}
($killed | Select-Object -Unique) -join ','
`;
  try {
    const { stdout } = await ps(script);
    const killed = parseKilled(stdout);
    if (killed.length) journal("console_empty_reap", { killed, count: killed.length });
    return { killed };
  } catch (err) {
    return { killed: [], error: String(err?.message || err) };
  }
}

function parseKilled(stdout) {
  return String(stdout || "")
    .split(",")
    .map((s) => Number(String(s).trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}
