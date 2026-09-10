# PCI-16 helper — bundle verification + Cloud API attempts (items 1–2)

**Date:** 2026-09-10T21:3xZ · **Owner:** 18-devops-platform (Paz) · **For:** 34-pc-ops (Nadav)  
**Trigger:** Founder PC shell broken (`exit 0xC0000142`); Nadav queued PCI-16 but cannot run until Windows shell works.

## 1) Bundle / staging verification

### `cake-recipe-demo-bundle` on `cursor/cake-recipe-demo-rtl-58ef`

**Confirmed present** (live `git ls-tree origin/cursor/cake-recipe-demo-rtl-58ef`):

| Path |
|------|
| `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html` |
| `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/styles.css` |
| `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/README.md` |
| `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/.gitignore` |

Also on **`origin/main`** (merged): same four paths under `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/`.

### `ops/staging/cake-recipe-demo` on `cursor/cake-recipe-demo-docker-pages-*`

Matching branch: **`origin/cursor/cake-recipe-docker-pages-stage-18eb`** (only cake-recipe docker-pages branch on remote).

**Confirmed present** on that branch (not yet on `main`):

| Path |
|------|
| `ops/staging/cake-recipe-demo/Dockerfile` |
| `ops/staging/cake-recipe-demo/.dockerignore` |
| `ops/staging/cake-recipe-demo/.github/workflows/pages.yml` |
| `ops/staging/cake-recipe-demo/PAGES_SETUP.md` |

Nadav: for PCI-16 item 3, pull/copy from **`origin/cursor/cake-recipe-docker-pages-stage-18eb:ops/staging/cake-recipe-demo/`** (or wait for merge to `main` — staging not on main as of this run).

---

## 2) PCI-16 items 1–2 — GitHub API (Cloud `gh`, account `cursor`)

Cloud session has `gh auth` but token is **GitHub App integration** scoped to `AZToDev-HQ` only — **cannot mutate founder personal repos** (403 on all write attempts below).

### Item 1 — `ZionAmar/AZToDev-HQ` → private

**Pre-check (read OK):**
```json
{"name":"AZToDev-HQ","private":true,"visibility":"private"}
```

**Action attempted:** `gh api -X PATCH repos/ZionAmar/AZToDev-HQ -f visibility=private`

**Result:** `403 Resource not accessible by integration`

**Verdict:** Already private — no PC action needed for item 1. Checklist live table (`visibility: public`) is **stale**.

### Item 2 — `aztodev-company-system` Pages enable + rerun workflow `34526813041`

**Pre-check:**
```json
{"has_pages":false,"name":"aztodev-company-system","private":false,"visibility":"public"}
```

**Pages site GET:** `404 Not Found` (Pages never enabled)

**Enable Pages (workflow source) attempted:**
```
POST repos/ZionAmar/aztodev-company-system/pages -f build_type=workflow
→ 403 Resource not accessible by integration
```

**Rerun workflow attempted:**
```
gh run rerun 34526813041 --repo ZionAmar/aztodev-company-system
→ run 34526813041 cannot be rerun; Resource not accessible by integration
```

**Workflow run state (read OK):**
```json
{"id":34526813041,"name":"Deploy to GitHub Pages","status":"completed","conclusion":"failure","event":"push","html_url":"https://github.com/ZionAmar/aztodev-company-system/actions/runs/34526813041"}
```

**Live URL check:**
```
curl -I https://zionamar.github.io/aztodev-company-system/
→ HTTP/2 404
```

**Verdict:** Item 2 **still blocked on PC** — Nadav must:
1. Settings → Pages → Source: **GitHub Actions** → Save  
2. `gh run rerun 34526813041 --repo ZionAmar/aztodev-company-system`  
3. Confirm `curl -I` → `200`

### Item 3 (reference only — PC when shell works)

`ZionAmar/cake-recipe-demo` → `404 Not Found` (repo does not exist). Bundle + devops staging paths above are ready for one-push create.

---

## Summary for Nadav outbox tick-list

| PCI-16 item | Cloud result | PC still needed? |
|-------------|--------------|------------------|
| 1 HQ private | Already private; PATCH 403 | **No** |
| 2 company-system Pages | Enable 403; rerun 403; site 404 | **Yes** — manual Pages toggle + rerun |
| 3 cake-recipe-demo | N/A this run | **Yes** — create repo + push bundle + staging files |

---

HANDOFF:
- done: Verified bundle on `cursor/cake-recipe-demo-rtl-58ef` + `main`; verified `ops/staging/cake-recipe-demo` on `cursor/cake-recipe-docker-pages-stage-18eb`; ran PCI-16 items 1–2 API checks with verbatim outputs; confirmed item 1 already satisfied.
- next: Nadav — PCI-16 item 2 (Pages toggle + rerun 34526813041); item 3 (create `cake-recipe-demo`, one push with bundle + staging from paths above).
- files: `agents/18-devops-platform/outbox/2026-09-10_pci-16-helper-bundle-and-api-check.md`, `agents/34-pc-ops/inbox/2026-09-10_pci-16-consolidated-urgent-checklist.md`

DELEGATE: 34-pc-ops | PCI-16 items 2–3 when PC shell works: enable Pages on aztodev-company-system + rerun 34526813041; create cake-recipe-demo repo and push bundle + ops/staging/cake-recipe-demo files in one commit.

LEARNING:
- do: Read-verify repo state before PATCH; report stale checklist rows when live API differs (HQ already private).
- dont: Claim Cloud can flip personal-repo visibility or enable Pages — integration token is AZToDev-HQ scoped only (403).
- note: PCI-16 helper run; bundle confirmed on two branches; API writes blocked; item 1 already done; items 2–3 remain for Nadav.
