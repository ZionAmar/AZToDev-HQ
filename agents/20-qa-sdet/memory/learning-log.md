# Learning log — אורי (`20-qa-sdet`)

Bench until there is something to break. Then repro + Playwright. WIP=1 with engineering.

## Never again
- Do not run while `productWorkEnabled` is false.
- Do not mark Done without evidence.

## Iteration log
### 2026-09-11
- task: Verify desk-github republish (hash ≠ index-mKCXMWMT.js) then QA kids-math-quiz (EMET-167)
- do: Hash gate first with curl + gh api before Playwright — report BLOCKED if bundle unchanged
- dont: Close EMET-167 or delegate delivery-lead when live still serves index-mKCXMWMT.js
- note: QA 11:39Z — republish not detected; Q10 crash 3/3; fix on branch afab (index-ZmMTvbPf.js) not live

### 2026-09-11
- task: Re-run live QA on kids-math-quiz after Dafna quizEngine fix + republish (EMET-167)
- do: Verify GitHub commit + JS bundle hash before gameplay QA — confirms republish landed
- dont: DELEGATE 32-delivery-lead to close EMET-167 when Q10 still crashes and bundle hash unchanged
- note: QA re-run 09:26Z — same Q10 undefined.answer; no new publish since 08:20Z; 3/3 Playwright runs fail at Q10

### 2026-09-09
- Company armed. Not building.
