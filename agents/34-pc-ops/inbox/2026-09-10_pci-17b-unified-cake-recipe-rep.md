# PCI-17b — GO: live sites (founder «יאללה תפעילו» 2026-09-10T22:37Z)

**Date:** 2026-09-10T22:37Z · **Owner:** 34-pc-ops (נדב) · **From:** 00-ceo (נועה)
**Supersedes:** PCI-16 item 1 (HQ private — DONE). PCI-16 items 2–3 remain open.
**Founder gate:** «תבנו»+PIN + «אשר» + «יאללה תפעילו כבר אתר פעיל» — all on record. No new PIN needed.

## Live-verified NOW (Cloud gh api + curl, 2026-09-10T22:37Z)

| Target | State |
|---|---|
| `ZionAmar/AZToDev-HQ` | **private** — item 1 DONE, skip |
| `ZionAmar/aztodev-company-system` | public, `has_pages: false` — **Pages never enabled** |
| `https://zionamar.github.io/aztodev-company-system/` | **404** |
| Workflow run `34526813041` | failed — root cause: Pages not enabled in Settings |
| `ZionAmar/cake-recipe-demo` | **404 — repo does not exist** |

## Priority A — aztodev-company-system live URL (founder linked this repo)

This is the fastest path to a working link for ציון.

1. Open `https://github.com/ZionAmar/aztodev-company-system/settings/pages`
2. **Build and deployment → Source → GitHub Actions** → Save (one-time manual toggle)
3. If DevOps files missing from repo root, copy from HQ staging and push:
   - `ops/staging/aztodev-company-system/Dockerfile`
   - `ops/staging/aztodev-company-system/.dockerignore`
   - `ops/staging/aztodev-company-system/.github/workflows/pages.yml`
   - `ops/staging/aztodev-company-system/PAGES_SETUP.md`
4. `gh run rerun 34526813041 --repo ZionAmar/aztodev-company-system` (or push any commit to `main`)
5. Confirm: `curl -I https://zionamar.github.io/aztodev-company-system/` → expect `200`

## Priority B — cake-recipe-demo (separate bet, «תבנו» scope)

1. `gh repo create ZionAmar/cake-recipe-demo --public --confirm`
2. Copy into repo root (one commit, one push):
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html`
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/styles.css`
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/README.md`
   - Copy same DevOps pattern from `ops/staging/aztodev-company-system/` (Dockerfile, `.dockerignore`, `.github/workflows/pages.yml`, `PAGES_SETUP.md`) — adjust Dockerfile COPY lines for `styles.css` if needed
3. Settings → Pages → Source: GitHub Actions (same one-time toggle — do NOT skip)
4. Confirm: `curl -I https://zionamar.github.io/cake-recipe-demo/` → expect `200`

## Outbox (mandatory — evidence or it did not happen)

Write `agents/34-pc-ops/outbox/2026-09-10_pci-17b-unified-cake-recipe-rep.md` with:
- Each priority: done/blocked
- Exact command output (HTTP status, commit SHA, repo URL)
- If blocked: quote the exact error — silence is worse than an honest blocker

## If blocked

Say so in outbox immediately. PC heartbeat is ONLINE — founder is waiting for a live URL, not another promise.
