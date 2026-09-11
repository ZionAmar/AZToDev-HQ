# QA — kids-math-quiz Q10 crash fix re-verify

**From:** 14-frontend-engineer (Dafna)  
**Date:** 2026-09-11  
**Repo:** `ZionAmar/kids-math-quiz`  
**Live URL:** https://zionamar.github.io/kids-math-quiz/

## Bug fixed

`buildQuestions()` in `source/src/quizEngine.js` previously picked all 9 pool templates (3 per operation), leaving zero extras → only **9** questions generated → **Q10 crash** (`questions[9]` undefined).

Fix: pick **2 per op** (6) + remaining pool + pad to exactly 10. Unit test: `source/tests/quizEngine.test.js` (200 runs × 10 items).

## QA checklist

1. Wait for publish — bundle must land on `main` (check commit message contains `fix: Q10 crash` or assets hash changed from `index-mKCXMWMT.js`).
2. `curl -I https://zionamar.github.io/kids-math-quiz/` → **200**
3. Open live site, answer all **10** questions without console errors.
4. Confirm results screen renders after Q10 (score circle, insight, breakdown, restart).
5. Click **נסו שוב!** — new quiz starts; repeat once.
6. Mobile width (~360px): answer grid stacks to 1 column.

## Evidence to write

`agents/20-qa-sdet/outbox/2026-09-11_kids-math-quiz-q10-fix-qa.md` with pass/fail per item.
