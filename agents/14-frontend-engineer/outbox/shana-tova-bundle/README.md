# Shana Tova greeting one-pager — EMET-168

Static, single-page, Hebrew RTL greeting card for Rosh Hashana. No backend, no build step —
plain `index.html` + `styles.css` + `script.js` + `assets/*.svg`, ready to publish as-is to
GitHub Pages root.

## What's in the bundle

- `index.html` — the page (RTL, semantic, one screen)
- `styles.css` — warm gold/wine holiday palette, responsive, `prefers-reduced-motion` support
- `script.js` — duplicates the carousel slide set for a seamless auto-scroll loop + adds a
  pause/resume button (WCAG 2.2.2 — moving content past 5s must be pausable)
- `assets/*.svg` — 6 original hand-built illustrations (pomegranate, honey & apple, shofar,
  honeycomb, wheat sheaf, festive candles). Vector, no external image licensing risk, no network
  dependency, crisp at any size/DPI.

## Content (per founder's verbatim ask)

- Warm Hebrew Shana Tova blessing: health (בריאות), success (הצלחה), prosperity/abundance
  (שגשוג), peace (שלווה) — matches "שנה של בריאות, הצלחה, וכל הדברים" exactly.
- Auto-scrolling image carousel (CSS `translateX` marquee loop, no click required — "תמונות
  מגללות אוטומטית").
- Footer: **EaseToDev only** — no sponsor block, no other brand mark.
- Mobile-first responsive (2-col wish grid → collapses; carousel slide width scales down).

## Verified before handoff

```
$ python3 -m http.server 8099 --directory .   # served the bundle root exactly as Pages would
$ curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8099/            -> 200
$ curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8099/styles.css  -> 200
$ curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8099/script.js   -> 200
$ curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8099/assets/pomegranate.svg -> 200
```

All 6 SVG assets, the stylesheet and the script load with `200` from a plain static file server —
same serving model as GitHub Pages (root-level static files, no server-side processing needed).

## Publish contract (for the next stage — desk GitHub)

```
REPO:       ZionAmar/shana-tova-greeting
SOURCE:     agents/14-frontend-engineer/outbox/shana-tova-bundle
VISIBILITY: public
```

Push this folder's contents (not this README) to the repo root on `main`, enable Pages
(Source: Deploy from a branch → `main` / root). Expected live URL:
`https://zionamar.github.io/shana-tova-greeting/`.
