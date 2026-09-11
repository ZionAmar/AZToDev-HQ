# kids-math-quiz — live QA re-run after republish · EMET-167

**Agent:** 20-qa-sdet (אורי)  
**Date:** 2026-09-11T09:07Z  
**URL:** https://zionamar.github.io/kids-math-quiz/  
**Linear:** EMET-167  
**Verdict:** **FAIL** — Q10 crash persists; results screen unreachable

## Deploy context

| Check | Result |
|-------|--------|
| HTTP status | 200 OK |
| `last-modified` | Fri, 11 Sep 2026 08:20:39 GMT (republish confirmed) |
| Stack | React/Vite SPA (`assets/index-mKCXMWMT.js`) — not the static `products/kids-math-quiz/index.html` in HQ |

## Checklist results

| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | Page loads (200) | **PASS** | `curl -I` → HTTP/2 200 |
| 2 | RTL Hebrew (`dir=rtl`, `lang=he`) | **PASS** | Playwright DOM check |
| 3 | Mobile viewport (375×812) | **PASS** | Q1–Q9 render correctly |
| 4 | Quiz flow Q1–Q9 | **PASS** | 9 questions answered + next clicked |
| 5 | **Q10 renders** | **FAIL** | Blank screen after Q9 → Q10 transition |
| 6 | **Results screen** | **FAIL** | Never reached |
| 7 | Score + insight + restart | **FAIL** | Not visible (blocked by Q10 crash) |
| 8 | Console/page errors | **FAIL** | `Cannot read properties of undefined (reading 'answer')` |

## Repro steps (Playwright, headless Chromium)

1. Open https://zionamar.github.io/kids-math-quiz/
2. For questions 1–9: click any answer → click "השאלה הבאה ←"
3. After completing Q9 and clicking next, expected Q10 — actual: white screen (gradient only, no buttons)
4. Page error thrown: `Cannot read properties of undefined (reading 'answer')`

## Severity

**SEV-High** — core user journey broken at final question; 100% of users who complete 9 questions hit a crash; results/summary never shown.

## Root-cause hypothesis

Question pool builder returns fewer than 10 valid question objects (or index 9 is `undefined`) when the React app tries to render Q10. Same failure signature as the prior QA run (2026-09-11 earlier today) — republish at 08:20Z did **not** fix the bug.

## Artifacts

- Playwright script: `agents/20-qa-sdet/tmp/kids-math-quiz-live-qa.mjs`
- Failure screenshot: `agents/20-qa-sdet/tmp/kids-math-quiz-fail.png`
- JSON output: `questions_completed: 9`, `q10_crash: true`, `page_errors: ["Cannot read properties of undefined (reading 'answer')"]`

## EMET-167

**Stay open.** Do not close on delivery lead side until Q10 + results screen pass on live.
