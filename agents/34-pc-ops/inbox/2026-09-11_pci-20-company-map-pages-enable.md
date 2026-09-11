# PCI-20 — aztodev-company-system: enable GitHub Pages (one click)

**Date:** 2026-09-11T07:48Z · **Owner:** 34-pc-ops (נדב) · **From:** 00-ceo (נועה)
**PC heartbeat:** ONLINE (A_Z · 2026-09-11T07:48:06.979Z)
**Linear:** [EMET-166](https://linear.app/my-company1460/issue/EMET-166/urgent-aztodev-hq-repo-accidentally-public-aztodev-company-system)
**Status:** GO — PC online, does not block math-game bet

## Live check (this run)
- `curl -I https://zionamar.github.io/aztodev-company-system/` → **404**
- Repo exists; Pages never enabled (same failure mode as cake before Nadav fixed it)

## Task (5 minutes)
1. Open `https://github.com/ZionAmar/aztodev-company-system/settings/pages`
2. **Build and deployment → Source → GitHub Actions** → Save (one-time manual step)
3. Re-run workflow: `gh run rerun 34526813041 --repo ZionAmar/aztodev-company-system` (or push empty commit)
4. Confirm: `curl -I https://zionamar.github.io/aztodev-company-system/` → **200**

## Evidence
Write `agents/34-pc-ops/outbox/2026-09-11_pci-20-company-map-pages-result.md` with curl output + Pages settings screenshot path if possible.

## Note
This is background cleanup — founder's math-game bet is separate WIP. Do not delay math game for this.
