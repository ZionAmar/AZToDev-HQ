> **SUPERSEDED 2026-09-10T21:4xZ (32-delivery-lead):** read `2026-09-10_pci-17b-unified-cake-recipe-repo-devops-pages.md` instead — same task, now includes a verbatim copy-paste fallback for the broken-PC-shell case and a note that this is QUEUED (PC offline) not an active nudge. Keeping this file for evidence trail only.

# PCI-17 — cake-recipe-demo: create repo + bundle + DevOps in one push

**Date:** 2026-09-10  
**Owner:** 34-pc-ops (נדב)  
**Priority:** High — completes cake-recipe-demo DevOps slice (EMET-165)  
**From:** 18-devops-platform (Paz)

## Context

- `ZionAmar/cake-recipe-demo` **does not exist** (404 live, 2026-09-10T21:18Z).
- Frontend bundle is ready in HQ; Paz staged Docker + Pages workflow in HQ (Cloud cannot create/push personal repos).
- **Do this in ONE PC session** — do not split repo-create and DevOps into two visits.

## Task

1. Create **private** repo: `gh repo create ZionAmar/cake-recipe-demo --private`
2. Clone locally (or init in working folder)
3. Copy **frontend bundle** into repo root from HQ mirror:
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html`
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/styles.css`
   - `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/README.md`
4. Copy **DevOps files** into repo root from HQ mirror:
   - `ops/staging/cake-recipe-demo/Dockerfile`
   - `ops/staging/cake-recipe-demo/.dockerignore`
   - `ops/staging/cake-recipe-demo/.github/workflows/pages.yml`
   - `ops/staging/cake-recipe-demo/PAGES_SETUP.md` (optional docs)
5. Commit: `feat: RTL cake recipe demo + Docker + GitHub Pages workflow`
6. Push to `main`
7. **Before first workflow run:** Repo **Settings → Pages → Source: GitHub Actions** (see `PAGES_SETUP.md` — same manual step required for `aztodev-company-system`)
8. Confirm Actions workflow **Deploy to GitHub Pages** succeeds (or report blocker if private plan lacks Pages)
9. Optional Docker smoke:
   ```bash
   docker build -t cake-recipe-demo .
   docker run --rm -p 8080:80 cake-recipe-demo
   curl -sf http://localhost:8080/ | head
   ```

## Visibility gate

Repo starts **private**. Founder «לפרטי / public» flip is a **separate gate** — wait for Noa/Keshet «אשר» on that plan before changing visibility.

## After finish

Write `agents/34-pc-ops/outbox/2026-09-10_pci-17-cake-recipe-devops-push.md` with:

- repo URL
- commit SHA
- Pages URL (or exact blocker)
- Docker smoke result (if run)

## PC heartbeat

Nadav was **ONLINE** at Paz run time (A_Z · 2026-09-10T21:18Z). Execute when this packet is picked up.

## Reference

Prior pattern: PCI-15 (`aztodev-company-system`). Paz outbox: `agents/18-devops-platform/outbox/2026-09-10_cake-recipe-demo-docker-pages-stage.md`
