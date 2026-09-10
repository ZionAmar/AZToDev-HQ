# PCI-16 — cake-recipe-demo DevOps staging files (verbatim for PC Write)

**Date:** 2026-09-10  
**Agent:** 18-devops-platform (Paz)  
**For:** 34-pc-ops (Nadav) — PC shell broken; copy these files locally without git fetch  
**Target repo:** `ZionAmar/cake-recipe-demo` (create if missing)  
**Source branch (HQ):** `cursor/cake-recipe-docker-pages-stage-18eb` → `ops/staging/cake-recipe-demo/`

## סיכום (נועה → ציון)

ארבעת קבצי ה-DevOps ל-cake-recipe-demo מוכנים למטה במלואם. נדב יכול ל-Write אותם ישירות לריפו החדש באותו push עם ה-bundle (`index.html`, `styles.css`, `README.md`). אחרי push: Settings → Pages → Source: **GitHub Actions** (חובה — אותו כשל כמו aztodev-company-system).

## Where to write (repo root layout)

```
cake-recipe-demo/
├── index.html          ← from agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/
├── styles.css          ← same bundle
├── README.md           ← same bundle
├── Dockerfile          ← below
├── .dockerignore       ← below
├── PAGES_SETUP.md      ← below
└── .github/
    └── workflows/
        └── pages.yml   ← below
```

## Expected live URL (after push + Pages enabled)

`https://zionamar.github.io/cake-recipe-demo/`

---

## File: `Dockerfile`

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

## File: `.dockerignore`

```
.git
.github
Dockerfile
.dockerignore
```

---

## File: `.github/workflows/pages.yml`

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

## File: `PAGES_SETUP.md`

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

## Nadav checklist (item 3 from PCI-16)

1. `gh repo create ZionAmar/cake-recipe-demo --private --confirm` (or `--public` if skipping flip)
2. Write all 7 files above into repo root (3 bundle + 4 DevOps)
3. `git add -A && git commit -m "Initial cake recipe demo + Docker + Pages" && git push -u origin main`
4. `gh repo edit ZionAmar/cake-recipe-demo --visibility public` (founder «אשר» on record)
5. Settings → Pages → Source: **GitHub Actions** → Save
6. Confirm: `curl -I https://zionamar.github.io/cake-recipe-demo/` → expect `200`

## Docker smoke (optional on PC)

```bash
docker build -t cake-recipe-demo .
docker run --rm -p 8080:80 cake-recipe-demo
curl -sf http://localhost:8080/ | head
```

## Provenance

Files verified from HQ branch `cursor/cake-recipe-docker-pages-stage-18eb` via `git show` (2026-09-10T21:3xZ). Pattern matches proven `ops/staging/aztodev-company-system/` slice.

---

DELEGATE: 34-pc-ops | Write these 4 DevOps files + bundle into `ZionAmar/cake-recipe-demo` in one push; enable Pages (GitHub Actions source); report in `agents/34-pc-ops/outbox/2026-09-10_pci-16-consolidated-urgent-checklist.md`

HANDOFF:
- done: Full verbatim DevOps staging files (Dockerfile, .dockerignore, pages.yml, PAGES_SETUP.md) packaged for PC Write without git
- next: Nadav creates repo, writes all files, pushes, enables Pages, confirms 200
- files: `agents/18-devops-platform/outbox/2026-09-10_pci-16-cake-recipe-staging-files.md`

LEARNING:
- do: When PC shell is broken, embed FULL raw file contents in outbox so 34-pc-ops can Write locally — same pattern as PCI-15 staging + verbatim handoff
- dont: Tell Nadav to git-fetch HQ branches when his shell returns 0xC0000142 — give him copy-paste payloads instead
- note: PCI-16 cake-recipe DevOps files extracted from cursor/cake-recipe-docker-pages-stage-18eb into verbatim outbox for PC ops
