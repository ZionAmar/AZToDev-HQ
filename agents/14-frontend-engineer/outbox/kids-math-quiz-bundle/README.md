# kids-math-quiz — built bundle (ready to publish)

**Bet:** PCI-KMG-01 · Linear `EMET-167` · Founder ask (verbatim): «צרו לי משחק מתמטיקה קטן לילדים
בריאקט ועשו הכל ותנו לי קישור בסוף לאתר»

Hebrew RTL math quiz for kids ages ~6–10. Addition, subtraction, multiplication. 10 questions,
score circle, per-operation breakdown, personalized insight text, mobile-first responsive layout.
Built with **React 19 + Vite 8**, compiled to a static bundle (no server / no backend needed).

## What's in this folder

- `index.html`, `assets/`, `favicon.svg`, `icons.svg` — **the built static site** (output of
  `npm run build` from `source/`). This is what gets published — push these files as-is to the
  target repo root.
- `source/` — full React/Vite source (`src/App.jsx`, `src/quizEngine.js` question generator,
  `src/App.css`, `package.json`, `vite.config.js`) for future edits. To rebuild: `cd source && npm
  install && npm run build`, then copy `source/dist/*` back into this folder's root.

`vite.config.js` uses `base: './'` (relative asset paths) so this works whether it's served from a
domain root or a GitHub Pages project subpath (`/kids-math-quiz/`) — no path rewriting needed at
publish time.

## Publish instructions (for 34-pc-ops / desk)

1. Create (or use) GitHub repo **`ZionAmar/kids-math-quiz`**, visibility **public**.
2. Push the contents of **this folder's root** (`index.html`, `assets/`, `favicon.svg`,
   `icons.svg` — NOT the `source/` folder) to `main`, repo root.
3. Enable GitHub Pages: Settings → Pages → **Source: Deploy from a branch → `main` / `(root)`**.
4. Verify: `curl -I https://zionamar.github.io/kids-math-quiz/` → expect `200`.

## Verified locally before handoff

- `npm run build` — succeeded, 18 modules transformed, no errors.
- `npm run lint` (oxlint) — 0 issues.
- Served `dist/` via `python -m http.server` and curled `index.html` + JS bundle → both `200`,
  correct RTL Hebrew markup, correct relative asset paths.

## Definition of done reference

Matches the existing `products/kids-math-quiz/index.html` (vanilla-JS quality bar already in this
HQ repo) for visual design and UX, reimplemented as real React components + hooks per the
founder's explicit "בריאקט" request, extended with a proper Vite build pipeline.
