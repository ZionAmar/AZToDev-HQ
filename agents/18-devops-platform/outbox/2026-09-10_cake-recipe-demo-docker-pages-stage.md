# cake-recipe-demo — Docker + GitHub Pages (DevOps staging)

**Date:** 2026-09-10  
**Agent:** 18-devops-platform (Paz)  
**Target repo:** `ZionAmar/cake-recipe-demo` (does not exist yet — 404 live)  
**Scope:** HQ staging only — no product-repo push from Cloud

## Summary

Staged Dockerfile (nginx static), GitHub Actions Pages workflow, and setup docs under `ops/staging/cake-recipe-demo/`, mirroring the proven `aztodev-company-system` pattern. **34-pc-ops** must create the repo and push bundle + DevOps files in **one PC session** (PCI-17).

## Artifacts (HQ staging — copy into product repo root)

| File | Purpose |
|------|---------|
| `ops/staging/cake-recipe-demo/Dockerfile` | nginx:1.27-alpine serves `index.html`, `styles.css`, `README.md` on port 80 |
| `ops/staging/cake-recipe-demo/.dockerignore` | Keeps image lean |
| `ops/staging/cake-recipe-demo/.github/workflows/pages.yml` | Deploy static site from `main` via GitHub Pages |
| `ops/staging/cake-recipe-demo/PAGES_SETUP.md` | One-time Pages settings + Docker local preview |

## Frontend bundle source (copy with DevOps files)

From `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/`:

- `index.html`
- `styles.css`
- `README.md`

Evidence: `agents/14-frontend-engineer/outbox/2026-09-10_cake-recipe-demo-rtl-page.md`

## Title wording note (non-blocker)

| Source | Title |
|--------|-------|
| Architect spec (`02-spec.md`) | עוגת שוקולד **עשירה** |
| Frontend (`index.html` `<title>` / `<h1>`) | עוגת שוקולד **רכה** |

Same recipe intent; frontend chose "רכה" while spec says "עשירה". No DevOps impact — flag for Keshet/QA if founder cares about exact wording.

## Expected live URL (after PC push + Pages enabled)

`https://zionamar.github.io/cake-recipe-demo/`

## One-time GitHub settings (Nadav)

1. Repo **Settings → Pages → Source: GitHub Actions** (required before first workflow run — same failure mode as `aztodev-company-system` run `34526813041`)
2. Private-repo Pages may need GitHub Pro/Team — see `PAGES_SETUP.md`

## Verification (Cloud)

### Repo existence

```text
gh api repos/ZionAmar/cake-recipe-demo → 404 Not Found (2026-09-10T21:18Z)
```

### Docker smoke test

```text
docker: command not found (Cloud sandbox — Docker not installed)
```

**Honest blocker:** Could not run `docker build` / `docker run` / `curl` in this session. Dockerfile shape matches the smoke-tested `aztodev-company-system` pattern (same nginx base, healthcheck, COPY layout — with added `styles.css`). Nadav or QA should run Docker smoke after push:

```bash
docker build -t cake-recipe-demo .
docker run --rm -p 8080:80 cake-recipe-demo
curl -sf http://localhost:8080/ | head
```

### Bundle sanity (static)

- All three COPY targets exist in frontend bundle
- `index.html` references `styles.css` (relative path — correct for nginx root serve)

## Next owner

**34-pc-ops** — inbox packet: `agents/34-pc-ops/inbox/2026-09-10_pci-17-cake-recipe-devops-push.md`

Then **32-delivery-lead** folds into pipeline status.

## Separate gate (not this task)

Founder «לפרטי, לפרטי, להפוך אותו לפרטי» plan still waits for «אשר» — do not flip visibility from this Cloud slice.
