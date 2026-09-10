#!/usr/bin/env bash
# PCI-17b — cake-recipe-demo: create repo + push 7 files + enable Pages + JSON evidence.
# Cloud/Linux counterpart to pci-17b-cake-recipe-push.ps1 (no Cursor/node dependency).

set -u

REPO_OWNER="${REPO_OWNER:-ZionAmar}"
REPO_NAME="${REPO_NAME:-cake-recipe-demo}"
HQ_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BUNDLE_DIR="${BUNDLE_DIR:-$HQ_ROOT/ops/exports/cake-recipe-demo}"
TARGET_DIR="${TARGET_DIR:-/tmp/$REPO_NAME}"
PAGES_URL="https://${REPO_OWNER,,}.github.io/$REPO_NAME/"

started_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
errors=()
files_copied=()
repo_created=false
repo_url="https://github.com/$REPO_OWNER/$REPO_NAME"
commit_sha=""
pages_enabled=false
workflow_run_url=""
workflow_result=""
curl_status=""
private_status="unknown"
gh_account="unknown"

log() { echo "$*"; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    errors+=("$1 not found on PATH")
    return 1
  fi
  return 0
}

require_cmd git || true
require_cmd gh || true
require_cmd curl || true

gh_account="$(gh auth status 2>&1 | sed -n 's/.*account \([^ ]*\).*/\1/p' | head -1 || true)"
[[ -z "$gh_account" ]] && gh_account="unknown"

