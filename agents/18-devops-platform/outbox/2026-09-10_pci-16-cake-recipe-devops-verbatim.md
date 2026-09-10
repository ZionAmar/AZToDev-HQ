# PCI-16 — cake-recipe-demo DevOps files (verbatim for broken PC shell)

**Date:** 2026-09-10 · **Owner:** 18-devops-platform (Paz)  
**Source branch:** `cursor/cake-recipe-docker-pages-stage-18eb`  
**Source path:** `ops/staging/cake-recipe-demo/`  
**Reason:** Founder PC shell outage (0xC0000142) — Nadav cannot `git fetch`; copy-paste payloads below.

## Files (4)

All contents extracted verbatim from HQ branch via `git show origin/cursor/cake-recipe-docker-pages-stage-18eb:ops/staging/cake-recipe-demo/<file>`.

---

### Dockerfile

```dockerfile
FROM nginx:1.27-alpine

# Static RTL cake recipe demo — no secrets, no build step
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY README.md /usr/share/nginx/html/README.md

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

---

### .dockerignore

```
.git
.github
Dockerfile
.dockerignore
```

---

### .github/workflows/pages.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload static site
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### PAGES_SETUP.md

```markdown
# GitHub Pages setup — cake-recipe-demo

## One-time repo settings (founder or PC with admin)

1. Open **Settings → Pages** on `ZionAmar/cake-recipe-demo`.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Private-repo Pages requires a paid GitHub plan (Pro/Team/Enterprise). If Pages is unavailable on a free private repo, either:
   - make the repo public (founder decision — see EMET-165 / Noa gate), or
   - use Docker locally: `docker build -t cake-recipe-demo . && docker run -p 8080:80 cake-recipe-demo`

## After first push with workflow

1. Merge/push `main` including `.github/workflows/pages.yml`.
2. **Actions** tab → confirm **Deploy to GitHub Pages** succeeds.
3. Live URL (project site): `https://zionamar.github.io/cake-recipe-demo/`

## Docker (local preview)

```bash
docker build -t cake-recipe-demo .
docker run --rm -p 8080:80 cake-recipe-demo
# open http://localhost:8080
```
```

---

## PC apply (when shell returns)

Copy into `ZionAmar/cake-recipe-demo` repo root alongside `index.html`, `styles.css`, `README.md`:

| Local path | Source |
|------------|--------|
| `Dockerfile` | above |
| `.dockerignore` | above |
| `.github/workflows/pages.yml` | above |
| `PAGES_SETUP.md` | above |

Then follow PAGES_SETUP.md one-time Settings toggle before first Actions deploy.
