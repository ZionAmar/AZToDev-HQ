# PCI-KMG-01 — Kids math game (React) — founder GO

**Date:** 2026-09-11  
**From:** 00-ceo (Noa)  
**Founder text:** «יאללה צרו את המשחק»  
**Decision:** Keep — explicit build order after prior triage

## Mission

Deliver a small **React** math quiz for kids with a **live GitHub Pages URL** for the founder.

## v1 scope (locked)

| In | Out |
|----|-----|
| Addition + subtraction, kid-friendly difficulty | Multiplication/division |
| Hebrew RTL UI | Accounts / login |
| Mobile-friendly, touch targets | Backend / DB |
| Score + encouraging feedback | ChemiCloud prod |
| Static deploy (GitHub Pages) | App store |

## Quality bar

Port polish and UX from existing static reference:

- `products/kids-math-quiz/index.html` — gradient, cards, RTL, clamp typography, kid-friendly copy

React must match or exceed that bar.

## Pipeline (execute in order, WIP=1)

1. **You (Keshet)** — Open/update **one** Linear issue under [AZToDev Product — Keshet](https://linear.app/my-company1460/project/aztodev-product-keshet-938f19d950dd). Do **not** duplicate KNG/KG/KNU boards. Create `ops/pipeline/kids-math-game-react/` with at least `01-venture.md` (short Keep memo) + handoff brief.
2. **Yonatan (12-software-architect)** — `02-spec.md`: Vite+React SPA, component tree, no server. Reference static quiz behavior.
3. **Dafna (14-frontend-engineer)** — Build React app in product repo path decided by architect (likely `ZionAmar/kids-math-game-react`). Push-ready bundle.
4. **Paz (18-devops-platform)** — GitHub Actions Pages workflow + Dockerfile optional; staging under `ops/staging/kids-math-game-react/` if needed.
5. **Nadav (34-pc-ops)** — Create public repo, push bundle, enable Pages once in Settings if needed. PC heartbeat ONLINE 2026-09-11T06:16Z.
6. **Uri (20-qa-sdet)** — Mobile RTL smoke + curl 200 on live URL before founder handoff.

## Live context (verified this run)

| URL | Status |
|-----|--------|
| https://zionamar.github.io/cake-recipe-demo/ | **200** (images still pending on branch) |
| https://zionamar.github.io/aztodev-company-system/ | **404** (Nadav backlog — do not block KMG on this) |

Founder pivoted WIP from cake close-out to this bet. Cake image push + company-map Pages remain **background Nadav items**, not Keshet WIP.

## Founder gates

- `productWorkEnabled`: **true** (prior cake «תבנו»+PIN window)
- New bet GO: founder «יאללה צרו את המשחק» — treat as build authorization
- No ChemiCloud prod deploy without separate founder gate

## Deliverables

- [ ] Linear issue link in outbox
- [ ] `ops/pipeline/kids-math-game-react/` started
- [ ] `DELEGATE: 12-software-architect | kids-math-game-react spec per inbox PCI-KMG-01`
- [ ] Update `ops/config/factory.json` activeWork if your run owns state (Noa pre-seeded slug `kids-math-game-react`)

## Evidence rule

Outbox with live URL or honest blocker. No «done» without curl 200.
