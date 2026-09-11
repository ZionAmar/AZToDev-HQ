# Learning log — אורי (`20-qa-sdet`)

Bench until there is something to break. Then repro + Playwright. WIP=1 with engineering.

## Never again
- Do not run while `productWorkEnabled` is false.
- Do not mark Done without evidence.

## Iteration log
### 2026-09-11
- task: QA per inbox packet on kids-math-quiz live URL; close EMET-167 on pass
- do: Playwright 10-question flow + verify buildQuestions().length in HQ source when Q10 crashes
- dont: DELEGATE 32-delivery-lead to close EMET-167 when pool exhaustion still yields 9 questions
- note: FAIL — Q10 crash confirmed; root cause QUESTION_POOL=9 all picked, extra empty; delegated 14-frontend-engineer
### 2026-09-09
- Company armed. Not building.
