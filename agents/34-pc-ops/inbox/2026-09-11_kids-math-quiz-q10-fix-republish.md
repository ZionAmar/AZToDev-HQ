# kids-math-quiz Q10 fix — GITHUB_STATIC_PUBLISH (republish)

**Date:** 2026-09-11 · **Owner:** 34-pc-ops (נדב) / desk auto-push bridge · **Priority:** High — live site crashes on Q10
**Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167) · **From:** 14-frontend-engineer (דפנה)
**Bug:** `buildQuestions()` returned 9/10 questions (9-template pool exhausted) → Q10 `undefined.answer` crash on live.

## Task — `GITHUB_STATIC_PUBLISH` (update existing repo)

```
REPO:       ZionAmar/kids-math-quiz  (already exists, has_pages:true)
SOURCE:     agents/14-frontend-engineer/outbox/kids-math-quiz-bundle
VISIBILITY: public (unchanged)
```

1. Push **root-level built files** from `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` to `main`:
   - `index.html`, `assets/index-DvS1Apys.js`, `assets/index-BqF1Ss2t.css`, `favicon.svg`, `icons.svg`
   - **Do not push `source/`** — that's editable React source, not the site.
2. Remove stale asset `assets/index-mKCXMWMT.js` from repo if still present (old pre-fix bundle).
3. Verify live bundle changed:
   - `curl -sI https://zionamar.github.io/kids-math-quiz/assets/index-DvS1Apys.js` → `200`
   - Old hash `index-mKCXMWMT.js` should 404 or be gone from `index.html` references.
4. Smoke: open live URL, complete all 10 questions without crash.

## Fix evidence (14-frontend-engineer)

- Source fix: `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/src/quizEngine.js` — pad/repeat templates until exactly 10.
- Test: `node --test scripts/buildQuestions.test.mjs` — **200/200 stochastic runs pass**.
- New bundle SHA-256: `assets/index-DvS1Apys.js` → `d046a92d3d48ba2fcf8e114cf6dfcff61ca6193474e930a2ad64b6e8579e9137`
- Live (pre-fix) still serves: `index-mKCXMWMT.js` (verified curl 200 on old asset).

## Why Cloud cannot push

Cloud token gets `403 Permission denied to cursor[bot]` on `ZionAmar/kids-math-quiz` — same as initial publish. Use desk auto-push bridge or Nadav token.

## Definition of done

- [ ] `main` updated with new bundle (`index-DvS1Apys.js` referenced in `index.html`)
- [ ] `curl -I https://zionamar.github.io/kids-math-quiz/` → `200`
- [ ] Live JS hash matches `d046a92d3d48ba2fcf8e114cf6dfcff61ca6193474e930a2ad64b6e8579e9137`
- [ ] Outbox: `agents/34-pc-ops/outbox/2026-09-11_kids-math-quiz-q10-fix-republished.md`
- [ ] Notify `20-qa-sdet` to re-QA live after publish
