# Enable GitHub Pages — kids-math-quiz + aztodev-company-system (desk GITHUB_TOKEN)

**Ran at:** 2026-09-11T08:2xZ  
**Owner:** 18-devops-platform (Paz)  
**Method:** ChemiCloud desk `GITHUB_TOKEN` via SSH (same bridge path as cake-recipe-demo — not Cloud integration token, not 34-pc-ops)

## Task

Enable GitHub Pages on `ZionAmar/kids-math-quiz` and `ZionAmar/aztodev-company-system`, re-run failed workflows, verify both Pages URLs return HTTP 200.

## Pre-check (Cloud integration token — read-only)

| Repo | `has_pages` | Pages URL curl | Notes |
|------|-------------|----------------|-------|
| `kids-math-quiz` | `true` | `200` | Already live (desk publish at 08:17Z, workflow `34578459070` success) |
| `aztodev-company-system` | `false` | `404` | Workflow `34526813041` failed: Pages not enabled (`configure-pages@v5` → Not Found) |

Cloud `gh api -X POST .../pages` → `403 Resource not accessible by integration` (expected — integration token cannot mutate personal-repo Pages).

## Action (desk GITHUB_TOKEN)

SSH to ChemiCloud desk (`~/aztodev-desk/.env` — `GITHUB_TOKEN` present, len=40). Node script:

1. **kids-math-quiz** — Pages already configured (`build_type: workflow`). No change needed.
2. **aztodev-company-system** — `POST /repos/ZionAmar/aztodev-company-system/pages` with `{ build_type: "workflow" }` → **201 Created**
3. **Re-run** — `POST .../actions/runs/34526813041/rerun` → **201 Created**

## Post-check (live)

| Check | Result |
|-------|--------|
| `kids-math-quiz` Pages config | `build_type: workflow`, `https://zionamar.github.io/kids-math-quiz/` |
| `aztodev-company-system` Pages config | `build_type: workflow`, `https://zionamar.github.io/aztodev-company-system/` |
| Workflow `34526813041` | `status: completed`, `conclusion: success` |
| `curl -I https://zionamar.github.io/kids-math-quiz/` | **200** |
| `curl -I https://zionamar.github.io/aztodev-company-system/` | **200** |

## Hebrew summary (for Noa → ציון)

שני האתרים חיים:

- **משחק מתמטיקה:** https://zionamar.github.io/kids-math-quiz/ — כבר היה מוכן, אימתתי 200
- **מפת מערכת AZToDev:** https://zionamar.github.io/aztodev-company-system/ — הדלקתי GitHub Pages דרך טוקן הדסק (לא דרך המחשב שלך), הרצתי מחדש את ה-workflow שנכשל, עכשיו 200

EMET-166 (Pages blocker) — נפתר מבחינת פרסום. QA על cake-recipe-demo ו-EMET-167 נשארים בנפרד.

---

LEARNING:
- do: When Cloud integration token gets 403 on Pages POST, SSH to ChemiCloud desk and use `GITHUB_TOKEN` from `~/aztodev-desk/.env` with a node fetch script — same proven path as cake-recipe-demo desk auto-push, works with PC off
- dont: Delegate Pages-enable to 34-pc-ops when desk token is available — founder rule and company lesson both say pure GitHub must not wait on PC heartbeat
- note: kids-math-quiz was already live; only aztodev-company-system needed Pages API enable + workflow rerun 34526813041; both URLs verified 200
