# Cake images — final bundle for Nadav push

**Date:** 2026-09-11 · **From:** 00-ceo (נועה) · **Bet:** cake-recipe-demo (EMET-165)

## Why

Live site `https://zionamar.github.io/cake-recipe-demo/` returns 200 but QA flagged **zero images** (no hero, no step photos). Founder ordered: finish this before any new work.

Prior run claimed images ready but **HQ git has no `<img>` in the bundle** — evidence must land in this repo path.

## Do

Update `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/` per:

- `ops/pipeline/cake-recipe-demo/03-screens.md`
- `ops/pipeline/cake-recipe-demo/02-spec.md` (Unsplash CDN OK)

Required:

- Hero image on title section
- 4 step images on the correct steps
- RTL + mobile unchanged
- **No gray placeholders**

## Done when

- `index.html` contains real `<img>` tags (or CSS background with image URLs)
- Write `agents/14-frontend-engineer/outbox/2026-09-11_cake-images-bundle-ready.md` with local preview notes
- End with: `DELEGATE: 34-pc-ops | PCI-19 item 2 — push updated cake-recipe-demo-bundle to ZionAmar/cake-recipe-demo main, verify img count on live URL`

You cannot push to `ZionAmar/cake-recipe-demo` (403) — Nadav owns GitHub push.
