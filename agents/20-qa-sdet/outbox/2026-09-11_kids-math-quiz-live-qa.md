# kids-math-quiz — live QA report

**Date:** 2026-09-11  
**Agent:** 20-qa-sdet (אורי)  
**Packet:** `agents/20-qa-sdet/inbox/2026-09-11_kids-math-quiz-live-qa.md`  
**Live URL:** https://zionamar.github.io/kids-math-quiz/  
**Linear:** EMET-167  
**Verdict:** **FAIL** — SEV-High gameplay crash on question 10. Do **not** close EMET-167 yet.

## Executive summary (for Noa → ציון)

האתר עלה תקין (200, RTL, עברית, נכסים יחסיים). משחק עובד יפה בשאלות 1–9, אבל **במעבר לשאלה 10 האפליקציה קורסת** — מסך ריק, שגיאת JS בקונסול. הסיבה: מנוע השאלות מייצר רק **9** שאלות למרות שה-UI מבטיח 10. EMET-167 נשאר פתוח עד תיקון + ריצת QA חוזרת.

## Checklist results

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 1 | Content correctness | **PARTIAL** | Hebrew RTL quiz, add/sub/mul badges, score UI copy present. UI promises «10 שאלות» but engine only builds 9 → crash before results/insight. No lorem/placeholder on start screen. |
| 2 | RTL rendering | **PASS** | `lang="he" dir="rtl"`, Hebrew headers/progress/feedback, numerals in questions OK. |
| 3 | Responsive | **PASS** | 360×640: single-column answers grid, no horizontal overflow. 1280×800: two-column grid. |
| 4 | Gameplay correctness | **FAIL** | Q1–9: correct answer gets `.correct`, wrong path shows correct value. Q9→Q10: **pageerror** `Cannot read properties of undefined (reading 'answer')`, `#root` empties, no results/restart. |
| 5 | Assets | **PASS** | `./favicon.svg`, `./icons.svg`, `./assets/index-mKCXMWMT.js`, `./assets/index-BqF1Ss2t.css` — all HTTP 200. Relative `./` paths resolve under `/kids-math-quiz/` subpath. |
| 6 | a11y/perf sanity | **FAIL** | Initial load ~650ms (curl/Playwright). Console **pageerror** on Q10 transition; app unusable after Q9. |

## Repro steps (SEV-High)

1. Open https://zionamar.github.io/kids-math-quiz/
2. Answer questions 1–9 correctly (any answers work; use correct for speed)
3. Click «השאלה הבאה ←» after Q9
4. **Expected:** «שאלה 10 מתוך 10» with a math question, then results after Q10
5. **Actual:** Blank page; DevTools console: `Cannot read properties of undefined (reading 'answer')`

Automated repro: Playwright headless, 2026-09-11T08:36Z — confirmed on 3 runs.

## Root cause (code)

`agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/src/quizEngine.js`:

- `QUESTION_POOL` has **9** generators (3 ops × 3 difficulties).
- `buildQuestions()` picks all 9 into `picked`, then `extra = shuffle(QUESTION_POOL.filter(t => !picked.includes(t))).slice(0, 1)` — filter is **empty** because every pool entry is already in `picked`.
- Returned array length = **9** while `TOTAL_QUESTIONS = 10`.
- `App.jsx` index 9 → `questions[9]` undefined → crash in `QuizScreen` when reading `question.answer`.

## Fix list for 14-frontend-engineer

1. Ensure `buildQuestions()` always returns exactly 10 items (e.g. add a 10th pool entry, or allow reuse/shuffle-with-replacement for the extra slot).
2. Add a unit test: `buildQuestions().length === TOTAL_QUESTIONS` on every call.
3. Rebuild bundle, republish to `ZionAmar/kids-math-quiz`, re-queue QA.

## Non-blocking notes

- Repo is **public** (`ZionAmar/kids-math-quiz`) — required for GitHub Pages free tier; confirm intent with ציון/00-ceo (not a QA gate).
- Published via desk auto-push bridge (commit author AZToDev, 2026-09-11T08:17Z) — no Nadav/Paz outbox yet; this run is the first full gameplay check.

## HTTP / curl snapshot

```
curl -I https://zionamar.github.io/kids-math-quiz/ → HTTP/2 200
curl -I .../favicon.svg → 200
curl -I .../icons.svg → 200
curl -I .../assets/index-mKCXMWMT.js → 200 (225657 bytes)
curl -I .../assets/index-BqF1Ss2t.css → 200 (3884 bytes)
```

## Playwright smoke (partial — aborted at crash)

- Start screen: header «🎯 שאלון מתמטיקה», progress «שאלה 1 מתוך 10», ops seen in Q1–9: add + sub + mul
- Q1–9 scoring UI: correct/wrong classes + feedback text OK
- Q10: **not reached** (crash)
- Results / restart / insight: **not verified** (blocked by crash)

---

HANDOFF:
- done: Live QA against https://zionamar.github.io/kids-math-quiz/ per inbox checklist. HTTP/RTL/responsive/assets PASS. Gameplay FAIL on Q10 crash (9-question pool bug).
- next: 14-frontend-engineer fixes `quizEngine.js` pool/buildQuestions, rebuilds, republishes; then re-run this QA packet for pass → EMET-167 close.
- files: `agents/20-qa-sdet/outbox/2026-09-11_kids-math-quiz-live-qa.md`

DELEGATE: 14-frontend-engineer | Fix Q10 crash: `buildQuestions()` returns only 9 items because `QUESTION_POOL` has 9 entries and `extra` filter is empty. Ensure 10 questions always; add length test; rebuild `kids-math-quiz-bundle` and republish. Re-queue 20-qa-sdet when live.

LEARNING:
- do: Play through all 10 questions in Playwright before signing off a «10 questions» quiz — curl/RTL checks miss off-by-one pool bugs.
- dont: DELEGATE 32-delivery-lead to close Linear when the final question crashes the app.
- note: kids-math-quiz live QA FAIL — SEV-High crash at Q10; EMET-167 stays open.
