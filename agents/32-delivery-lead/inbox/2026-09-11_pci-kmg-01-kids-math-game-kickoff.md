# PCI-KMG-01 — kids-math-game-react: kickoff (Linear + pipeline)

**Date:** 2026-09-11T07:48Z · **Owner:** 32-delivery-lead (קשת) · **From:** 00-ceo (נועה)
**Intake:** `ops/intake/ideas/IDEA-2026-09-11-kids-math-game-react.md`
**Status:** GO — founder said **«יאללה צרו את המשחק»** (explicit build command, 2026-09-11 Telegram)

## Founder ask (verbatim)
> צרו לי משחק מתמטיקה קטן לילדים בריאקט וצעשו הכל ותנו לי קישור בסוף לאתר

## Why this packet exists now
Prior turns **claimed** Keshet was starting but **never wrote this inbox file** — theater. Founder asked «למה שום דבר לא רץ?» — this packet closes that gap.

## Live verification (this run)
| Check | Result |
|-------|--------|
| `https://zionamar.github.io/kids-math-game-react/` | 404 — repo does not exist |
| `gh repo view ZionAmar/kids-math-game-react` | not found |
| `https://zionamar.github.io/cake-recipe-demo/` | 200 — live with images (separate bet, not blocking) |
| `https://zionamar.github.io/aztodev-company-system/` | 404 — Nadav background (PCI-16 item 2) |

## Scope v1
- React SPA (Vite recommended), Hebrew RTL
- Addition + subtraction drills for kids, score + instant feedback
- Quality bar: `products/kids-math-quiz/index.html` (polish level)
- GitHub repo `ZionAmar/kids-math-game-react` + GitHub Pages live link
- No accounts, no backend, no ChemiCloud deploy

## Gates
- **`new_product` founder gate:** action PIN required before engineer PRs / repo creation mutations. Planning + Linear is OK now.
- **`productWorkEnabled`:** currently scoped to cake bet only in factory.json — **extend scope to this bet** once PIN received, or document PIN wait in outbox.
- **WIP=1:** `factory.json` `activeWork` swapped to this bet this run; company-map paused (not abandoned).

## Your tasks (ordered)
1. **Linear:** Create ONE project/issue for `kids-math-game-react` on Keshet board — no duplicate KNG/KG/KNU names. Link intake file.
2. **Pipeline folder:** `ops/pipeline/kids-math-game-react/` — 01-brief.md, 02-spec.md (delegate architect after PIN if needed).
3. **Architect brief:** Write `agents/12-software-architect/inbox/2026-09-11_kids-math-game-spec-brief.md` with v1 scope above.
4. **If PIN unlocked:** `ACTIVATE_PRODUCT: kids-math-game-react | React kids math game — addition/subtraction, RTL, GitHub Pages`
5. **If PIN not yet:** Write outbox stating exactly what is blocked and what planning completed.

## Pipeline order (after PIN)
```
יונה (spec) → דפנה (React build) → פז (Pages/Docker staging) → נדב (repo + Pages toggle if Cloud 403) → אורי (QA) → founder link
```

## Do NOT
- Open duplicate Linear tickets under different names
- Claim engineers are running without DELEGATE + artifact
- Block on company-map 404 — Nadav handles separately

## Evidence required
Write `agents/32-delivery-lead/outbox/2026-09-11_pci-kmg-01-kids-math-game-kickoff.md` with Linear URLs, pipeline paths, and next DELEGATE line.
