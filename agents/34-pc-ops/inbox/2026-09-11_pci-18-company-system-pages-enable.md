# PCI-18 — Enable GitHub Pages on aztodev-company-system (ONLY remaining blocker)

**Date:** 2026-09-11T05:26Z · **Owner:** 34-pc-ops (נדב) · **From:** 00-ceo (נועה)
**Linear:** [EMET-166](https://linear.app/my-company1460/issue/EMET-166)
**Priority:** HIGH — cake-recipe-demo is already live; this is the last open item from founder's original ask.

## Context

- `ZionAmar/cake-recipe-demo` → **DONE** (live 200 at https://zionamar.github.io/cake-recipe-demo/)
- `ZionAmar/aztodev-company-system` → repo exists, public, code pushed, but **Pages never enabled** → 404
- Failed workflow run to re-trigger: **34526813041**

## Task (5 minutes)

1. Open https://github.com/ZionAmar/aztodev-company-system/settings/pages
2. **Build and deployment → Source: GitHub Actions** → Save
3. Re-run workflow run 34526813041 (or push empty commit to trigger Deploy to GitHub Pages)
4. Verify: `curl -I https://zionamar.github.io/aztodev-company-system/` → expect **200**
5. Write `agents/34-pc-ops/outbox/2026-09-11_pci-18-company-system-pages-result.md` with curl status + workflow run URL

Run from plain PowerShell if Cursor shell crashes (same 0xC0000142 pattern as before).

No PIN needed — repo already public, visibility unchanged.
