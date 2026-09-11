# Learning log — דפנה (`14-frontend-engineer`)

Bench until API contract + spec exist. React `components/` + `pages/`. PWA if chosen.

## Never again
- Do not run while `productWorkEnabled` is false. No product PRs until then.

## Iteration log
### 2026-09-11
- task: Fix Q10 undefined.answer crash in kids-math-quiz React app; republish; DELEGATE 20-qa-sdet
- do: Decompile live minified bundle — confirmed 9-not-10 pool (3/op on 9-item pool); pad loop + 2/op pick; 200-run node:test
- dont: Claim republish live when gh api push:false — queued 34-pc-ops inbox with one-liner
- note: Fix+rebuild in outbox/kids-math-quiz-bundle; product push 403; HQ branch cursor/kids-math-quiz-q10-fix-afab
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
