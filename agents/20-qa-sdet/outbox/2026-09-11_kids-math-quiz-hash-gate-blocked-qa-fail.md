# QA — kids-math-quiz (EMET-167) · hash gate BLOCKED, Q10 still crashes

**Agent:** 20-qa-sdet (אורי)  
**Date:** 2026-09-11T11:39Z  
**Trigger:** 14-frontend-engineer → verify desk-github republish (live hash ≠ `index-mKCXMWMT.js`), then full QA  
**Live URL:** https://zionamar.github.io/kids-math-quiz/  
**Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167/pci-kmg-01-kids-math-quiz-react-for-founder-ציון)

## Verdict: **FAIL / BLOCKED** — EMET-167 stays open

Republish with Q10 fix **not detected**. Live site still serves the original bundle from `2026-09-11T08:20:39Z`. Gameplay QA cannot pass until a new bundle hash is live.

## Step 1 — Hash gate (required before QA)

| Check | Expected | Actual | Result |
|-------|----------|--------|--------|
| Live JS bundle | ≠ `index-mKCXMWMT.js` | `index-mKCXMWMT.js` | **FAIL** |
| GitHub `pushed_at` | newer than 08:17:29Z | `2026-09-11T08:17:29Z` | **FAIL** |
| Pages `last-modified` | newer than 08:20:39Z | `Fri, 11 Sep 2026 08:20:39 GMT` | **FAIL** |
| Repo `assets/` on GitHub | new hash | `index-mKCXMWMT.js` only | **FAIL** |

**Conclusion:** desk-github republish has **not landed**. Fix exists on HQ branch `cursor/kids-math-quiz-q10-fix-afab` with rebuilt bundle `index-ZmMTvbPf.js` — but that build is not on `ZionAmar/kids-math-quiz` yet.

## Step 2 — Live QA (ran anyway for evidence)

### Checklist

| Item | Result |
|------|--------|
| RTL (`dir="rtl"`, `lang="he"`) | PASS |
| Title / Hebrew content | PASS |
| Responsive 320 / 768 / 1280 | PASS |
| Assets (favicon, icons, bundles) | PASS — all 200, no 404s |
| Gameplay Q1–9 | PASS |
| Gameplay Q10 | **FAIL** — crash |
| Results screen | **FAIL** — never reached (0/3 runs) |
| Console | **FAIL** — `TypeError: Cannot read properties of undefined (reading 'answer')` ×3 |

### Playwright (3 full runs)

| Run | Q answered | Results | Error |
|-----|-----------|---------|-------|
| 1 | 9 | No | `undefined.answer` at Q10 |
| 2 | 9 | No | `undefined.answer` at Q10 |
| 3 | 9 | No | `undefined.answer` at Q10 |

**Artifacts:** `agents/20-qa-sdet/outbox/qa-artifacts/`
- `qa-results.json` — machine-readable (timestamp 2026-09-11T11:39:50Z)
- `fail-run1.png`, `fail-run2.png`, `fail-run3.png`
- `viewport-mobile.png`, `viewport-tablet.png`, `viewport-desktop.png`
- `kids-math-quiz-qa.mjs` — reproducible Playwright script

## Root cause (unchanged)

`buildQuestions()` in the live bundle returns 9 items; UI promises 10 → `questions[9]` is `undefined` at Q10. Fix authored on branch `cursor/kids-math-quiz-q10-fix-afab` (bundle `index-ZmMTvbPf.js`) — **not published**.

## Next owner

**18-devops-platform (פז)** — `GITHUB_STATIC_PUBLISH` the fixed bundle from `cursor/kids-math-quiz-q10-fix-afab` to `ZionAmar/kids-math-quiz`, confirm live hash ≠ `index-mKCXMWMT.js`, then re-queue **20-qa-sdet** for final QA pass before EMET-167 closes.

Do **not** close EMET-167 or tell founder "fixed" until hash gate + clean QA pass.

---

HANDOFF:
- done: Verified live hash gate (still old bundle), ran full Playwright QA (3×10-question attempts) + static/responsive/asset checks — same Q10 crash as prior runs
- next: Publish fixed bundle (`index-ZmMTvbPf.js` from `cursor/kids-math-quiz-q10-fix-afab`) to `ZionAmar/kids-math-quiz` via desk-github / GITHUB_STATIC_PUBLISH; confirm new commit + bundle hash live; then DELEGATE 20-qa-sdet for final QA
- files: `agents/20-qa-sdet/outbox/2026-09-11_kids-math-quiz-hash-gate-blocked-qa-fail.md`, `agents/20-qa-sdet/outbox/qa-artifacts/qa-results.json`

DELEGATE: 18-devops-platform | GITHUB_STATIC_PUBLISH fixed kids-math-quiz bundle from branch cursor/kids-math-quiz-q10-fix-afab to ZionAmar/kids-math-quiz — verify live JS hash ≠ index-mKCXMWMT.js (expect index-ZmMTvbPf.js or newer), then queue 20-qa-sdet final QA for EMET-167 close

LEARNING:
- do: Block gameplay QA on hash gate first — if bundle unchanged, report BLOCKED with curl/gh evidence before spending Playwright time
- dont: DELEGATE 32-delivery-lead to close EMET-167 when live hash still index-mKCXMWMT.js and Q10 crash reproduces 3/3
- note: QA 11:39Z — republish still not landed; hash gate FAIL; Q10 undefined.answer unchanged from 09:26Z run
