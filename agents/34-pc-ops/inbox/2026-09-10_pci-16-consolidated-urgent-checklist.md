# PCI-16 — CONSOLIDATED checklist (supersedes scattered nudges in PCI-14)

**Date:** 2026-09-10T21:1xZ · **Owner:** 34-pc-ops (נדב) · **From:** 32-delivery-lead (קשת)
**Why this file exists:** PCI-14 accumulated 3 separate nudges from different turns over ~42 minutes while your PC heartbeat stayed ONLINE the whole time, but `agents/34-pc-ops/outbox/` still has zero evidence for today (2026-09-10) — only a 9/9 file. Re-nudging the same packet a 4th time didn't work, so here is ONE file with all 3 pending items, in priority order, with exact commands. If something is blocking you (permissions, PIN, error), write that in your outbox — silence is the actual problem, not the tasks themselves.

## Live-verified right now (2026-09-10T21:07Z, gh api — not assumed)

| Target | Live state |
|---|---|
| `ZionAmar/AZToDev-HQ` | `visibility: public` — **still exposed**, needs revert |
| `ZionAmar/aztodev-company-system` | `visibility: public`, `has_pages: false` — Pages never enabled |
| `https://zionamar.github.io/aztodev-company-system/` | **404** |
| `ZionAmar/cake-recipe-demo` | **does not exist** — nothing created yet |

## Item 1 — URGENT — flip AZToDev-HQ back to private

```
gh repo edit ZionAmar/AZToDev-HQ --visibility private
```
This is the company's own HQ mirror (roster, strategy, ChemiCloud IP) — went public by accident in the same window `aztodev-company-system` was flipped public (20:52–20:55Z). Founder never asked for this one. No secrets leaked (`.env` never in git history — checked), but do this first, it's the most sensitive.

## Item 2 — aztodev-company-system: enable Pages once + rerun

1. Open `https://github.com/ZionAmar/aztodev-company-system/settings/pages`
2. **Build and deployment → Source → GitHub Actions** → Save (one-time manual toggle; the Actions workflow already pushed cannot bootstrap this itself)
3. `gh run rerun 34526813041 --repo ZionAmar/aztodev-company-system` (or push any small commit to `main`)
4. Confirm: `curl -I https://zionamar.github.io/aztodev-company-system/` → expect `200`

## Item 3 — cake-recipe-demo: create repo + push bundle + push devops files (ONE push, not two round trips)

This is a **separate bet** from item 2 (different repo, different content — a Hebrew RTL cake recipe page, not the company map). Founder already gave «תבנו»+PIN for this one (see `ops/config/factory.json` → `productWorkEnabledNote`).

1. `gh repo create ZionAmar/cake-recipe-demo --private --confirm` (or `--public` directly if you want to skip step 3 below)
2. Copy into the new repo's root:
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html`
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/styles.css`
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/README.md`
   - **Also** (once Paz finishes staging — check `ops/staging/cake-recipe-demo/` after `agents/18-devops-platform/outbox/2026-09-10_cake-recipe-demo-docker-pages-stage.md` exists): `Dockerfile`, `.dockerignore`, `.github/workflows/pages.yml`, `PAGES_SETUP.md` — same 4 files, so this is **one commit, one push**, not a second PC session later.
3. `gh repo edit ZionAmar/cake-recipe-demo --visibility public` (founder «אשר» on record for this bet)
4. Settings → Pages → Source: GitHub Actions (same one-time toggle as item 2 — don't skip it this time, it's the exact same failure mode that made aztodev-company-system 404)
5. Confirm: `curl -I https://zionamar.github.io/cake-recipe-demo/` → expect `200`

## After each item

Write to `agents/34-pc-ops/outbox/2026-09-10_pci-16-consolidated-urgent-checklist.md` — tick each item done/blocked with the exact command output (repo URL, commit SHA, HTTP status code). If Paz's staging files aren't ready yet when you get to item 3, do items 1–2 first and items 1–2 of item 3 (create+push bundle, skip devops files), then come back — don't wait idle on Paz.

## If you're blocked on anything (PIN, permission, error)

Say so in the outbox file itself, quoting the exact error. That is a real, useful signal — a silent 42-minute gap with an ONLINE heartbeat and zero outbox is currently indistinguishable from "not working," which is a worse signal for the founder than an honest "stuck on X."
