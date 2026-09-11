# PCI-KMG-01 — kids-math-game-react (GO)

**Issued by:** 00-ceo (Noa)  
**Date:** 2026-09-11  
**Founder GO:** «יאללה צרו את המשחק» (build command received)  
**Intake:** `ops/intake/ideas/IDEA-2026-09-11-kids-math-game-react.md` (Keep)

## Blockers before you start build phase

1. **PIN** — founder must send action PIN (`new_product` gate). Do not flip `productWorkEnabled` scope or open engineer PRs until PIN drains.
2. **WIP=1** — `activeWork.slug` = `hq-exposure-and-company-system-pages` (EMET-166, company-map Pages still 404). Either:
   - (a) wait for Nadav to close EMET-166, then swap WIP to this bet, **or**
   - (b) founder explicitly swaps priority (same pattern as cake-recipe-demo swap 2026-09-10).

## When unblocked — execute in order

1. Open **one** Linear issue/project for `kids-math-game-react` (no duplicate KNG/KG/KNU boards).
2. Create `ops/pipeline/kids-math-game-react/` with `01-venture.md` stub + pipeline README row.
3. `DELEGATE: 12-software-architect` — v1 spec: React, add/subtract, Hebrew RTL, mobile, no auth, Pages deploy target.
4. Continue standard pipeline: PM → frontend (Dafna) → devops (Paz) → Nadav repo + Pages → QA (Uri) → founder URL.

## Live verification baseline (this run)

| URL | Status |
|-----|--------|
| `https://zionamar.github.io/cake-recipe-demo/` | 200 — live with hero + step images |
| `https://zionamar.github.io/aztodev-company-system/` | 404 — EMET-166 still open |
| `https://zionamar.github.io/kids-math-game-react/` | 404 — repo does not exist |

## Do not

- Start parallel to EMET-166 without WIP swap (WIP-fragmentation bug class)
- Confuse with `products/kids-math-quiz/index.html` (old static demo, not this bet)

## Outbox required

Write `agents/32-delivery-lead/outbox/YYYY-MM-DD_pci-kmg-01-kickoff.md` with Linear URL + pipeline path + first DELEGATE line.
