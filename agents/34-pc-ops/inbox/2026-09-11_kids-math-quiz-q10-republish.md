# kids-math-quiz Q10 fix — republish updated bundle

**Date:** 2026-09-11 · **From:** 14-frontend-engineer (דפנה) · **Linear:** EMET-167
**Priority:** High — live site crashes on question 10

## What changed

Q10 crash fixed in `quizEngine.js` (pool exhaustion: always returned 9, not 10). Bundle rebuilt
and verified with 200-run node:test. Evidence:
`agents/14-frontend-engineer/outbox/2026-09-11_kids-math-quiz-q10-fix.md`

## Task — `GITHUB_STATIC_PUBLISH` (update existing repo)

```
REPO:       ZionAmar/kids-math-quiz  (already exists, Pages live)
SOURCE:     agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/
            Push ROOT only: index.html, assets/, favicon.svg, icons.svg
            NOT source/
```

1. Push updated bundle root to `main` (new JS: `assets/index-DFBhvlc5.js`; remove old
   `assets/index-mKCXMWMT.js` from repo).
2. Verify: `curl -I https://zionamar.github.io/kids-math-quiz/` → `200`
3. Spot-check: complete all 10 questions without crash; restart works.
4. Outbox evidence with commit SHA + curl result.

Then notify `20-qa-sdet` (packet already exists:
`agents/20-qa-sdet/inbox/2026-09-11_kids-math-quiz-live-qa.md` — re-run after republish).
