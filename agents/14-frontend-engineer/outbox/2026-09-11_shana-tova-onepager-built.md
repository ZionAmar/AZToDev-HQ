# EMET-168 — Shana Tova greeting one-pager — built for real

**Bet:** kept · **Linear:** [EMET-168](https://linear.app/my-company1460/issue/EMET-168/shana-tova-greeting-one-pager-rtl-carousel-pages-publish)
**Founder ask (verbatim):** «אחרי שאתם שמים את זה, לקחו פרויקט חדש, תעשו לי דף, one page כזה, של
שנה טובה, עם תמונות יפות, מבחינתי תמונות מגללות אוטומטי, ברכה יפה, לא צריך חסות למטה, אפשר לשים רק
את ה-ease to dev, זה הכל, ושיהיה ברכה יפה, שנה של בריאות, הצלחה, וכל הדברים.»
**Gate:** Both conditions now met — EMET-167 Done (QA pass) + founder «יאללה»+action PIN received
for this bet, per this run's dispatch. Building for real, not planning.

## What was built

Static HTML/CSS/JS one-pager, Hebrew RTL, no backend, no build step — deploys as-is to GitHub
Pages root. Chose static over a framework here: this is a single greeting screen, not an app with
state/interactions — a React build (like `kids-math-quiz`) would be the wrong tool for the job.

- **Greeting:** warm Hebrew Shana Tova blessing naming health (בריאות), joy (שמחה), success
  (הצלחה), prosperity (שגשוג) and peace (שלווה) — matches the founder's own words almost verbatim
  ("שנה של בריאות, הצלחה, וכל הדברים").
- **Carousel:** 6 original hand-built SVG illustrations (pomegranate, honey & apple, shofar,
  honeycomb, wheat sheaf, festive candles) — no stock-photo licensing risk, no external network
  dependency, crisp at any size. Auto-scrolls via a CSS `translateX` marquee loop (doubled slide
  set for a seamless, non-jumping loop) — matches the founder's literal ask ("תמונות מגללות
  אוטומטי", scrolling, not click-through slides). Added a pause/resume button + honored
  `prefers-reduced-motion` (WCAG 2.2.2 — auto-moving content over 5s must be pausable; this wasn't
  explicitly asked for, but shipping inaccessible motion by default isn't the bar here).
- **Footer:** literally just `EaseToDev` — no sponsor block, no other brand mark, per explicit
  instruction ("לא צריך חסות למטה, אפשר לשים רק את ה-ease to dev").
- **Responsive:** mobile-first grid collapse, carousel slide width scales down under 720px.

## Verified before handoff (not assumed)

```
$ python3 -m http.server 8099 --directory agents/14-frontend-engineer/outbox/shana-tova-bundle
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8099/                       -> 200
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8099/styles.css             -> 200
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8099/script.js              -> 200
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8099/assets/pomegranate.svg -> 200
  (+ honey-apple.svg, shofar.svg, honeycomb.svg, wheat-sheaf.svg, candles.svg — all 200)
$ grep -o 'lang="he"' index.html   -> lang="he"
$ grep -o 'dir="rtl"' index.html   -> dir="rtl"
$ grep -A2 'site-footer' index.html -> <div class="footer-brand">EaseToDev</div>  (only brand mark)
```

Total bundle size: 56K (6 SVGs + HTML + CSS + JS). No frameworks, no build step, no
`node_modules` to ship.

## Handoff

`agents/14-frontend-engineer/outbox/shana-tova-bundle/` — `index.html`, `styles.css`, `script.js`,
`assets/*.svg` (6 files), `README.md` (bundle docs + publish contract, not page content).

## DELEGATE: 18-devops-platform — GITHUB_STATIC_PUBLISH (sent, not yet done)

Live-verified this run **why Cloud cannot publish itself**: `gh api repos/ZionAmar/shana-tova-greeting`
→ not found; `gh repo create ZionAmar/shana-tova-greeting --public` → real `403`/GraphQL
`"Resource not accessible by integration"`. Cloud's GitHub App token stays scoped to `AZToDev-HQ`
only (`gh api /installation/repositories` → `total_count:1`). Per this run's routing rule
("GitHub publish → desk token, not Nadav"), sent the exact publish contract to `18-devops-platform`
(Paz), not `34-pc-ops`:

`agents/18-devops-platform/inbox/2026-09-11_emet-168-github-static-publish-shana-tova.md` —
`REPO:ZionAmar/shana-tova-greeting SOURCE:agents/14-frontend-engineer/outbox/shana-tova-bundle
VISIBILITY:public`.

**Not yet live.** `https://zionamar.github.io/shana-tova-greeting/` does not exist yet (repo not
created). No live link to give the founder this turn.

---

LEARNING:
- do: For a single static greeting/marketing screen (no app state, no interactions beyond a
  carousel), reach for plain HTML/CSS/JS instead of defaulting to the React+Vite pattern used for
  `kids-math-quiz` — matches the actual complexity of the ask and ships a smaller, simpler bundle.
- dont: Don't reach for stock/CC0 photo downloads for a themed carousel without checking network
  reliability and licensing first — building small original SVG illustrations was faster, had zero
  licensing risk, and rendered identically everywhere (no missing-image risk on Pages).
- note: Bundle built + locally verified (all assets 200, RTL/lang/footer checks pass). Publish
  blocked on the same Cloud-token scope limitation as every prior personal-repo bet this session —
  delegated to 18-devops-platform (desk token), not Nadav, per this run's explicit routing rule.
