# kids-math-quiz Q10 fix — `buildQuestions()` always returns 10

**Bet:** PCI-KMG-01 · Linear `EMET-167` · **From:** 20-qa-sdet (Q10 crash on last question)
**Live URL (pre-fix):** https://zionamar.github.io/kids-math-quiz/

## Root cause

`quizEngine.js` `buildQuestions()` picked **all 9** unique pool templates (3 ops × 3 difficulties)
then tried to add 1 more from the remainder — but the remainder was empty. Every call returned
**9 questions**, so Q10 (`questions[9]`) was `undefined` and React crashed on the last step.

Repro before fix: `200/200` runs returned length 9 (deterministic pool exhaustion, not random).

## Fix

After selecting one template per difficulty per operation, **pad with random pool reuse** until
`templates.length === TOTAL_QUESTIONS`. `gen()` produces fresh numbers on each call, so reusing a
template is safe.

Files changed:
- `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/src/quizEngine.js`
- `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/src/quizEngine.test.js` (new)
- `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/package.json` (`npm test`)
- Rebuilt bundle root: `index.html`, `assets/index-DFBhvlc5.js` (replaces `index-mKCXMWMT.js`)

## Verified

```text
cd agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source
npm install
npm test     → 1 pass, 200 stochastic runs, 0 fail
npm run lint → 0 errors (2 pre-existing warnings in App.jsx)
npm run build → success
python3 -m http.server 8765 (bundle root) → curl / and new JS → 200
```

## Not done here (republish blocked on Cloud token)

Cloud GitHub App token: `push:false` on `ZionAmar/kids-math-quiz`. Fixed bundle is in HQ outbox;
desk/PC must push bundle root to product repo, then re-queue QA.

HANDOFF:
- done: Q10 root-cause fix, 200-run node:test, Vite rebuild, local 200 serve check
- next: Push rebuilt bundle root to `ZionAmar/kids-math-quiz` `main`, verify live, re-queue `20-qa-sdet`
- files: `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` (root = publish payload)

DELEGATE: 34-pc-ops | GITHUB_STATIC_PUBLISH republish `ZionAmar/kids-math-quiz` from updated bundle root (`index.html`, `assets/index-DFBhvlc5.js`, drop old `index-mKCXMWMT.js`); curl live; then DELEGATE 20-qa-sdet for Q10 re-verify on https://zionamar.github.io/kids-math-quiz/

LEARNING:
- do: Stochastic node:test (200 runs) on buildQuestions before claiming Q10 fixed; decompile/count pool templates when length ≠ TOTAL
- dont: Assume slice(0, 10) on a 9-item array is safe — pad explicitly when pool < TOTAL
- note: React bundle had 9-not-10 pool exhaustion; fix+test+rebuild in HQ outbox; product push needs desk token
