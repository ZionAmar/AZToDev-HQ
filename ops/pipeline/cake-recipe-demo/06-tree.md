# 06-tree — cake-recipe-demo repo layout

Target repo: `ZionAmar/cake-recipe-demo` (private, created in Cloud build phase).

```
cake-recipe-demo/
├── index.html              # Single page — all sections
├── css/
│   └── styles.css          # Tokens + layout (or inline in index if single-file preferred)
├── images/                 # Optional local copies; CDN URLs also OK
│   ├── hero.jpg
│   ├── step-mix.jpg
│   ├── step-pan.jpg
│   └── step-glaze.jpg
├── Dockerfile              # nginx:alpine, COPY static files
├── docker-compose.yml      # port 8080:80 for local preview
├── .dockerignore
├── README.md               # Hebrew: how to run locally + live URL
└── .github/
    └── workflows/
        └── pages.yml       # Optional — Paz may use gh pages deploy instead
```

## HQ mirror (this repo)

Planning artifacts only — no product code in AZToDev-HQ:

```
ops/pipeline/cake-recipe-demo/
├── 02-spec.md
├── 03-screens.md
├── 04-usecases.md
├── 05-db.md                # N/A marker
└── 06-tree.md
```

## Request path (C4 lite)

```
[Visitor Browser]
       │ HTTPS
       ▼
[GitHub Pages CDN] ── serves ──► index.html, css/, images/
```

Local dev path:

```
[Developer] ── docker compose up ──► [nginx:alpine:80] ──► ./index.html
```
