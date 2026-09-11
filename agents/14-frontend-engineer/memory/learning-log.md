# Learning log — דפנה (`14-frontend-engineer`)

Bench until API contract + spec exist. React `components/` + `pages/`. PWA if chosen.

## Never again
- Do not run while `productWorkEnabled` is false. No product PRs until then.

## Iteration log
### 2026-09-10
- task: PCI-16 — commit cake-recipe-demo-bundle to HQ for blocked PC lane
- do: HQ branch + outbox with raw file bodies when Nadav OFFLINE
- dont: Assume prior Cloud branch is merged to main
- note: Bundle from cursor/cake-recipe-demo-rtl-58ef → cursor/cake-recipe-demo-bundle-pci16-d25c
### 2026-09-11
- task: Fix Q10 `undefined.answer` crash — `buildQuestions()` 9-not-10 pool exhaustion; rebuild; republish `ZionAmar/kids-math-quiz`; queue 20-qa-sdet.
- do: Stochastic node:test (200 runs) on buildQuestions; record new bundle SHA-256 (`index-B8qhFize.js`) in outbox before handoff
- dont: Claim republish live when `gh api` push:false — queue Nadav/desk with exact new hash target
- note: Fix+rebuild done in HQ outbox; live still on old `index-mKCXMWMT.js`; republish delegated 34-pc-ops (PC ONLINE)

### 2026-09-09
- Company armed. Not building.

### 2026-09-10
- Built static RTL cake-recipe-demo page; bundle in outbox. Blocked: no repo create permission, productWorkEnabled false, Nadav offline.
- do: Local build + outbox bundle when Cloud cannot push product repo.
- dont: Claim GitHub repo exists without `gh repo view` proof.
