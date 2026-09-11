# kids-math-quiz — live QA

**From:** 32-delivery-lead (קשת) · **Date:** 2026-09-11
**Bet:** `kids-math-quiz` (PCI-KMG-01) · **Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167/pci-kmg-01-kids-math-quiz-react-for-founder-ציון)
**Live URL:** https://zionamar.github.io/kids-math-quiz/
**Founder ask (verbatim):** «צרו לי משחק מתמטיקה קטן לילדים בריאקט ועשו הכל ותנו לי קישור בסוף לאתר»

## Why you're getting this now

Noa's dispatch this turn was "when [publish] confirms live URLs, send founder the link and queue Uri QA." Live-verified myself this run (not trusting a relay claim, not waiting for a written confirmation that never arrived):

- `gh api repos/ZionAmar/kids-math-quiz` → repo exists, `private:false`, `has_pages:true`, pushed `2026-09-11T08:17:29Z`
- `curl -I https://zionamar.github.io/kids-math-quiz/` → `HTTP/2 200`
- Page source: `<html lang="he" dir="rtl">`, `<title>שאלון מתמטיקה כיפי 🎯</title>`, hashed JS/CSS bundle loads from `./assets/`

Provenance note: this landed via the desk auto-push bridge (commit author `AZToDev`, same pattern as `cake-recipe-demo`/EMET-165 on 2026-09-11T06:12Z) — **not** a written confirmation from `34-pc-ops` (Nadav) or `18-devops-platform` (Paz). No outbox exists yet from either. Flagging so you don't assume a specialist manually verified it before you — you are the first real check.

## What to check

1. **Content correctness** — Hebrew RTL math quiz for ages ~6–10: addition/subtraction/multiplication, 10 questions, score + per-operation breakdown, personalized Hebrew insight at the end. No leftover placeholder/lorem/dev text. Reference source: `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/` (React/Vite source) and `agents/14-frontend-engineer/outbox/2026-09-11_kids-math-quiz-react-built.md` (spec/build notes).
2. **RTL rendering** — text direction, alignment, numerals-in-Hebrew-context, no mirrored icons.
3. **Responsive** — mobile-first per build notes (2-column grid collapsing to 1 column under 360px) + desktop; no overflow/broken layout.
4. **Gameplay correctness** — answer scoring is actually correct (right answer marked right, wrong marked wrong), question variety across the 3 operations, quiz doesn't get stuck/crash on last question or restart.
5. **Assets** — favicon/icons load (`./favicon.svg`, `./icons.svg`), no 404s in console/network tab, relative paths work at the `/kids-math-quiz/` subpath (this is a project-Pages site, not a user/org root site — a `base: '/'` bug would 404 all assets; verify it doesn't).
6. **Basic a11y/perf sanity** — no console errors, reasonable load time.

## Open note — not yours to decide, flag it

Repo visibility is **public** (required for GitHub Pages on the free tier, same as `cake-recipe-demo`). Confirm intent sits with ציון/00-ceo, not assumed — just note pass/fail; don't block QA on it.

## When done

Write your outbox report (pass/fail per item above). Once clean, `DELEGATE: 32-delivery-lead` so this closes EMET-167 on Linear. If you find real defects, `DELEGATE: 14-frontend-engineer` (דפנה) directly with the specific fix list — she owns the source under `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/`.
