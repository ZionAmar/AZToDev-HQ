# kids-math-quiz Q10 crash fix — bundle rebuilt, push queued

**Agent:** 14-frontend-engineer (Dafna)  
**Date:** 2026-09-11  
**Task from:** 20-qa-sdet  
**Product repo:** `ZionAmar/kids-math-quiz`  
**Live (pre-fix):** https://zionamar.github.io/kids-math-quiz/ (200 — still serving broken bundle until push lands)

## Root cause

Published React bundle (`assets/index-mKCXMWMT.js`) had `buildQuestions()` picking **3 templates per operation** across 3 ops (= all 9 pool items). The "extra" slice had **0** remaining templates → returned **9** questions. At Q10, `questions[9]` was `undefined` → crash.

Decompiled evidence from live bundle:
```javascript
// BUG: n.push(i[0], i[1], i[2]) × 3 ops = 9 picked, 0 left for extras
let r = g(h.filter(e => !n.includes(e))).slice(0, 1); // always []
return g([...n, ...r]).slice(0, 10) // returns 9 items
```

## Fix

Recreated source under `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/`:

| File | Change |
|------|--------|
| `source/src/quizEngine.js` | Pick **2 per op** (6) + remaining pool + pad loop → always **10** items; throw if length ≠ 10 |
| `source/tests/quizEngine.test.js` | 200× stochastic test asserting length === 10 |
| `source/src/App.jsx` | React UI (reconstructed from bundle) |

## Verification (local, this run)

```
cd agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source
npm install
npm test   → pass (200 runs)
npm run build → success
```

New bundle assets: `index-WwkPQBpJ.js`, `index-BmSn-oSn.css` copied to bundle root.

## Publish status

Cloud GitHub App: `permissions.push: false` on `ZionAmar/kids-math-quiz` (403 on clone/push).  
**Queued:** `agents/34-pc-ops/inbox/2026-09-11_kids-math-quiz-q10-fix-push.md` (PC ONLINE per heartbeat).

## QA handoff

**Queued:** `agents/20-qa-sdet/inbox/2026-09-11_kids-math-quiz-q10-fix-qa.md` — re-verify after publish.

---

HANDOFF:
- done: Fixed `quizEngine.js` buildQuestions (always 10 items), added length test, rebuilt Vite bundle, prepared publish packet
- next: 34-pc-ops pushes bundle to `ZionAmar/kids-math-quiz` main; then 20-qa-sdet runs Q10 completion QA on live URL
- files: `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/`, `agents/34-pc-ops/inbox/2026-09-11_kids-math-quiz-q10-fix-push.md`, `agents/20-qa-sdet/inbox/2026-09-11_kids-math-quiz-q10-fix-qa.md`

DELEGATE: 34-pc-ops | Push rebuilt bundle from `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` to `ZionAmar/kids-math-quiz` main — commit `fix: Q10 crash — buildQuestions always returns 10 items`, confirm Pages deploy + curl 200

LEARNING:
- do: Decompile live minified bundle to confirm root cause before rewriting source; add stochastic length test on buildQuestions
- dont: Claim republish done when Cloud token shows push:false — queue Nadav/desk push with one-liner
- note: Q10 crash was 9-not-10 pool exhaustion in React bundle; fix+test+rebuild done in HQ outbox, product push blocked on Cloud permissions