if ((${#errors[@]})); then
  log "Missing required tools — stopping."
else
  expected=(
    index.html styles.css README.md Dockerfile .dockerignore PAGES_SETUP.md
    .github/workflows/pages.yml
  )
  for f in "${expected[@]}"; do
    if [[ ! -f "$BUNDLE_DIR/$f" ]]; then
      errors+=("Missing bundle file: $BUNDLE_DIR/$f")
    fi
  done

  if gh api "repos/$REPO_OWNER/$REPO_NAME" >/dev/null 2>&1; then
    log "Repo already exists — skipping create."
    repo_created=true
    private_status="$(gh api "repos/$REPO_OWNER/$REPO_NAME" --jq '.private' 2>/dev/null || echo unknown)"
  else
    log "Creating private repo $REPO_OWNER/$REPO_NAME ..."
    create_out="$(gh repo create "$REPO_OWNER/$REPO_NAME" --private --confirm 2>&1)" || true
    echo "$create_out"
    if gh api "repos/$REPO_OWNER/$REPO_NAME" >/dev/null 2>&1; then
      repo_created=true
      private_status="$(gh api "repos/$REPO_OWNER/$REPO_NAME" --jq '.private' 2>/dev/null || echo unknown)"
    else
      errors+=("gh repo create failed: ${create_out//$'\n'/; }")
    fi
  fi

  if [[ "$repo_created" == true ]]; then
    if [[ -d "$TARGET_DIR/.git" ]]; then
      log "Local clone exists — pulling latest."
      git -C "$TARGET_DIR" pull origin main 2>&1 || true
    else
      rm -rf "$TARGET_DIR"
      log "Cloning fresh into $TARGET_DIR ..."
      if ! git clone "https://github.com/$REPO_OWNER/$REPO_NAME.git" "$TARGET_DIR" 2>&1; then
        errors+=("git clone failed")
      fi
    fi

    if [[ -d "$TARGET_DIR/.git" ]]; then
      mkdir -p "$TARGET_DIR/.github/workflows"
      for f in index.html styles.css README.md Dockerfile .dockerignore PAGES_SETUP.md; do
        cp "$BUNDLE_DIR/$f" "$TARGET_DIR/$f"
        files_copied+=("$f")
        log "Copied: $f"
      done
      cp "$BUNDLE_DIR/.github/workflows/pages.yml" "$TARGET_DIR/.github/workflows/pages.yml"
      files_copied+=(".github/workflows/pages.yml")

      git -C "$TARGET_DIR" add -A
      if git -C "$TARGET_DIR" diff --cached --quiet; then
        log "No changes to commit."
        commit_sha="$(git -C "$TARGET_DIR" rev-parse HEAD 2>/dev/null || true)"
      else
        git -C "$TARGET_DIR" commit -m "feat: RTL cake recipe demo + Docker + GitHub Pages workflow" 2>&1
        git -C "$TARGET_DIR" branch -M main 2>&1 || true
        if git -C "$TARGET_DIR" push -u origin main 2>&1; then
          commit_sha="$(git -C "$TARGET_DIR" rev-parse HEAD)"
        else
          errors+=("git push failed")
        fi
      fi

      log "Enabling GitHub Pages (build_type=workflow) ..."
      pages_out="$(gh api -X POST "repos/$REPO_OWNER/$REPO_NAME/pages" -f build_type=workflow 2>&1)" || true
      echo "$pages_out"
      if [[ "$pages_out" == *'"build_type"'* ]] || [[ "$pages_out" == *'"status"'* ]]; then
        pages_enabled=true
      else
        errors+=("Pages API enable failed: ${pages_out//$'\n'/; }")
      fi

      sleep 8
      run_json="$(gh run list --repo "$REPO_OWNER/$REPO_NAME" --limit 1 --json url,status,conclusion 2>/dev/null || true)"
      if [[ -n "$run_json" && "$run_json" != "[]" ]]; then
        workflow_run_url="$(echo "$run_json" | python3 -c 'import json,sys; print(json.load(sys.stdin)[0].get("url",""))' 2>/dev/null || true)"
        workflow_result="$(echo "$run_json" | python3 -c 'import json,sys; r=json.load(sys.stdin)[0]; print(f"{r.get(\"status\",\"\")}/{r.get(\"conclusion\",\"\")}")' 2>/dev/null || true)"
      fi

      curl_status="$(curl -sI -o /dev/null -w '%{http_code}' --max-time 15 "$PAGES_URL" 2>/dev/null || echo no_response)"
    else
      errors+=("Local clone directory missing after clone attempt: $TARGET_DIR")
    fi
  fi
fi

finished_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

export STARTED_AT="$started_at" FINISHED_AT="$finished_at" REPO="$REPO_OWNER/$REPO_NAME"
export REPO_URL="$repo_url" REPO_CREATED="$repo_created" PRIVATE_STATUS="$private_status"
export COMMIT_SHA="$commit_sha" PAGES_ENABLED="$pages_enabled"
export WORKFLOW_RUN_URL="$workflow_run_url" WORKFLOW_RESULT="$workflow_result"
export PAGES_URL="$PAGES_URL" CURL_STATUS="$curl_status" GH_ACCOUNT="$gh_account"
export FILES_COPIED="${files_copied[*]:-}"
export ERRORS="${errors[*]:-}"

python3 <<'PY'
import json, os

def as_bool(s):
    return str(s).lower() == "true"

files = [f for f in os.environ.get("FILES_COPIED", "").split() if f]
errs = [e for e in os.environ.get("ERRORS", "").split("; ") if e]

priv = os.environ.get("PRIVATE_STATUS", "unknown")
if priv in ("true", "false"):
    private = priv == "true"
else:
    private = priv

result = {
    "startedAt": os.environ["STARTED_AT"],
    "finishedAt": os.environ["FINISHED_AT"],
    "repo": os.environ["REPO"],
    "repoUrl": os.environ["REPO_URL"],
    "repoCreated": as_bool(os.environ["REPO_CREATED"]),
    "private": private,
    "commitSha": os.environ.get("COMMIT_SHA", ""),
    "filesCopied": files,
    "pagesEnabled": as_bool(os.environ["PAGES_ENABLED"]),
    "workflowRunUrl": os.environ.get("WORKFLOW_RUN_URL", ""),
    "workflowResult": os.environ.get("WORKFLOW_RESULT", ""),
    "pagesUrl": os.environ["PAGES_URL"],
    "curlStatus": os.environ.get("CURL_STATUS", ""),
    "errors": errs,
    "executedBy": "18-devops-platform (Paz) via pci-17b-cake-recipe-push.sh on Cursor Cloud",
    "ghAccount": os.environ.get("GH_ACCOUNT", "unknown"),
}
print(json.dumps(result, indent=2, ensure_ascii=False))
PY
