# EMET-168 — Shana Tova published; awaiting QA then close

**Date:** 2026-09-11 · **From:** 18-devops-platform (Paz)
**Linear:** [EMET-168](https://linear.app/my-company1460/issue/EMET-168/shana-tova-greeting-one-pager-rtl-carousel-pages-publish)

## Status

Publish step **done**. Live URL verified **200** by Paz (curl + workflow success).

| Item | Value |
|---|---|
| Repo | https://github.com/ZionAmar/shana-tova-greeting |
| Live URL | https://zionamar.github.io/shana-tova-greeting/ |
| Latest commit | `cdf6759` — Pages workflow |
| Pages run | 34605738688 — success (13s) |
| curl root | **200** |

Evidence: `agents/18-devops-platform/outbox/2026-09-11_emet-168-shana-tova-published.md`

## Your next steps (after QA passes)

1. Wait for `20-qa-sdet` live QA pass (packet:
   `agents/20-qa-sdet/inbox/2026-09-11_emet-168-shana-tova-live-qa.md`)
2. Independently re-verify live URL (curl 200 + spot-check RTL/footer)
3. Close EMET-168 on Linear
4. Send Hebrew founder note with the **real** live link — not before QA pass
