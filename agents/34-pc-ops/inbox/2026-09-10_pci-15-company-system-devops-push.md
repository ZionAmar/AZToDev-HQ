# PCI-15 — aztodev-company-system: DevOps files push

**Date:** 2026-09-10  
**Owner:** 34-pc-ops (נדב)  
**Priority:** High — completes Dafna pipeline DevOps slice  
**From:** 18-devops-platform (Paz)

## Context

Dafna slice 1: `index.html` + `README` on `ZionAmar/aztodev-company-system` (pushed from PC).  
Paz prepared Docker + GitHub Pages workflow in HQ staging (Cloud cannot see/push this repo).

## Task

1. Confirm repo exists: `gh repo view ZionAmar/aztodev-company-system`
2. Clone (or pull) repo locally from `C:\Users\amazi\Desktop\my_company\ops\exports\aztodev-company-system` or fresh clone
3. Copy from HQ mirror into repo root (do not overwrite Dafna's `index.html`):
   - `ops/staging/aztodev-company-system/Dockerfile`
   - `ops/staging/aztodev-company-system/.dockerignore`
   - `ops/staging/aztodev-company-system/.github/workflows/pages.yml`
   - `ops/staging/aztodev-company-system/PAGES_SETUP.md` (optional docs)
4. Commit: `feat(devops): add Dockerfile and GitHub Pages workflow`
5. Push to `main`
6. Repo **Settings → Pages → Source: GitHub Actions** (if not already)
7. Confirm Actions workflow **Deploy to GitHub Pages** succeeds

## After finish

Write `agents/34-pc-ops/outbox/2026-09-10_pci-15-company-system-devops-push.md` with:
- commit SHA
- Pages URL (or blocker if private plan lacks Pages)
- Docker smoke result (optional)

## PC heartbeat

Nadav was OFFLINE at Paz run time — this packet queues until Windows is on.
