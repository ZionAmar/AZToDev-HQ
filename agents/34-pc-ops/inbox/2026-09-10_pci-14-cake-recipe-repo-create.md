# PCI-14 — cake-recipe-demo: create repo + push bundle

**Date:** 2026-09-10  
**Owner:** 34-pc-ops (נדב)  
**Priority:** High — blocks cake-recipe-demo live link (EMET-165)  
**Gate:** Founder already gave «תבנו» + action PIN for this bet

## Task

1. Create **private** GitHub repo `ZionAmar/cake-recipe-demo` via PC `gh` session (owner auth).
2. Obtain static RTL cake recipe bundle from 14-frontend-engineer cloud run (עוגת שוקולד רכה — index.html, styles.css, README.md).
3. Push bundle to `main`.
4. Verify repo exists and files are visible on github.com.

## Why PC

Cloud Cursor GitHub App is scoped to AZToDev-HQ only — cannot create repos or push to personal account. Same root cause as PCI-11 visibility.

## After you finish

Write `agents/34-pc-ops/outbox/2026-09-10_pci-14-cake-recipe-repo-create.md` with repo URL and commit SHA.

Signal completion so Noa can DELEGATE 16-devops-engineer for Docker + GitHub Pages live link.

## Founder optional accelerator

If founder creates empty private repo `cake-recipe-demo` on github.com first, skip step 1 and push only.
