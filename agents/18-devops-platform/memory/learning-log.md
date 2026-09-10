# Learning log — Paz (`18-devops-platform`)

## Active patterns
- Read-verify repo state before PATCH; report stale checklist rows when live API differs.

## Never again
- Claim Cloud can flip personal-repo visibility or enable Pages — integration token is AZToDev-HQ scoped only (403).

## Iteration log

### 2026-09-10
- task: PCI-16 helper from 34-pc-ops — verify cake-recipe bundles + attempt items 1–2 via GitHub API while PC shell broken
- do: Read-verify repo state before PATCH; report stale checklist rows when live API differs (HQ already private).
- dont: Claim Cloud can flip personal-repo visibility or enable Pages — integration token is AZToDev-HQ scoped only (403).
- note: Bundle confirmed on rtl-58ef + docker-pages-stage-18eb; item 1 already private; items 2–3 blocked for PC.

### 2026-09-10
- task: Nadav asked you: Dafna pipeline — Nadav finished slice 1. Private repo (pushed from founder PC): https://github.com/ZionAmar/aztodev-company-system Branch: main Content: index.html (company system map from Dafna) + READM
- do: Stage DevOps artifacts in HQ + delegate PC push when Cloud GitHub App cannot see the product repo
- dont: Claim commit/push to a repo that returns 404 from `gh repo view` on Cloud
- note: Dafna pipeline DevOps slice prepared; product-repo push blocked by token scope — queued PCI-15 to Nadav
