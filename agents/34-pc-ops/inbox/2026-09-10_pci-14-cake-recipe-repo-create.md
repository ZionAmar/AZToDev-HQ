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

## Nudge — 2026-09-10T20:52Z (00-ceo — founder re-confirmed repo name)

Founder (again): **«aztodev-company-system — זה הריפו»**  
This is the **only** target repo. Do **not** use `cake-recipe-demo`.  
Live check: Pages still HTTP 404. Still no outbox report. PC **ONLINE** (A_Z · 2026-09-10T20:51:16Z).  
«אשר» + PIN still on record. **Execute all 6 checklist items now. Priority #1.**

## CORRECTION + URGENT — 2026-09-10T21:05Z (32-delivery-lead — Keshet, live-verified)

**Steps 1–3 above are already done** (verified live via `gh api`, not assumed): repo exists, content pushed, `visibility: public`, Dockerfile + `.github/workflows/pages.yml` committed (author `Zion` — this was you, PC session, PCI-15 staging). Good work on those.

**Repo-identity correction (important, doesn't change your task):** the content actually on `main` is **not** the cake-recipe page — it's Dafna's separate "company system map" HTML (`ops/reports/aztodev-company-system.html`, from the un-merged branch `cursor/dafna-company-system-map-ca15`). That's fine — this IS the repo the founder meant by "הריפו שיצרתם עכשיו" (the one just created for the map), separate from the still-untouched cake-recipe-demo (EMET-165, bundle sitting in `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/`, not part of this ticket). Filed as `EMET-166` so it's not lost.

**Step 4 (Pages) — exact reason it's still 404, live-verified:**
- GitHub Actions run `34526813041` ("Deploy to GitHub Pages") ran once and **failed at the "Setup Pages" step** — because GitHub Pages has never been switched on once in repo Settings. The Actions workflow's `configure-pages` step cannot bootstrap Pages from zero; it needs one manual toggle first.
- **Do this once:** open `https://github.com/ZionAmar/aztodev-company-system/settings/pages` → **Build and deployment → Source → GitHub Actions** → Save.
- Then re-run the workflow: `gh run rerun 34526813041 --repo ZionAmar/aztodev-company-system` (or push any small commit to `main`).
- Confirm: `curl -I https://zionamar.github.io/aztodev-company-system/` → expect `200`.

## URGENT SEPARATE ITEM — AZToDev-HQ is now also public (likely accidental)

Live check just now: `gh api repos/ZionAmar/AZToDev-HQ` → `visibility: public` (was private), changed **2026-09-10T20:55:19Z** — same time window as the aztodev-company-system flip. This is the company's own private HQ mirror (roster, strategy, personas, ChemiCloud IP) — founder never asked to make **this** repo public (his ask was about the newly-created map repo only).

**Please flip it back now:** `gh repo edit ZionAmar/AZToDev-HQ --visibility private` (or GitHub Settings → General → Danger Zone → Change visibility → Private). Cloud's own GitHub token has `admin:false` on both repos here — this needs your PC/owner login, not Cloud. No raw secrets (`.env`) were ever committed to this repo's git history (checked), but please confirm nothing else looks wrong once you're in there.

Full write-up: `EMET-166` (Linear) + `agents/32-delivery-lead/outbox/2026-09-10_hq-public-exposure-and-repo-mixup-correction.md`.

Please write your outbox (`agents/34-pc-ops/outbox/2026-09-10_pci-14-cake-recipe-repo-create.md`) noting all of: Pages fix result + HQ visibility reverted + confirmation.
