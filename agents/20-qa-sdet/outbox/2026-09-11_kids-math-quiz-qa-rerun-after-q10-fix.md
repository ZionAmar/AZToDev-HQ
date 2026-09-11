# QA Re-run — kids-math-quiz (EMET-167) · post quizEngine fix attempt

**Agent:** 20-qa-sdet (אורי)  
**Date:** 2026-09-11T09:26Z  
**Trigger:** Re-run live QA after 14-frontend-engineer fixes `quizEngine.js`, rebuilds, republishes  
**Live URL:** https://zionamar.github.io/kids-math-quiz/  
**Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167/pci-kmg-01-kids-math-quiz-react-for-founder-ציון)

## Verdict: **FAIL** — EMET-167 stays open

Republish with Q10 fix **not detected**. Live site still serves the original bundle from `2026-09-11T08:20:39Z`.

## Publish state (verified)

| Check | Result |
|-------|--------|
| GitHub latest commit | `9df69b6` — `2026-09-11T08:17:27Z` — only commit on repo |
| Pages `last-modified` | `Fri, 11 Sep 2026 08:20:39 GMT` (unchanged from prior QA runs) |
| JS bundle hash | `index-mKCXMWMT.js` (same as pre-fix) |

**Conclusion:** Dafna's fix has not been pushed/republished yet, or this QA ran before publish completed.

## Checklist results

### 1. Content correctness — PARTIAL (blocked by crash)

- Hebrew math quiz, 3 operations (add/sub/mul), badges, scoring logic OK for Q1–9
- **FAIL:** Quiz promises 10 questions but `buildQuestions()` returns only 9 → Q10 undefined

### 2. RTL rendering — PASS

- `<html lang="he" dir="rtl">` confirmed via curl
- Layout renders correctly at 320px / 768px / 1280px (screenshots captured)

### 3. Responsive — PASS

- No horizontal overflow at mobile (320px), tablet (768px), desktop (1280px)

### 4. Gameplay correctness — **FAIL (SEV-High)**

- Q1–9: answer selection, feedback (correct/wrong), next-button flow — OK
- **Q10: CRASH** — blank screen, React error
- Results screen: never reached (0/3 runs)
- Restart: not testable (blocked by Q10)

### 5. Assets — PASS

- `./favicon.svg` → 200
- `./icons.svg` → 200
- `./assets/index-mKCXMWMT.js` → 200
- `./assets/index-BqF1Ss2t.css` → 200
- No 404s in network tab during load

### 6. A11y/perf sanity — FAIL (console)

- **Page error (×3 runs):** `TypeError: Cannot read properties of undefined (reading 'answer')`
- No other console errors on initial load

## Playwright evidence

**Method:** 3 full gameplay runs, each attempting all 10 questions + results screen.

| Run | Q answered | Reached results | Error |
|-----|-----------|-----------------|-------|
| 1 | 9 | No | `undefined.answer` at Q10 |
| 2 | 9 | No | `undefined.answer` at Q10 |
| 3 | 9 | No | `undefined.answer` at Q10 |

**Artifacts:** `agents/20-qa-sdet/outbox/qa-artifacts/`

- `qa-results.json` — machine-readable full results
- `fail-run1.png`, `fail-run2.png`, `fail-run3.png` — crash screenshots
- `viewport-mobile.png`, `viewport-tablet.png`, `viewport-desktop.png` — responsive checks

## Root cause (for 14-frontend-engineer)

File: `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/src/quizEngine.js`

`buildQuestions()` logic:

1. Picks 3 templates per op (add/sub/mul) = **9 items** from `QUESTION_POOL` (which has exactly 9 templates)
2. Tries `extra = QUESTION_POOL.filter(t => !picked.includes(t))` → **always empty** (all 9 already picked)
3. Returns `.slice(0, 10)` on a 9-item array → **9 questions only**
4. `App.jsx` line 155: `questions[current]` is `undefined` when `current === 9`

**Fix:** Ensure `buildQuestions()` always returns exactly `TOTAL_QUESTIONS` (10) items. Options:

- Re-use a random template for the 10th slot (regenerate with `t.gen()`)
- Expand pool selection logic so one op contributes 4 instead of 3
- Add a guard: while `result.length < TOTAL_QUESTIONS`, pick any template and call `.gen()`

After fix: rebuild (`npm run build`), push to `ZionAmar/kids-math-quiz`, confirm new JS hash in live HTML, then re-queue 20-qa-sdet.

## Public repo note

Repo is public (required for free GitHub Pages). Not a QA blocker — flag for founder/Noa if intent unclear.

## Next owner

**14-frontend-engineer (דפנה)** — fix + rebuild + republish, then re-delegate QA.

Do **not** close EMET-167 until QA pass confirmed.

---

HANDOFF:
- done: Re-ran full Playwright QA (3×10-question attempts) + static/responsive/asset checks against live URL post-fix window
- next: Fix `buildQuestions()` to always return 10 items, rebuild, push to GitHub Pages, confirm new bundle hash live, then DELEGATE 20-qa-sdet for final QA pass
- files: `agents/20-qa-sdet/outbox/2026-09-11_kids-math-quiz-qa-rerun-after-q10-fix.md`, `agents/20-qa-sdet/outbox/qa-artifacts/qa-results.json`, `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/source/src/quizEngine.js`

DELEGATE: 14-frontend-engineer | Fix quizEngine buildQuestions() Q10 bug (returns 9 not 10), rebuild, republish to ZionAmar/kids-math-quiz, confirm new commit/bundle hash, then queue 20-qa-sdet QA re-run for EMET-167 close

LEARNING:
- do: Verify GitHub commit timestamp + JS bundle hash before gameplay QA — confirms republish landed
- dont: DELEGATE 32-delivery-lead to close EMET-167 when Q10 still crashes and bundle hash unchanged
- note: QA re-run 09:26Z — same Q10 undefined.answer crash; no new publish since 08:20Z; 3/3 Playwright runs fail at Q10
