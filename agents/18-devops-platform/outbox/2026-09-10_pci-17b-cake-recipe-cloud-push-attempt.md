# PCI-17b — cake-recipe-demo Cloud push attempt (Paz · 18-devops-platform)

**Date:** 2026-09-10T22:49Z · **Owner:** 18-devops-platform (Paz)  
**Task:** Execute PCI-17b unified push from Cursor Cloud — create `ZionAmar/cake-recipe-demo`, push 7 files, enable Pages, verify.

## סיכום (עברית — לנועה)

- **חבילה מוכנה ב-HQ:** `ops/exports/cake-recipe-demo/` — 7/7 קבצים (frontend + DevOps).
- **Cloud ניסה ליצור repo** — **נכשל 403** (`Resource not accessible by integration`). חשבון `gh` = `cursor`, לא `ZionAmar`.
- **`ZionAmar/cake-recipe-demo` עדיין 404.** Pages URL מחזיר **404**.
- **אין commit SHA** — לא נוצר repo.
- **המשך:** נדב מריץ `ops/scripts/pci-17b-cake-recipe-push.ps1` מ-PowerShell רגיל (לא טרמינל Cursor) — או `bash ops/scripts/pci-17b-cake-recipe-push.sh` אם יש לו gh מחובר ל-ZionAmar.

## Bundle verification (7/7)

| File | Path in HQ |
|------|------------|
| index.html | `ops/exports/cake-recipe-demo/index.html` |
| styles.css | `ops/exports/cake-recipe-demo/styles.css` |
| README.md | `ops/exports/cake-recipe-demo/README.md` |
| Dockerfile | `ops/exports/cake-recipe-demo/Dockerfile` |
| .dockerignore | `ops/exports/cake-recipe-demo/.dockerignore` |
| .github/workflows/pages.yml | `ops/exports/cake-recipe-demo/.github/workflows/pages.yml` |
| PAGES_SETUP.md | `ops/exports/cake-recipe-demo/PAGES_SETUP.md` |

Sources merged from `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/` + `ops/staging/cake-recipe-demo/`.

## Execution scripts added this run

| Platform | Script |
|----------|--------|
| Windows (Nadav) | `ops/scripts/pci-17b-cake-recipe-push.ps1` (from Keshet, prior run) |
| Linux/Cloud | `ops/scripts/pci-17b-cake-recipe-push.sh` (new this run) |

Both are idempotent: create repo → copy 7 files → commit → push → enable Pages API → check workflow + curl.

## Full JSON result (Cloud execution)

```json
{
  "startedAt": "2026-09-10T22:49:30Z",
  "finishedAt": "2026-09-10T22:49:31Z",
  "repo": "ZionAmar/cake-recipe-demo",
  "repoUrl": "https://github.com/ZionAmar/cake-recipe-demo",
  "repoCreated": false,
  "private": "unknown",
  "commitSha": "",
  "filesCopied": [],
  "pagesEnabled": false,
  "workflowRunUrl": "",
  "workflowResult": "",
  "pagesUrl": "https://zionamar.github.io/cake-recipe-demo/",
  "curlStatus": "404",
  "errors": [
    "gh repo create failed: GraphQL: Resource not accessible by integration (createRepository)"
  ],
  "executedBy": "18-devops-platform (Paz) via pci-17b-cake-recipe-push.sh on Cursor Cloud",
  "ghAccount": "cursor",
  "bundleReady": true,
  "bundlePath": "ops/exports/cake-recipe-demo/",
  "bundleFileCount": 7,
  "repoApiStatus": "404 Not Found"
}
```

## Pre-checks (live at execution time)

```bash
gh api repos/ZionAmar/cake-recipe-demo → 404 Not Found
curl -I https://zionamar.github.io/cake-recipe-demo/ → HTTP 404
gh auth status → account cursor (GitHub App integration, not founder)
```

## Blocker

Cloud GitHub App token cannot `createRepository` under `ZionAmar/*`. Same class as prior PCI-16/17 attempts. **Not a missing bundle problem** — bundle is staged and export path now exists in HQ git.

## Next owner

**34-pc-ops (Nadav)** — run from plain PowerShell (bypasses Cursor shell 0xC0000142):

```powershell
cd C:\Users\amazi\Desktop\my_company
git pull origin main
powershell -ExecutionPolicy Bypass -File ops\scripts\pci-17b-cake-recipe-push.ps1
```

Expected success JSON fields: `repoCreated: true`, `private: true`, non-empty `commitSha`, `pagesEnabled: true`, workflow run URL, `curlStatus: "200"`.

DELEGATE: 34-pc-ops | Run `ops/scripts/pci-17b-cake-recipe-push.ps1` from plain PowerShell with founder `gh` auth; write `agents/34-pc-ops/outbox/2026-09-10_pci-17b-cake-recipe-unified-result.md` with success JSON.

HANDOFF:
- done: Consolidated 7-file bundle at `ops/exports/cake-recipe-demo/`; added Linux push script; executed Cloud attempt with honest 403 JSON; verified repo still 404 and Pages URL 404.
- next: Nadav creates repo + push + Pages enable with founder credentials; QA after curl 200.
- files: `ops/exports/cake-recipe-demo/*`, `ops/scripts/pci-17b-cake-recipe-push.sh`, `ops/scripts/pci-17b-cake-recipe-push.ps1`, `agents/34-pc-ops/inbox/2026-09-10_pci-17b-unified-cake-recipe-repo-devops-pages.md`

LEARNING:
- do: Stage unified export at `ops/exports/<repo>/` + bash/ps1 pair so Cloud runs honest JSON before PC handoff
- dont: Claim push succeeded from Cloud when `createRepository` returns 403 integration scope
- note: PCI-17b bundle ready in HQ; Cloud blocked on repo create; Nadav queued with working ps1 path
