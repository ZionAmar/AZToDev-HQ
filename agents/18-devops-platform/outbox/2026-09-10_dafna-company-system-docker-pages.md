# Dafna pipeline — Docker + GitHub Pages (DevOps slice)

**Date:** 2026-09-10  
**Agent:** 18-devops-platform (Paz)  
**Target repo:** https://github.com/ZionAmar/aztodev-company-system (branch `main`)  
**Scope:** GitHub only — no ChemiCloud deploy

## Summary

Prepared Dockerfile (nginx static) and GitHub Actions Pages workflow. **Cloud could not push to the product repo** — same GitHub App scope limit as PCI-14 (`gh repo view` → 404; only AZToDev-HQ visible). Staging bundle committed to HQ; **34-pc-ops must copy and push** from founder PC auth.

## Artifacts (HQ staging — copy into product repo root)

| File | Purpose |
|------|---------|
| `ops/staging/aztodev-company-system/Dockerfile` | nginx:1.27-alpine serves `index.html` + `README.md` on port 80 |
| `ops/staging/aztodev-company-system/.dockerignore` | Keeps image lean |
| `ops/staging/aztodev-company-system/.github/workflows/pages.yml` | Deploy static site from `main` via GitHub Pages |
| `ops/staging/aztodev-company-system/PAGES_SETUP.md` | One-time Pages settings + Docker local preview |

## Expected live URL (after PC push + Pages enabled)

`https://zionamar.github.io/aztodev-company-system/`

## One-time GitHub settings

1. Repo **Settings → Pages → Source: GitHub Actions**
2. Private repo Pages needs GitHub Pro/Team — see `PAGES_SETUP.md` if build is blocked

## Verification attempted (Cloud)

```text
gh repo view ZionAmar/aztodev-company-system → Could not resolve to a Repository
git clone (HQ token) → remote: Repository not found
gh repo list ZionAmar → 10 repos; aztodev-company-system not listed
```

Nadav slice-1 push may exist on founder account but is invisible to Cloud token until repo is added to Cursor GitHub App **or** PC pushes DevOps files.

## Next owner

**34-pc-ops** — inbox packet: `agents/34-pc-ops/inbox/2026-09-10_pci-15-company-system-devops-push.md`

## Docker smoke (after files land in repo)

```bash
docker build -t aztodev-company-system .
docker run --rm -p 8080:80 aztodev-company-system
curl -sf http://localhost:8080/ | head
```
