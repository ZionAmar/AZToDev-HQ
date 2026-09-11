# EMET-168 — GITHUB_STATIC_PUBLISH: shana-tova-greeting

**Date:** 2026-09-11 · **Owner:** 18-devops-platform (פז) — desk GitHub token, **not** Nadav/PC
**Linear:** [EMET-168](https://linear.app/my-company1460/issue/EMET-168/shana-tova-greeting-one-pager-rtl-carousel-pages-publish) · **From:** 32-delivery-lead (קשת)
**Gate:** Founder «יאללה» + action PIN received for this bet (HQ ACTION PIN window unlocked
2026-09-11, per this run's dispatch). `productWorkEnabled=true`. No further founder gate needed
for this publish step — proceed.

## Task — `GITHUB_STATIC_PUBLISH`

```
REPO:       ZionAmar/shana-tova-greeting
SOURCE:     agents/14-frontend-engineer/outbox/shana-tova-bundle
VISIBILITY: public
```

1. Create the repo (`gh repo create ZionAmar/shana-tova-greeting --public`) — **verified from
   Cloud this run it does not exist yet** (`gh api repos/ZionAmar/shana-tova-greeting` →
   "Could not resolve to a Repository"; `gh repo create` from Cloud → real `403 Resource not
   accessible by integration`, same as every prior personal-repo attempt this session).
2. Push the **bundle root files** from
   `agents/14-frontend-engineer/outbox/shana-tova-bundle/` — `index.html`, `styles.css`,
   `script.js`, `assets/*.svg` — to `main`, repo root. Do **not** push the bundle's own
   `README.md` as if it were site content (keep it in the repo for reference, just don't expect
   it to render); it documents the bundle, it isn't a page.
3. Enable GitHub Pages: Settings → Pages → Source: **Deploy from a branch → `main` / `(root)`**.
4. Verify: `curl -I https://zionamar.github.io/shana-tova-greeting/` → expect `200`.

## Why this needs you specifically (not Cloud, not Nadav)

Live-verified this run: Cloud's GitHub App token is still scoped to `AZToDev-HQ` only
(`gh api /installation/repositories` → `total_count:1`) and gets a real `403`/GraphQL
`"Resource not accessible by integration"` on both `gh api user` and
`gh repo create ZionAmar/shana-tova-greeting` — cannot create or push to any personal repo.
Per this run's own dispatch instructions, GitHub publish for this bet goes through **your desk
token** (the ChemiCloud auto-push bridge that already landed `cake-recipe-demo` and
`kids-math-quiz` live), not through Nadav's PC. If that desk token/bridge is unavailable, say so
loudly in your outbox — do not silently wait on a PC heartbeat that isn't the right path for this
step.

## Definition of done

- [ ] Repo `ZionAmar/shana-tova-greeting` exists, public
- [ ] `index.html`, `styles.css`, `script.js`, `assets/*.svg` on `main` at repo root
- [ ] Pages enabled, source = `main` / root
- [ ] `curl -I https://zionamar.github.io/shana-tova-greeting/` → `200`
- [ ] Outbox: `agents/18-devops-platform/outbox/2026-09-11_emet-168-shana-tova-published.md`
      with repo URL, commit SHA, Pages URL, curl status — or the exact blocker if any step fails

Once step 4 passes, notify `20-qa-sdet` (Uri) directly for live QA, and copy
`32-delivery-lead/inbox/` so the founder gets the real live link — not a guess.

## Bundle contents (already built + locally verified — see the bundle's own README)

- Warm Hebrew Shana Tova blessing (health / success / prosperity / peace — matches founder's
  verbatim ask)
- Auto-scrolling image carousel — 6 original SVG illustrations (pomegranate, honey & apple,
  shofar, honeycomb, wheat sheaf, candles), CSS `translateX` marquee loop, pause/resume button
- Footer: **EaseToDev only** — no sponsor block
- Mobile-responsive, `prefers-reduced-motion` respected
- Verified locally: served via `python3 -m http.server` from the bundle root, `curl` on
  `index.html` + `styles.css` + `script.js` + all 6 SVGs → all `200`
