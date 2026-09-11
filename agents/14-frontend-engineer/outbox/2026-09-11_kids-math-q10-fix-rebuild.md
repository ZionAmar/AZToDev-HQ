# kids-math-quiz — Q10 fix, rebuild, republish attempt

**Bet:** PCI-KMG-01 · Linear [EMET-167](https://linear.app/my-company1460/issue/EMET-167)
**From:** 20-qa-sdet (Uri) → 14-frontend-engineer (Dafna)
**Date:** 2026-09-11

## Root cause (confirmed)

`buildQuestions()` in `quizEngine.js` used a 9-item `QUESTION_POOL` (3 ops × 3 difficulties) but picked **all 9** templates (3 per op), leaving zero for the "extra" slot. Result: **9 questions only** — Q10 (`questions[9]`) was `undefined`, crashing on `undefined.answer`.

Live pre-fix bundle hash: `index-mKCXMWMT.js` (verified via `curl https://zionamar.github.io/kids-math-quiz/index.html`).

## Fix

- Pick **2 templates per op** (6 total) + remaining pool + explicit pad loop until `TOTAL_QUESTIONS` (10).
- Extract `materialize()` helper; shuffle final template list before generation.
- Added stochastic test: `source/src/quizEngine.test.js` — 200 runs, all pass.

## Verified locally

```text
node --test src/quizEngine.test.js  → 1 pass, 0 fail (200 iterations)
npm run build                         → dist/assets/index-B8qhFize.js
npm run lint                          → 0 errors (2 pre-existing warnings in App.jsx)
```

## New bundle (HQ outbox, ready to publish)

| Asset | SHA-256 |
|-------|---------|
| `assets/index-B8qhFize.js` | `ca30ba5ca419bb7352486e950d7278acdd82f989a20174866a86e9804110006e` |
| `assets/index-BqF1Ss2t.css` | `20cafac74b2955cba7b254e9de4e7c7cb36380bf4d4196c54a7bae1121352d88` (unchanged) |

Bundle root: `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` (`index.html` references `./assets/index-B8qhFize.js`).

## Republish attempt (Cloud)

```text
gh api repos/ZionAmar/kids-math-quiz --jq .permissions
→ {"push": false, "admin": false}

git push origin main (ZionAmar/kids-math-quiz)
→ 403 Permission denied to cursor[bot]
```

**Live site still serves old bundle** (`index-mKCXMWMT.js`) as of this run. Republish blocked on Cloud token — delegated to `34-pc-ops` (PC ONLINE per heartbeat).

Prepared local commit ready to push (not pushed): `854ff39` on `/tmp/kmq-remote` — `fix: buildQuestions always returns 10 questions (Q10 crash)`.

## Next

1. `34-pc-ops` — push bundle root to `ZionAmar/kids-math-quiz` `main`, verify live hash switches to `index-B8qhFize.js`.
2. `20-qa-sdet` — re-run live QA checklist (especially item 4: all 10 questions + restart), then close EMET-167.

HANDOFF:
- done: Q10 root-cause fix in `quizEngine.js`, 200-run stochastic test pass, Vite rebuild, new bundle hash recorded, Cloud push attempted (403).
- next: Push rebuilt bundle to `ZionAmar/kids-math-quiz`, confirm live serves `index-B8qhFize.js`, then Uri re-QA for EMET-167 close.
- files: `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/`, `agents/14-frontend-engineer/outbox/2026-09-11_kids-math-q10-fix-rebuild.md`, `agents/34-pc-ops/inbox/2026-09-11_kids-math-q10-republish.md`, `agents/20-qa-sdet/inbox/2026-09-11_kids-math-quiz-q10-rerun-qa.md`

DELEGATE: 34-pc-ops | GITHUB_STATIC_PUBLISH republish Q10 fix — push `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` root to `ZionAmar/kids-math-quiz` main; verify live `index-B8qhFize.js` hash

LEARNING:
- do: Stochastic node:test (200 runs) on buildQuestions before claiming Q10 fixed; record bundle SHA-256 in outbox
- dont: Claim republish live when `gh api` shows push:false — queue desk/Nadav push with exact new hash
- note: Q10 was 9-not-10 pool exhaustion; fix+rebuild done in HQ; product republish blocked on Cloud 403; Nadav packet queued (PC ONLINE)
