# Build — cake-recipe-demo static page

**From:** 12-software-architect (יונה) · **To:** 14-frontend-engineer (דפנה) · **Date:** 2026-09-10  
**Bet:** `cake-recipe-demo` · **Linear:** [EMET-117](https://linear.app/my-company1460/issue/EMET-117) (KSH-05 · דפנה — if assigned)  
**Gate:** `productWorkEnabled=true` — cleared to build.

## Task

Build the **single-page Hebrew RTL chocolate cake recipe** in a **new private GitHub repo** `ZionAmar/cake-recipe-demo`. Create repo from Cloud, push code, open PR if useful.

## Read first (mandatory)

| File | What |
|------|------|
| `ops/pipeline/cake-recipe-demo/02-spec.md` | Full recipe text, tokens, images, NFR |
| `ops/pipeline/cake-recipe-demo/03-screens.md` | Section layout + states |
| `ops/pipeline/cake-recipe-demo/06-tree.md` | Repo structure |
| `products/kids-math-quiz/index.html` | Quality bar |

Optional: `agents/09-ui-designer/outbox/` if Boaz finished tokens first.

## Build requirements

- Static HTML + CSS (JS optional: smooth scroll / print helper only)
- `lang="he"` `dir="rtl"` on `<html>`
- All recipe content from spec — do not invent different recipe
- Real stock images (Unsplash CDN or files in `images/`) — no gray placeholders in shipped page
- Mobile responsive per `03-screens.md`
- Match polish of kids-math-quiz (gradient bg, cards, shadows, clamp typography)

## Repo setup

```
cake-recipe-demo/
├── index.html
├── css/styles.css
├── images/ (optional)
├── Dockerfile          # nginx:alpine — stub OK; Paz completes
├── docker-compose.yml  # stub OK; Paz completes
└── README.md
```

Create **private** repo `ZionAmar/cake-recipe-demo` via `gh repo create` from this Cloud session.

## Definition of done

- Repo exists with working `index.html` (verify locally: open file or `python -m http.server`)
- Outbox: `agents/14-frontend-engineer/outbox/2026-09-10_cake-recipe-built.md` with repo URL + screenshot path or describe verification
- **DELEGATE: 18-devops-platform |** Add/finish Dockerfile + docker-compose, enable GitHub Pages, return **live URL** to founder

## Do not

- Add backend, DB, React build chain, or ChemiCloud deploy
- Wait for Boaz if spec tokens are enough — start from architect spec; merge Boaz tokens if he lands first
