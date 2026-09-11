# kids-math-quiz — live QA report (EMET-167)

**Agent:** Ori (`20-qa-sdet`) · **Date:** 2026-09-11T09:10Z  
**Packet:** `agents/20-qa-sdet/inbox/2026-09-11_kids-math-quiz-live-qa.md`  
**URL:** https://zionamar.github.io/kids-math-quiz/  
**Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167/pci-kmg-01-kids-math-quiz-react-for-founder-ציון)  
**Verdict:** **FAIL** — SEV-high gameplay blocker on question 10

## Executive summary (for Noa → founder)

המשחק חי, עברית RTL ומובייל נראים טוב — אבל **נופל בשאלה 10** ולא מגיע למסך תוצאות. EMET-167 **לא** נסגר. צריך תיקון ב-`quizEngine.js`, build מחדש ו-republish.

## Live state verified

| Check | Result |
|-------|--------|
| HTTP 200 | ✅ `curl -I` + Playwright |
| `lang="he" dir="rtl"` | ✅ |
| Title «שאלון מתמטיקה כיפי 🎯» | ✅ |
| Assets `./favicon.svg`, `./icons.svg`, `./assets/*` | ✅ all 200, no 404s |
| Repo pushed | `2026-09-11T08:17:29Z` (single commit, no post-fix republish) |
| Page `last-modified` | `Fri, 11 Sep 2026 08:20:39 GMT` |

## Checklist (packet items)

| # | Item | Result | Notes |
|---|------|--------|-------|
| 1 | Content correctness | ❌ FAIL | UI promises 10 questions; engine builds **9** |
| 2 | RTL rendering | ✅ PASS | Hebrew RTL, numerals OK, no mirrored layout |
| 3 | Responsive | ✅ PASS | Desktop 1280px, iPhone 13, 320px — no horizontal overflow |
| 4 | Gameplay / scoring | ❌ FAIL | Q1–9 OK; **Q10 white-screen crash** |
| 5 | Assets / subpath | ✅ PASS | Relative paths work at `/kids-math-quiz/` |
| 6 | Console / perf | ❌ FAIL | Uncaught `TypeError` on Q10 (see below) |

## Repro (Playwright, 2026-09-11T09:09Z)

1. Open https://zionamar.github.io/kids-math-quiz/
2. Answer Q1–9 (any option → «השאלה הבאה ←»)
3. On Q10 transition → blank screen, quiz UI gone

**Page error (all viewports):**
```
TypeError: Cannot read properties of undefined (reading 'answer')
  at ne (…/assets/index-mKCXMWMT.js:9:54026)
```

**Observed:** progress shows «שאלה 9 מתוך 10» on last working question; after clicking next, `#quiz-screen` never renders Q10.

## Root cause (confirmed in HQ source)

`agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/src/quizEngine.js`:

- `QUESTION_POOL` has **9** templates (3 add + 3 sub + 3 mul — division removed per spec).
- `buildQuestions()` picks **all 3** templates per op → 9 items consumed entirely.
- `extra = shuffle(QUESTION_POOL.filter(t => !picked.includes(t))).slice(0, 1)` → **always empty**.
- Returns **9** questions while `TOTAL_QUESTIONS = 10`.

Local verification (Node import, 5 runs): every run returned `count: 9`.

Reference: static quality bar `products/kids-math-quiz/index.html` uses **12** pool templates (4 ops × 3) and picks 2/op + 2 extra → always 10. React port dropped division but kept incompatible pick logic.

## What passed (worth keeping)

- Hebrew copy, badges (חיבור/חיסור/כפל), scoring feedback on Q1–9
- Progress bar, answer highlighting (correct/wrong)
- Mobile-first layout, gradient design matches spec
- No placeholder/lorem text
- Public repo note: repo is public (Pages free tier) — flag for Noa/ציון, not a QA blocker

## Required fix (14-frontend-engineer)

1. Fix `buildQuestions()` to **always return exactly 10** items with valid `answer` + `options` (e.g. add pool templates, pick 2/op + extras, or allow safe duplicate generation).
2. `npm run build` in bundle source; update `kids-math-quiz-bundle/` dist.
3. Republish to `ZionAmar/kids-math-quiz` (desk bridge or `34-pc-ops`).
4. Re-queue `20-qa-sdet` for EMET-167 sign-off.

## EMET-167

**Not closing.** QA gate failed. `32-delivery-lead` closes only after clean re-run.

## Evidence artifacts

- Playwright JSON: `/tmp/kids-math-qa-artifacts/results.json` (this run)
- Screenshots: `/tmp/kids-math-qa-artifacts/{desktop,mobile,narrow}-*.png`

---

HANDOFF:
- done: Full live QA per inbox packet — RTL/mobile/assets PASS; Q10 crash FAIL with root-cause in quizEngine.js
- next: 14-frontend-engineer fixes buildQuestions (9→10), rebuilds, republishes; then 20-qa-sdet re-runs checklist
- files: agents/20-qa-sdet/outbox/2026-09-11_kids-math-quiz-live-qa-fail-q10.md, agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/src/quizEngine.js

DELEGATE: 14-frontend-engineer | Fix `quizEngine.js` `buildQuestions()` so it always returns 10 valid questions (current pool exhaustion yields 9); rebuild bundle; republish to https://zionamar.github.io/kids-math-quiz/; then re-queue 20-qa-sdet for EMET-167 closure.

LEARNING:
- do: Playwright full 10-question flow + pageerror capture before pass/fail; verify HQ source `buildQuestions().length` when live crashes
- dont: DELEGATE 32-delivery-lead to close EMET-167 when Q10 still crashes
- note: kids-math-quiz live QA FAIL unchanged — QUESTION_POOL=9 templates, pick logic consumes all 9, Q10 undefined.answer crash; EMET-167 stays open
