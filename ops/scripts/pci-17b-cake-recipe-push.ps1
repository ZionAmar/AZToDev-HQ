<#
PCI-17b — cake-recipe-demo: create repo + push 7 files + enable Pages + write HQ outbox evidence.

WHY THIS SCRIPT EXISTS (read this first):
Two prior PCI-16/17 attempts asked Nadav to run this by hand through Cursor's built-in
terminal, which keeps crashing on his PC with exit 0xC0000142. This script has ZERO
dependency on Cursor, Cursor's terminal, or node — it only needs plain Windows
PowerShell + git + GitHub CLI (gh), which the existing PCI-17b packet already assumes
Nadav can run manually. Run it from:
  - a plain Windows Terminal / PowerShell console (right-click > Run with PowerShell), OR
  - Task Scheduler / a Startup shortcut, the same pattern already used for
    NADAV-PC.vbs + ops/scripts/install-nadav-startup.ps1 (no Cursor process involved at all).

USAGE (from a normal PowerShell window, not Cursor's terminal):
  powershell -ExecutionPolicy Bypass -File ops\scripts\pci-17b-cake-recipe-push.ps1

Safe to re-run: every step checks current state first (idempotent-ish) and never
deletes anything. If a step fails, it prints the exact error and keeps going where
possible, then still writes the HQ outbox file with whatever it learned — partial,
honest evidence beats silence.
#>

param(
  [string]$TargetDir = "",
  [string]$RepoOwner = "ZionAmar",
  [string]$RepoName = "cake-recipe-demo"
)

$ErrorActionPreference = "Continue"
$log = @()
function Note($msg) {
  Write-Host $msg
  $script:log += $msg
}

$hqRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Note "HQ root: $hqRoot"

if (-not $TargetDir) {
  $TargetDir = Join-Path (Split-Path $hqRoot -Parent) $RepoName
}
Note "Local clone target for the new repo: $TargetDir"

$result = [ordered]@{
  startedAt      = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
  repo           = "$RepoOwner/$RepoName"
  repoCreated    = $false
  repoUrl        = ""
  commitSha      = ""
  filesCopied    = @()
  pagesEnabled   = $false
  workflowRunUrl = ""
  workflowResult = ""
  pagesUrl       = "https://$($RepoOwner.ToLower()).github.io/$RepoName/"
  curlStatus     = ""
  errors         = @()
}

function HasCmd($name) {
  return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

if (-not (HasCmd "git")) { $result.errors += "git not found on PATH"; Note "ERROR: git not found" }
if (-not (HasCmd "gh"))  { $result.errors += "gh (GitHub CLI) not found on PATH"; Note "ERROR: gh not found" }

if ($result.errors.Count -gt 0) {
  Note "Missing required tools — stopping before touching GitHub. Install git + gh, then re-run."
} else {

  # 1. Does the repo already exist?
  $existing = & gh api "repos/$RepoOwner/$RepoName" 2>$null
  if ($LASTEXITCODE -eq 0) {
    Note "Repo already exists — skipping create."
    $result.repoCreated = $true
  } else {
    Note "Creating private repo $RepoOwner/$RepoName ..."
    & gh repo create "$RepoOwner/$RepoName" --private --confirm 2>&1 | ForEach-Object { Note $_ }
    if ($LASTEXITCODE -eq 0) { $result.repoCreated = $true } else { $result.errors += "gh repo create failed" }
  }
  $result.repoUrl = "https://github.com/$RepoOwner/$RepoName"

  if ($result.repoCreated) {
    # 2. Clone or update local working copy
    if (Test-Path (Join-Path $TargetDir ".git")) {
      Note "Local clone exists — pulling latest."
      Push-Location $TargetDir
      & git pull origin main 2>&1 | ForEach-Object { Note $_ }
      Pop-Location
    } else {
      Note "Cloning fresh into $TargetDir ..."
      & git clone "https://github.com/$RepoOwner/$RepoName.git" $TargetDir 2>&1 | ForEach-Object { Note $_ }
    }

    if (Test-Path $TargetDir) {
      # 3. Copy the 7 staged files from HQ into the new repo root
      $srcFrontend = Join-Path $hqRoot "agents\14-frontend-engineer\outbox\cake-recipe-demo-bundle"
      $srcDevops   = Join-Path $hqRoot "ops\staging\cake-recipe-demo"

      $copyMap = @(
        @{ From = Join-Path $srcFrontend "index.html";                       To = Join-Path $TargetDir "index.html" }
        @{ From = Join-Path $srcFrontend "styles.css";                       To = Join-Path $TargetDir "styles.css" }
        @{ From = Join-Path $srcFrontend "README.md";                        To = Join-Path $TargetDir "README.md" }
        @{ From = Join-Path $srcDevops   "Dockerfile";                       To = Join-Path $TargetDir "Dockerfile" }
        @{ From = Join-Path $srcDevops   ".dockerignore";                    To = Join-Path $TargetDir ".dockerignore" }
        @{ From = Join-Path $srcDevops   ".github\workflows\pages.yml";      To = Join-Path $TargetDir ".github\workflows\pages.yml" }
        @{ From = Join-Path $srcDevops   "PAGES_SETUP.md";                   To = Join-Path $TargetDir "PAGES_SETUP.md" }
      )

      foreach ($pair in $copyMap) {
        if (Test-Path $pair.From) {
          New-Item -ItemType Directory -Force -Path (Split-Path $pair.To) | Out-Null
          Copy-Item $pair.From $pair.To -Force
          $result.filesCopied += (Split-Path $pair.To -Leaf)
          Note "Copied: $($pair.From) -> $($pair.To)"
        } else {
          $result.errors += "Missing source file (git pull HQ repo first): $($pair.From)"
          Note "ERROR missing source: $($pair.From)"
        }
      }

      # 4. Commit + push
      Push-Location $TargetDir
      & git add -A
      & git commit -m "feat: RTL cake recipe demo + Docker + GitHub Pages workflow" 2>&1 | ForEach-Object { Note $_ }
      & git branch -M main 2>&1 | Out-Null
      & git push -u origin main 2>&1 | ForEach-Object { Note $_ }
      $sha = & git rev-parse HEAD 2>$null
      if ($LASTEXITCODE -eq 0) { $result.commitSha = $sha.Trim() }
      Pop-Location

      # 5. Enable Pages (Source: GitHub Actions) — one-time API call, falls back to manual note
      Note "Enabling GitHub Pages (build_type=workflow) ..."
      & gh api -X POST "repos/$RepoOwner/$RepoName/pages" -f "build_type=workflow" 2>&1 | ForEach-Object { Note $_ }
      if ($LASTEXITCODE -eq 0) {
        $result.pagesEnabled = $true
      } else {
        $result.errors += "Pages API enable failed — do it manually: repo Settings > Pages > Source: GitHub Actions"
      }

      # 6. Check latest workflow run
      Start-Sleep -Seconds 8
      $runJson = & gh run list --repo "$RepoOwner/$RepoName" --limit 1 --json databaseId,url,status,conclusion 2>$null
      if ($LASTEXITCODE -eq 0 -and $runJson) {
        try {
          $run = ($runJson | ConvertFrom-Json)[0]
          if ($run) {
            $result.workflowRunUrl = $run.url
            $result.workflowResult = "$($run.status)/$($run.conclusion)"
          }
        } catch { $result.errors += "Could not parse workflow run JSON" }
      }

      # 7. curl the live Pages URL
      try {
        $resp = Invoke-WebRequest -Uri $result.pagesUrl -Method Head -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
        $result.curlStatus = [string]$resp.StatusCode
      } catch {
        if ($_.Exception.Response) {
          $result.curlStatus = [string]([int]$_.Exception.Response.StatusCode)
        } else {
          $result.curlStatus = "no_response: $($_.Exception.Message)"
        }
      }
    } else {
      $result.errors += "Local clone directory missing after clone attempt: $TargetDir"
    }
  }
}

$result.finishedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

# 8. Write + push the HQ outbox evidence file (closes the loop back into git-tracked HQ)
$dateStr = (Get-Date).ToString("yyyy-MM-dd")
$outboxDir = Join-Path $hqRoot "agents\34-pc-ops\outbox"
New-Item -ItemType Directory -Force -Path $outboxDir | Out-Null
$outboxFile = Join-Path $outboxDir "$($dateStr)_pci-17b-cake-recipe-unified-result.md"

$resultJson = $result | ConvertTo-Json -Depth 6
$md = @"
# PCI-17b result — cake-recipe-demo repo create + push + Pages (executed via pci-17b-cake-recipe-push.ps1, not Cursor's shell)

**Ran at:** $($result.startedAt) → $($result.finishedAt)
**Executed by:** Nadav (34-pc-ops), plain PowerShell — Cursor's terminal was not used for this run (works around the 0xC0000142 shell crash).

## Full JSON result

``````json
$resultJson
``````

## Quick read

- Repo: $($result.repoUrl) (created this run: $($result.repoCreated))
- Commit SHA: $($result.commitSha)
- Files copied: $($result.filesCopied -join ", ")
- Pages enabled via API: $($result.pagesEnabled)
- Workflow run: $($result.workflowRunUrl) ($($result.workflowResult))
- Live URL: $($result.pagesUrl) — curl status: $($result.curlStatus)
- Errors (if any): $($result.errors -join " | ")

Next: 32-delivery-lead hands this to QA (20-qa-sdet / Uri) once curl status is 200.
"@

Set-Content -Path $outboxFile -Value $md -Encoding UTF8
Note "Wrote outbox evidence: $outboxFile"

Push-Location $hqRoot
& git add $outboxFile
& git commit -m "docs(34-pc-ops): PCI-17b execution result (pci-17b-cake-recipe-push.ps1)" 2>&1 | ForEach-Object { Note $_ }
& git push origin main 2>&1 | ForEach-Object { Note $_ }
Pop-Location

Note ""
Note "=== DONE. Result summary ==="
Note $resultJson
