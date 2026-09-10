# cake-recipe-demo — git show from origin/main

**Agent:** Paz (18-devops-platform)  
**Date:** 2026-09-10  
**Task:** PCI-16 helper — verbatim file dump from `origin/main` for Nadav PC shell outage

## Latest commit

```
1e264c3 chore(32-delivery-lead): unify Nadav cake-recipe-demo ask (PCI-17b), update EMET-165 status, correct factory.json after merging orphaned devops branches
```

## Files present on origin/main

| Path | Status |
|------|--------|
| `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html` | present |
| `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/styles.css` | present |
| `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/README.md` | present |
| `ops/staging/cake-recipe-demo/Dockerfile` | present |
| `ops/staging/cake-recipe-demo/.dockerignore` | present |
| `ops/staging/cake-recipe-demo/.github/workflows/pages.yml` | present |
| `ops/staging/cake-recipe-demo/PAGES_SETUP.md` | present |
| `ops/exports/cake-recipe-demo/index.html` | **MISSING** on origin/main |

## Method

```bash
git fetch origin main
git log -1 --oneline origin/main
git show origin/main:<path>   # for each path
```

Full verbatim contents delivered inline in Cloud run response (fenced blocks per file).

## Note for PC ops

`ops/exports/cake-recipe-demo/index.html` does not exist on `origin/main`. Use bundle at `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html` as source for product repo push.
