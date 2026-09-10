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

## Nudge — 2026-09-10T20:46Z (00-ceo)

Founder: «נו. עוד לא סיים?» (~7 min after «אשר» GO).  
Live check: `zionamar.github.io/aztodev-company-system/` still HTTP 404. No `agents/34-pc-ops/outbox/` report for PCI-14 yet.  
PC heartbeat: **ONLINE** (A_Z · 2026-09-10T20:45:06Z). PIN window from founder «אשר» still valid.  
**Execute now — priority #1.** Write outbox when done.

## Nudge — 2026-09-10T20:49Z (00-ceo — founder «תוודאי ב100 אחוז»)

Founder: «תוודאי ב100 אחוז שנדב עושה את כל מה שהוא צריך לעשות»  
Live check: Pages still HTTP 404. Still no outbox report. PC **ONLINE** (A_Z · 2026-09-10T20:49:22Z).  
**Do not skip any step below.** Outbox must tick every checkbox or explain failure.

## Mandatory checklist (all required — founder verified 2026-09-10)

- [ ] **1. Repo exists** — `gh repo view ZionAmar/aztodev-company-system` succeeds (create if missing)
- [ ] **2. Bundle pushed** — `index.html`, `styles.css`, `README.md` from `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/` on `main`
- [ ] **3. Public** — `gh repo edit ZionAmar/aztodev-company-system --visibility public` (PIN window open)
- [ ] **4. Pages enabled** — GitHub Pages from `main` / root (or `docs/` if you use that layout)
- [ ] **5. Live URL works** — `https://zionamar.github.io/aztodev-company-system/` returns **200** (not 404), Hebrew RTL cake page visible
- [ ] **6. Outbox evidence** — write `agents/34-pc-ops/outbox/2026-09-10_pci-14-cake-recipe-repo-create.md` with: repo URL, commit SHA, visibility=public, Pages URL, curl status code

If any step fails — report which step + exact error in outbox. Do not mark done without step 5 passing.
