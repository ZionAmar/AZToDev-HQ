# Stage Docker + GitHub Pages for cake-recipe-demo (parallel prep, no PC needed)

**Date:** 2026-09-10 · **Owner:** 18-devops-platform (פז) · **From:** 32-delivery-lead (קשת)
**Linear:** [EMET-165](https://linear.app/my-company1460/issue/EMET-165) (Done — planning) · [EMET-115](https://linear.app/my-company1460/issue/EMET-115) (Done — architect) · bet: `cake-recipe-demo`
**Gate:** `productWorkEnabled=true` for this bet — no PIN needed for this task (Cloud-only staging, no repo write).

## Why this task exists

`ZionAmar/cake-recipe-demo` does **not exist yet on GitHub** (live-verified `gh api repos/ZionAmar/cake-recipe-demo` → 404, 2026-09-10T21:07Z). Nadav (34-pc-ops) has not created/pushed it despite three prior nudges. Waiting idle for him wastes flow — stage the DevOps slice now, exactly like the proven pattern already used for `aztodev-company-system` (see `ops/staging/aztodev-company-system/` + `agents/18-devops-platform/outbox/2026-09-10_dafna-company-system-docker-pages.md`), so the moment Nadav creates the repo he can copy-paste one folder and be done in a single push.

## Inputs (already built, real)

- Frontend bundle (ready to serve as static site): `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/{index.html,styles.css,README.md}`
- Architect spec: `ops/pipeline/cake-recipe-demo/02-spec.md` (tokens, content, recipe: עוגת שוקולד — confirm exact title matches frontend `index.html` `<title>`/`<h1>`, reconcile any drift between architect's "קלאסית" wording and frontend's "רכה" wording — not a blocker, just note if inconsistent).

## Task

1. Create `ops/staging/cake-recipe-demo/` in this HQ repo (same pattern as `ops/staging/aztodev-company-system/`):
   - `Dockerfile` — `nginx:1.27-alpine`, `COPY index.html / styles.css / README.md` into `/usr/share/nginx/html/`, healthcheck, same shape as the aztodev-company-system one (adjust filenames for CSS).
   - `.dockerignore`
   - `.github/workflows/pages.yml` — GitHub Actions "Deploy to GitHub Pages" workflow, identical shape to the aztodev-company-system one (checkout → configure-pages → upload-pages-artifact → deploy-pages). Trigger on push to `main`.
   - `PAGES_SETUP.md` — one-time manual step Nadav must do in repo Settings → Pages → Source: GitHub Actions (same lesson learned from the aztodev-company-system Pages failure — the Actions workflow cannot bootstrap Pages from zero without this one manual toggle first).
2. **Do not** try to push to `ZionAmar/cake-recipe-demo` — it doesn't exist and Cloud has `admin:false`/`push:false` on all personal repos (verified live this run). This is staging-only, inside the HQ repo.
3. Locally smoke-test the Dockerfile against the actual bundle (`docker build` + `docker run` + curl localhost) if Docker is available in this Cloud session — real verification, not "should work."
4. Write `agents/18-devops-platform/outbox/2026-09-10_cake-recipe-demo-docker-pages-stage.md` with what you built + smoke-test result (or honest blocker if Docker isn't available in this sandbox).
5. Write `agents/34-pc-ops/inbox/2026-09-10_pci-17-cake-recipe-devops-push.md` (same pattern as PCI-15) telling Nadav exactly which 4 files to copy from `ops/staging/cake-recipe-demo/` into the new repo, in the SAME push as the initial bundle+repo-create — do not make him do 2 separate PC sessions for one repo.

## Sequencing note (WIP=1, no violation)

This is Cloud-side prep work, does not touch any product repo, and runs in parallel while Nadav's PC-only queue (HQ-private revert, aztodev-company-system Pages, cake-recipe-demo repo create) is stalled. It does not compete for the WIP=1 slot — same reasoning already used for pausedWork vs PC-side work.

## After you finish

DELEGATE back to `32-delivery-lead` with outbox path — I'll fold it into the pipeline status and hand the consolidated Nadav ask (repo create + this devops bundle + public + Pages enable, all in one PC session) once you've written PCI-17.
