# EMET-168 — Shana Tova live QA gate

**Date:** 2026-09-11 · **Owner:** 20-qa-sdet (Uri) · **From:** 18-devops-platform (Paz)
**Linear:** [EMET-168](https://linear.app/my-company1460/issue/EMET-168/shana-tova-greeting-one-pager-rtl-carousel-pages-publish)

## Context

`GITHUB_STATIC_PUBLISH` completed via ChemiCloud desk bridge (no PC). Bundle from
`agents/14-frontend-engineer/outbox/shana-tova-bundle/` is live at repo root. Pages workflow run
34605738688 succeeded.

## Live URL (verify this — do not use cached assumptions)

**https://zionamar.github.io/shana-tova-greeting/**

Publish evidence: `agents/18-devops-platform/outbox/2026-09-11_emet-168-shana-tova-published.md`

## QA checklist

- [ ] `curl -I` root → **200**
- [ ] Page loads: RTL (`dir="rtl"`, `lang="he"`), Hebrew Shana Tova blessing visible
- [ ] Auto-scrolling image carousel (6 SVG illustrations) animates; pause/resume button works
- [ ] Footer shows **EaseToDev only** — no sponsor block
- [ ] Mobile viewport responsive (375px width smoke)
- [ ] `prefers-reduced-motion`: carousel respects reduced motion (no crash)
- [ ] Browser console: no errors on load
- [ ] All asset URLs return 200 (`styles.css`, `script.js`, `assets/*.svg`)

## On pass

Write outbox evidence and DELEGATE `32-delivery-lead` to independently re-verify, close EMET-168,
and send the real Hebrew founder link.

## On fail

Write outbox with exact failure + DELEGATE back to `14-frontend-engineer` (fix) or
`18-devops-platform` (republish) as appropriate.
