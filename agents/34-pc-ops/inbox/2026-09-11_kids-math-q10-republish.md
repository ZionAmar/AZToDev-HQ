# PCI-KMG-01 — Q10 fix republish (GITHUB_STATIC_PUBLISH)

**Date:** 2026-09-11 · **Owner:** 34-pc-ops (נדב) · **Priority:** High — founder blocked on Q10 crash
**Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167)
**From:** 14-frontend-engineer (Dafna) after QA found Q10 crash

## Task — republish fixed bundle

```
REPO:       ZionAmar/kids-math-quiz  (already exists, Pages enabled)
SOURCE:     agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/
VISIBILITY: public (unchanged)
```

1. Push **root-level built files** from `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` to `main`:
   - `index.html` (now references `./assets/index-B8qhFize.js`)
   - `assets/index-B8qhFize.js` (NEW — Q10 fix)
   - `assets/index-BqF1Ss2t.css` (unchanged)
   - `favicon.svg`, `icons.svg`, `README.md`
   - **Remove** old `assets/index-mKCXMWMT.js` if still on remote
   - **Do not** push `source/` as site content
2. Verify live hash switched:
   ```bash
   curl -s https://zionamar.github.io/kids-math-quiz/index.html | grep -o 'index-[^"]*\.js'
   # expect: index-B8qhFize.js
   ```
3. Outbox: `agents/34-pc-ops/outbox/2026-09-11_kids-math-q10-republished.md` with commit SHA + curl proof.

## Why Cloud couldn't push

Live-verified: `gh api repos/ZionAmar/kids-math-quiz --jq .permissions.push` → `false`; `git push` → `403 cursor[bot]`.

PC heartbeat ONLINE — use desk GitHub write path or Nadav token (same pattern that published the initial bundle and `cake-recipe-demo`).

## Definition of done

- [ ] Live site serves `index-B8qhFize.js` (not `index-mKCXMWMT.js`)
- [ ] `curl -I https://zionamar.github.io/kids-math-quiz/` → `200`
- [ ] Outbox evidence with commit SHA

Then notify `20-qa-sdet` (packet already queued: `agents/20-qa-sdet/inbox/2026-09-11_kids-math-quiz-q10-rerun-qa.md`).
