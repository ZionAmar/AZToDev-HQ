# PCI-17b — cake-recipe-demo unified push (Cloud attempt)

**Date:** 2026-09-10T21:50Z · **Owner:** 18-devops-platform (Paz) · **Task:** PCI-17b unified push  
**Linear:** [EMET-165](https://linear.app/my-company1460/issue/EMET-165)

## 1) Export bundle verification

`ops/exports/cake-recipe-demo/` was **missing** on Cloud snapshot (pre-`main` pull). Assembled **7/7** from `origin/main` via `git show`:

| File | Status |
|------|--------|
| `index.html` | ✓ |
| `styles.css` | ✓ |
| `README.md` | ✓ |
| `Dockerfile` | ✓ |
| `.dockerignore` | ✓ |
| `.github/workflows/pages.yml` | ✓ |
| `PAGES_SETUP.md` | ✓ |

Sources: `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/*` (3) + `ops/staging/cake-recipe-demo/*` (4).

## 2) Script run

`ops/scripts/pci-17b-unified-push.mjs` did **not exist** on `main` — created on branch `cursor/pci-17b-unified-push-89a5`, then executed:

```bash
node ops/scripts/pci-17b-unified-push.mjs
# exit 5
```

Full machine report: `ops/reports/pci-17b-unified-push.json`

## 3) Results (founder-ready)

| Check | Result |
|-------|--------|
| **Push** | **FAIL** — blocked at repo create (never reached git push) |
| **Commit SHA** | `null` (no repo) |
| **Repo private status** | N/A — `ZionAmar/cake-recipe-demo` **does not exist** (404) |
| **Pages enable** | **FAIL** — not attempted (no repo) |
| **Workflow run** | **FAIL** — no runs (repo absent) |
| **curl Pages URL** | **404** — `https://zionamar.github.io/cake-recipe-demo/` |

### Errors

- `POST /user/repos` via `gh` → **403** `Resource not accessible by integration`
- Cloud GitHub App (`cursor`) scoped to **AZToDev-HQ only** — cannot create/push founder personal repos (same class as PCI-14/PCI-16).

### Cloud auth snapshot

- `git credential fill`: empty (Linux Cloud — no PC credential helper)
- `gh auth`: logged in as `cursor` (GitHub App integration)

## 4) Next owner

**34-pc-ops (Nadav)** — PC heartbeat OFFLINE. Packet already queued:

`agents/34-pc-ops/inbox/2026-09-10_pci-17b-unified-cake-recipe-repo-devops-pages.md`

When Windows/shell is up: create private repo + copy 7 files (now also at `ops/exports/cake-recipe-demo/` on this branch after merge) + Pages toggle + verify curl 200.

Optional: run the same script locally on PC where `gh` uses founder token — it should succeed end-to-end.

---

DELEGATE: 34-pc-ops | Execute PCI-17b from inbox packet OR run `node ops/scripts/pci-17b-unified-push.mjs` on founder PC after merging `cursor/pci-17b-unified-push-89a5` — create `ZionAmar/cake-recipe-demo`, push 7 files, enable Pages (Settings → GitHub Actions), confirm workflow + curl 200.

HANDOFF:
- done: Verified/assembled 7-file export bundle; authored `pci-17b-unified-push.mjs`; ran Cloud attempt; wrote JSON report with full failure diagnostics.
- next: Nadav creates repo + push + Pages toggle on PC; then Uri (20-qa-sdet) QA live page.
- files: `ops/exports/cake-recipe-demo/*`, `ops/scripts/pci-17b-unified-push.mjs`, `ops/reports/pci-17b-unified-push.json`, this outbox.

LEARNING:
- do: Stage unified export under `ops/exports/` + automation script so PC can one-shot push when Cloud App lacks personal-repo scope.
- dont: Claim push/commit success when `gh api POST /user/repos` returns 403 on Cloud.
- note: PCI-17b Cloud run blocked at repo create; export bundle + script ready on branch for Nadav.
