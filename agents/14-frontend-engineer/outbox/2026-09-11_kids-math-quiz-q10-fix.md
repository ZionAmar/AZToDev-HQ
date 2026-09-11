# kids-math-quiz Q10 fix — buildQuestions always returns 10

**Bet:** PCI-KMG-01 · Linear EMET-167 · From: Noa (00-ceo)
**Bug:** Q10 crash — `questions[9]` undefined when pool exhausted (9 templates, 0 extras)

## Root cause

`QUESTION_POOL` has exactly 9 entries (3 ops × 3 diffs). `buildQuestions()` picks all 9 via
`picked`, then tries `extra = filter(!picked).slice(0,1)` → empty. Result: 9 questions, not 10.
React app crashes on Q10 with `undefined.answer`.

## Fix

`quizEngine.js`: after assembling `picked + extra`, **pad** with random pool templates until
length ≥ `TOTAL_QUESTIONS` (10), then slice and map.

```js
while (templates.length < TOTAL_QUESTIONS) {
  templates.push(QUESTION_POOL[rand(0, QUESTION_POOL.length - 1)]);
}
```

## Verified

- `node --test src/quizEngine.test.js` — **200 stochastic runs, 0 failures**
- `npm run build` — succeeded
- Bundle copied to `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/`

## Bundle hashes (publish target)

| File | SHA-256 |
|------|---------|
| `assets/index-D5JqcgtH.js` | `e10ba05a544d64418bc5b31b9ad1fc5a2d871e7e2d9e12f411ea1b309b00cccc` |
| `index.html` | `2529e10c518a71d13c46c9e86e384839064a61b917041983a90461541ccc0a55` |

## Live vs fixed (not yet republished)

| | Bundle | JS SHA-256 |
|---|--------|------------|
| **Live** (2026-09-11T08:20Z) | `index-mKCXMWMT.js` | `51bc94e14ed9ecade002e03eb68d344114d23b5418a02278283414b72f22f8e6` |
| **Fixed** (this run) | `index-D5JqcgtH.js` | `e10ba05a544d64418bc5b31b9ad1fc5a2d871e7e2d9e12f411ea1b309b00cccc` |

Live URL still serves pre-fix bundle. Cloud token: `push:false` on `ZionAmar/kids-math-quiz`.

## Next

Republish bundle root to `ZionAmar/kids-math-quiz` `main`, verify live hash matches
`e10ba05a…`, then QA re-run.

HANDOFF:
- done: Q10 pool-exhaustion fix, 200-run test pass, bundle rebuilt with new hash
- next: Push bundle to kids-math-quiz repo; confirm live SHA; queue 20-qa-sdet for EMET-167 re-QA
- files: agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/, agents/34-pc-ops/inbox/2026-09-11_kids-math-quiz-q10-republish.md

DELEGATE: 34-pc-ops | GITHUB_STATIC_PUBLISH republish kids-math-quiz bundle (Q10 fix) — verify live JS hash e10ba05a…

LEARNING:
- do: Stochastic node:test (200 runs) on buildQuestions before claiming Q10 fixed
- dont: Assume slice(0, 10) on a 9-item array is safe — pad explicitly when pool < TOTAL
- note: Fix+rebuild done in HQ; live still old hash 51bc94e…; Nadav/desk republish queued (PC ONLINE)
