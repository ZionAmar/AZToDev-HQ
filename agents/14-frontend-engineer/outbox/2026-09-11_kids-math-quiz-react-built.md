# kids-math-quiz — React/Vite build complete

**Bet:** PCI-KMG-01 · Linear `EMET-167` · From: 32-delivery-lead (קשת) delegation
**Founder ask (verbatim):** «צרו לי משחק מתמטיקה קטן לילדים בריאקט ועשו הכל ותנו לי קישור בסוף לאתר»

## Built

Real React (v19) + Vite (v8) app — not a static-HTML stand-in. Hebrew RTL, mobile-first,
ages ~6–10, addition/subtraction/multiplication, 10 questions per round, score circle,
per-operation breakdown, personalized Hebrew insight text, restart flow.

- `src/App.jsx` — `QuizScreen` + `ResultsScreen` components, `useState`/`useMemo`/`useRef` hooks
- `src/quizEngine.js` — question pool/generator, scoring, insight text (pure functions, no DOM)
- `src/App.css` / `src/index.css` — visual design matches `products/kids-math-quiz/index.html`
  (existing HQ quality-bar asset): gradient background, card + shadow, clamp() typography,
  2-column answer grid collapsing to 1 column under 360px.
- `vite.config.js` — `base: './'` so the build works from any path (GitHub Pages project subpath
  or domain root) with zero rewriting.

## Verified before handoff

- `npm install` — clean, 0 vulnerabilities.
- `npm run build` — succeeded (`dist/index.html`, `dist/assets/index-*.js` + `.css`).
- `npm run lint` (oxlint) — 0 issues.
- Served `dist/` locally (`python -m http.server`), curled `/` and the JS bundle — both `200`,
  RTL markup confirmed, relative asset paths resolve correctly.

## Handoff location

`agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` — built static output at the bundle
root (what gets published) + full source under `bundle/source/` (what to edit next time).
Full publish instructions are in that folder's own `README.md`.

## Not done here (next stage)

Repo creation + push to `ZionAmar/kids-math-quiz` + Pages enable — that's `34-pc-ops`'s lane
(desk/PC GitHub write access), not Cloud frontend build. See
`agents/32-delivery-lead/outbox/2026-09-11_pci-kmg-01-react-build-and-publish-attempt.md` for the
live publish attempt and result.

LEARNING:
- do: When a "build X in React" ask already has a matching static-HTML quality-bar asset in the
  repo (`products/kids-math-quiz/`), port its exact visual design + question logic into real React
  components instead of inventing new UX — keeps founder-visible quality consistent and cuts
  design risk to zero.
- dont: Don't ship a build without a real `npm run build` + local serve/curl check — "should work"
  isn't evidence in this company.
- note: First real (non-relay) turn on PCI-KMG-01 — prior three turns on this slug found no packet
  and correctly held. This turn arrived with the actual founder ask attached, so it was built for
  real: React/Vite app, built, linted, smoke-tested, handed off as a bundle ready for the desk to
  push verbatim (no build step needed on their side).
