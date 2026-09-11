# Learning log — אורי (`20-qa-sdet`)

Bench until there is something to break. Then repro + Playwright. WIP=1 with engineering.

## Never again
- Do not run while `productWorkEnabled` is false.
- Do not mark Done without evidence.

## Iteration log
### 2026-09-11
- task: Live QA kids-math-quiz (EMET-167) against https://zionamar.github.io/kids-math-quiz/
- do: Playwright full 10-question path before pass — pool-size bugs don't show in curl/RTL checks
- dont: Close EMET-167 / DELEGATE delivery-lead when Q10 crashes with pageerror
- note: FAIL — buildQuestions() returns 9 items; crash at questions[9].answer. Delegated fix to 14-frontend-engineer.
### 2026-09-09
- Company armed. Not building.
