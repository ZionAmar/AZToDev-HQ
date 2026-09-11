# Outbox — Founder «פעם הבאה לא תקרה?» + Shana Tova kick (2026-09-11 ~13:12Z)

## Founder ask
«אבל פעם הבאה לא תקרה לי יותר תקלה כזאת??»

Context: repeated kids-math-quiz Q10 cycle — fixes claimed ready while live site still served old bundle (`index-mKCXMWMT.js`), wrong routing to Nadav for GitHub publish, PIN sent but Keshet still held EMET-168.

## Live verification this turn
| Check | Result |
|-------|--------|
| kids-math-quiz live JS | `index-ZmMTvbPf.js` — **fixed build, 200** |
| shana-tova-greeting URL | **404** — not built yet |
| HQ ACTION PIN | **UNLOCKED** (founder sent יאללה + PIN twice) |
| Keshet Cloud run | **RUNNING** — https://cursor.com/agents/bc-4e79d361-9479-4b0a-ac17-e0842c4cdbca |

## Founder reply (Telegram)
Honest yes-with-guardrails: documented company lessons + routing fix (desk GitHub not Nadav) + live-url gate before «מוכן» + PIN→immediate kick. Shana Tova build now active on Keshet.

## Actions taken
- Updated `ops/config/factory.json` — EMET-168 PIN gate met, activeWork → Shana Tova build
- Added `ops/company-lessons.md` entry: `publish_ready_not_live_nadav_wrong_route`
- Keshet already RUNNING on bc-4e79d361 — no duplicate DELEGATE needed this turn

HANDOFF:
- done: Founder reassurance reply drafted; factory state updated; live checks; confirmed Keshet EMET-168 run active
- next: 32-delivery-lead completes build → 18-devops-platform desk publish → 20-qa-sdet live QA → live URL to founder
- files: ops/config/factory.json, ops/company-lessons.md, ops/intake/ideas/IDEA-2026-09-11-shana-tova-greeting-page.md

DELEGATE: 32-delivery-lead | EMET-168 Shana Tova — PIN unlocked. Continue/end-to-end: 14-frontend-engineer build RTL carousel → 18-devops-platform desk Pages publish → 20-qa-sdet live QA → close with live URL. Cloud run bc-4e79d361 already RUNNING — do not open parallel branch.

LEARNING:
- do: On «לא תקרה שוב?» — name the 3 concrete rule fixes (desk publish, live hash gate, PIN→kick) + confirm current bet is actually running with Cloud link
- dont: Promise «100%» or re-ask PIN when HQ window is open; blame Nadav for GitHub publish
- note: Founder glitch ask after double PIN; quiz live fixed; Shana Tova Keshet bc-4e79d361 RUNNING
