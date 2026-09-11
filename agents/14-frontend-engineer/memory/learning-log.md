# Learning log — דפנה (`14-frontend-engineer`)

Bench until API contract + spec exist. React `components/` + `pages/`. PWA if chosen.

## Never again
- Do not run while `productWorkEnabled` is false. No product PRs until then.

## Iteration log
### 2026-09-11
- task: Fix Q10 crash in quizEngine.js — buildQuestions always 10 items; length test; rebuild + republish kids-math-quiz
- do: Decompile live bundle to prove 9-not-10 bug before fix; stochastic node:test on buildQuestions
- dont: Claim product-repo push when gh permissions.push is false
- note: Fix+rebuild in outbox/kids-math-quiz-bundle; push queued to 34-pc-ops (PC ONLINE), QA packet to 20-qa-sdet

### 2026-09-10
- task: PCI-16 — commit cake-recipe-demo-bundle to HQ for blocked PC lane
- do: HQ branch + outbox with raw file bodies when Nadav OFFLINE
- dont: Assume prior Cloud branch is merged to main
- note: Bundle from cursor/cake-recipe-demo-rtl-58ef → cursor/cake-recipe-demo-bundle-pci16-d25c
### 2026-09-09
- Company armed. Not building.

### 2026-09-10
- Built static RTL cake-recipe-demo page; bundle in outbox. Blocked: no repo create permission, productWorkEnabled false, Nadav offline.
- do: Local build + outbox bundle when Cloud cannot push product repo.
- dont: Claim GitHub repo exists without `gh repo view` proof.
