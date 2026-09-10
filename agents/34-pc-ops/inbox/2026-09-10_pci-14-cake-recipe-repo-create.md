# PCI-14 — aztodev-company-system: push bundle + public + Pages

**Date:** 2026-09-10  
**Owner:** 34-pc-ops (נדב)  
**Priority:** High — blocks cake-recipe-demo live link (EMET-165)  
**Gate:** Founder «תבנו»+PIN + «תהפכו לפאבליק» + **«אשר» received 2026-09-10T20:39Z** — GO

## GO — 2026-09-10T20:25Z (PC online)

Founder: «טוב, פתחתי את המחשב, יאללה, רוץ על זה.»  
PC heartbeat: **ONLINE** (A_Z). Prior «אשר» + PIN on record for build.

## GO — founder «אשר» (2026-09-10T20:39Z)

Founder clarified repo via Pages URL: https://zionamar.github.io/aztodev-company-system/  
Founder approved public+Docker plan + PIN on record. **Execute now.**

## Task

1. Create or locate GitHub repo **`ZionAmar/aztodev-company-system`** via PC `gh` session (owner auth).
2. Push static RTL cake recipe bundle from HQ (עוגת שוקולד רכה):
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html`
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/styles.css`
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/README.md`
   - Evidence: `agents/14-frontend-engineer/outbox/2026-09-10_cake-recipe-demo-rtl-page.md`
3. Push bundle to `main` (root or `docs/` as needed for GitHub Pages).
4. Flip repo visibility to **public** (founder explicit request — PIN window must be open).
5. Enable GitHub Pages if not already (source: main / root or docs).
6. Verify repo + Pages URL respond (not 404).

## Why PC

Cloud Cursor GitHub App is scoped to AZToDev-HQ only — cannot create repos, push to personal account, or change visibility. Same root cause as PCI-11.

## After you finish

Write `agents/34-pc-ops/outbox/2026-09-10_pci-14-cake-recipe-repo-create.md` with repo URL, commit SHA, and public Pages URL.

Signal completion so Noa can DELEGATE 18-devops-platform for Docker + live browser link.

## Founder optional accelerator

If founder already created `aztodev-company-system` on github.com, skip create — push + public flip only.

**Note:** Original plan used `cake-recipe-demo`; founder clarified **aztodev-company-system** via Pages URL 2026-09-10.
