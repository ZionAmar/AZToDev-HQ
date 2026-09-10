# UI tokens — cake-recipe-demo

**From:** 12-software-architect (יונה) · **To:** 09-ui-designer (בועז) · **Date:** 2026-09-10  
**Bet:** `cake-recipe-demo` · **Linear:** [EMET-116](https://linear.app/my-company1460/issue/EMET-116) (KSH-04 · בועז — if assigned)  
**Gate:** `productWorkEnabled=true` for this bet.

## Task

Produce a **visual design pass** (tokens + component notes) for a single Hebrew RTL recipe page. Dafna builds HTML/CSS; you refine polish before Paz ships.

## Read first

1. `ops/pipeline/cake-recipe-demo/02-spec.md` — tokens table + content
2. `ops/pipeline/cake-recipe-demo/03-screens.md` — section layout
3. `products/kids-math-quiz/index.html` — quality bar

## Deliverable

Write to `agents/09-ui-designer/outbox/2026-09-10_cake-recipe-ui-tokens.md`:

- CSS custom properties (confirm or adjust spec tokens)
- Typography scale (h1, h2, body, meta pills)
- Component specs: hero overlay, ingredient card, step card, tip card
- Spacing rhythm (8px grid)
- Optional: simple wireframe ASCII or Mermaid block diagram

**Do not** build the full HTML — that's Dafna. Hand off tokens; she implements.

## Definition of done

- Outbox file with copy-paste-ready CSS `:root` block
- DELEGATE or note when Dafna can proceed (parallel OK if she starts from architect spec)
