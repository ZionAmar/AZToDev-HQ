# PCI-17b — Unified cake-recipe-demo push (Cloud run)

**Date:** 2026-09-10T23:02Z · **Owner:** 18-devops-platform (Paz)  
**Task:** Run `node ops/scripts/pci-17b-unified-push.mjs` from HQ — create `ZionAmar/cake-recipe-demo` (private), push 7-file bundle, enable Pages, report JSON.

## Export bundle — verified 7/7

Staged at `ops/exports/cake-recipe-demo/`:

| File | Status |
|------|--------|
| `index.html` | OK |
| `styles.css` | OK |
| `README.md` | OK |
| `Dockerfile` | OK |
| `.dockerignore` | OK |
| `.github/workflows/pages.yml` | OK |
| `PAGES_SETUP.md` | OK |

Sources merged from `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/` (3) + `ops/staging/cake-recipe-demo/` (4).

## Script execution

```bash
node ops/scripts/pci-17b-unified-push.mjs
# exit code: 5
```

**Auth tried:**
- `git credential fill` → empty (no founder creds in Cloud)
- `gh auth status` → logged in as `cursor` (GitHub App integration token)
- `gh api user` → 403 Resource not accessible by integration
- `gh secret list` → 403 (cannot read repo secrets from integration)
- `GITHUB_TOKEN` env → not set

**Live repo probe:** `gh api repos/ZionAmar/cake-recipe-demo` → **404 Not Found** (repo does not exist yet).

## Full JSON report

```json
{
  "at": "2026-09-10T23:02:06.305Z",
  "task": "PCI-17b",
  "repo": "ZionAmar/cake-recipe-demo",
  "exportDir": "ops/exports/cake-recipe-demo",
  "exportVerify": {
    "ok": true,
    "missing": [],
    "count": 7
  },
  "push": {
    "ok": false
  },
  "commitSha": null,
  "repoPrivate": null,
  "pagesEnable": {
    "ok": false
  },
  "workflow": {
    "ok": false
  },
  "curl": {
    "url": "https://zionamar.github.io/cake-recipe-demo/",
    "statusCode": 404,
    "ok": true,
    "stderr": ""
  },
  "errors": [
    "repo_create_failed: Resource not accessible by integration (Cloud GitHub App cannot mutate founder personal repos — delegate 34-pc-ops)"
  ],
  "cloudAuth": {
    "gitCredential": false,
    "ghAccount": "✓ Logged in to github.com account cursor (/home/ubuntu/.config/gh/hosts.yml)"
  },
  "repoCreate": {
    "ok": false,
    "existed": false,
    "url": "https://github.com/ZionAmar/cake-recipe-demo",
    "error": "Resource not accessible by integration",
    "status": 403,
    "via": "gh"
  }
}
```

Also written to: `ops/reports/pci-17b-unified-push.json`

## Verdict

**Cloud slice done:** bundle + script staged on HQ branch `cursor/pci-17b-unified-push-95df`. Honest JSON captured — **push blocked** at repo-create (403 integration scope). No commit SHA, no workflow URL, Pages still 404.

**Next owner:** 34-pc-ops (founder `gh` token on PC). Packet already queued: `agents/34-pc-ops/inbox/2026-09-10_pci-17b-unified-cake-recipe-repo-devops-pages.md`.

**PC one-liner (when shell works):**
```powershell
cd C:\Users\amazi\Desktop\my_company
git pull
node ops/scripts/pci-17b-unified-push.mjs
```

If shell still broken (`0xC0000142`), use verbatim fallback in that inbox file — do not rely on `git pull`.

---

HANDOFF:
- done: Verified 7/7 export bundle; ran pci-17b-unified-push.mjs; captured full honest JSON (403 repo-create); staged export+script+report on HQ branch.
- next: Nadav runs same script on founder PC with founder `gh` auth — or manual steps in PCI-17b inbox packet.
- files: `ops/exports/cake-recipe-demo/*`, `ops/scripts/pci-17b-unified-push.mjs`, `ops/reports/pci-17b-unified-push.json`, `agents/34-pc-ops/inbox/2026-09-10_pci-17b-unified-cake-recipe-repo-devops-pages.md`

DELEGATE: 34-pc-ops | After `git pull` on HQ main (or verbatim fallback if shell broken): `node ops/scripts/pci-17b-unified-push.mjs` — expect repo create + push + Pages workflow. Write outbox with commit SHA, workflow run URL, curl status.

LEARNING:
- do: Stage `ops/exports/<repo>/` + unified script on HQ; run Cloud script first for honest JSON before PC handoff
- dont: Claim push succeeded when POST /user/repos → 403 integration scope
- note: PCI-17b bundle+script committed to HQ branch; Cloud blocked at repo-create; Nadav queued
