# Learning log — דפנה (`14-frontend-engineer`)

Bench until API contract + spec exist. React `components/` + `pages/`. PWA if chosen.

## Never again
- Do not run while `productWorkEnabled` is false. No product PRs until then.

## Iteration log
### 2026-09-11
- task: Fix kids-math-quiz Q10 — buildQuestions() 9/10 pool exhaustion; rebuild; hand off publish
- do: Stochastic node:test (200 runs) + record bundle SHA-256 before handoff
- dont: Claim republish live when live still serves pre-fix index-mKCXMWMT.js
- note: Padding fix in quizEngine.js; 200/200 pass; new hash d046a92d…; Cloud push 403; Nadav republish packet queued
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
