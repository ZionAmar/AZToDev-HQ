# Pages enable — desk path only (NOT Nadav PC)

**Date:** 2026-09-11 · **Owner:** 18-devops-platform (פז) · **Priority:** URGENT — founder waiting
**From:** 00-ceo (נועה) · **Founder correction:** «למה בכלל צריך את נדב? הרי לא צריך מחשב בשביל זה» + «לא אמור להיות חסר כלום. תבדקו טוב יש את כל ההרשאות»

## Context (live-verified this run)

| Site | Repo | Push status | Pages | curl |
|------|------|-------------|-------|------|
| Cake (done) | `ZionAmar/cake-recipe-demo` | ✅ desk path 06:12Z | ✅ workflow success | 200 |
| Math game | `ZionAmar/kids-math-quiz` | ✅ pushed 08:17Z (React build on main) | ❌ not enabled | 404 |
| Company map | `ZionAmar/aztodev-company-system` | ✅ code on main | ❌ not enabled | 404 |

**Root cause:** `actions/configure-pages@v5` ran with default `enablement: false`. Workflow fails:
`Get Pages site failed … Please verify that the repository has Pages enabled`.

Cloud Cursor GitHub App: `POST /repos/.../pages` → **403 Resource not accessible by integration**.

**Correct path:** ChemiCloud desk `GITHUB_TOKEN` — same token that published `cake-recipe-demo` without Nadav's PC (see `ops/config/factory.json` pendingWork.cake-recipe-demo.liveFindings).

## Task

1. **Enable Pages** on both repos via desk token (Settings → Pages → GitHub Actions, OR API `POST /repos/{owner}/{repo}/pages` with `build_type: workflow`).
2. **Option A (preferred):** Push updated workflow with `enablement: true` on the Setup Pages step:
   ```yaml
   - name: Setup Pages
     uses: actions/configure-pages@v5
     with:
       enablement: true
   ```
   Staging templates updated in `ops/staging/*/`.github/workflows/pages.yml on this branch.
3. **Re-run** failed workflow runs:
   - `ZionAmar/kids-math-quiz` run `34578459070` (failure 08:17Z)
   - `ZionAmar/aztodev-company-system` run `34526813041` (failure 2026-09-10)
4. **Verify:**
   - `curl -I https://zionamar.github.io/kids-math-quiz/` → 200
   - `curl -I https://zionamar.github.io/aztodev-company-system/` → 200
5. **Outbox:** `agents/18-devops-platform/outbox/2026-09-11_pages-enabled-desk-path.md` with both URLs, curl output, method used.

## Do NOT

- Route to `34-pc-ops` — founder explicitly rejected PC for pure GitHub.
- Wait for PC heartbeat.
- If desk token missing → report loudly in outbox (not silent wait).

## Definition of done

- [ ] Both Pages URLs return 200
- [ ] Outbox evidence with curl + commit SHAs if workflow files changed
- [ ] Notify `32-delivery-lead` so founder gets math game link
