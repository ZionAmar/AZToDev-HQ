# kids-math-quiz Q10 fix — buildQuestions padding + rebuild

**Bet:** PCI-KMG-01 · Linear `EMET-167` · From: Noa (00-ceo)
**Bug:** Live quiz crashes on Q10 — `buildQuestions()` returned 9 items (9-template pool: 3×add + 3×sub + 3×mul; `extra` slice always empty).

## Root cause

`QUESTION_POOL` has exactly 9 templates. Algorithm picked all 9 into `picked`, leaving zero for `extra`. Result: 9 questions → `questions[9]` is `undefined` → crash on `.answer`.

## Fix

`agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/src/quizEngine.js`:

- After primary pick, **pad by cycling shuffled `QUESTION_POOL`** until `templates.length >= TOTAL_QUESTIONS` (10).
- Each padded slot still calls `t.gen()` so questions remain unique instances with fresh numbers.

## Verified

```bash
cd agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source
npm install
node --test scripts/buildQuestions.test.mjs   # 200/200 pass
npm run build
npm run lint                                   # 0 errors (2 pre-existing warnings in App.jsx)
```

- **200/200 stochastic simulations pass** — every run returns exactly 10 valid questions with text, numeric answer, op, and 4 options including correct answer.
- Rebuilt bundle copied to `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` root.

## Bundle hashes

| File | SHA-256 |
|------|---------|
| `assets/index-DvS1Apys.js` (new) | `d046a92d3d48ba2fcf8e114cf6dfcff61ca6193474e930a2ad64b6e8579e9137` |
| `index.html` | `f73f2b750f4236b0139734a607106f9e528bb5d297ac4718f2827eaf080ac183` |

## Live status (pre-publish)

- **Live URL:** https://zionamar.github.io/kids-math-quiz/ — still serves **pre-fix** bundle `assets/index-mKCXMWMT.js` (curl 200, last-modified 2026-09-11T08:20:39Z).
- **Cloud push attempt:** `403 Permission denied to cursor[bot]` on `ZionAmar/kids-math-quiz` — expected, same as initial publish.

## Not done here

Republish to GitHub Pages — delegated to desk/`34-pc-ops` via `GITHUB_STATIC_PUBLISH` packet.

HANDOFF:
- done: Fixed `buildQuestions()` padding, 200/200 test pass, rebuilt bundle with new JS hash documented above.
- next: Push bundle root to `ZionAmar/kids-math-quiz` `main`, verify live serves `index-DvS1Apys.js`, then queue `20-qa-sdet` for re-QA.
- files: `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` (built root + `source/`), `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/scripts/buildQuestions.test.mjs`, `agents/34-pc-ops/inbox/2026-09-11_kids-math-quiz-q10-fix-republish.md`

DELEGATE: 34-pc-ops | GITHUB_STATIC_PUBLISH — push rebuilt bundle from `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` to `ZionAmar/kids-math-quiz` per `agents/34-pc-ops/inbox/2026-09-11_kids-math-quiz-q10-fix-republish.md`; verify live hash `d046a92d…`; then DELEGATE 20-qa-sdet for live re-QA on EMET-167.

LEARNING:
- do: Stochastic node:test (200 runs) on `buildQuestions()` + record bundle SHA-256 before handoff — catches pool-exhaustion bugs that deterministic tests miss.
- dont: Claim republish live when live still serves pre-fix `index-mKCXMWMT.js` or Cloud push returns 403.
- note: Q10 was 9-not-10 pool exhaustion; fix+rebuild in HQ outbox; live still old hash; desk/Nadav republish packet queued.
