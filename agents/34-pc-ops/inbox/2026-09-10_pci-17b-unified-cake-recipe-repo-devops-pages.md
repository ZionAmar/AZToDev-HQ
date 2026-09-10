# PCI-17b — UNIFIED: cake-recipe-demo repo create + bundle + DevOps + Pages (ONE push)

**Date:** 2026-09-10T21:4xZ · **Owner:** 34-pc-ops (נדב) · **From:** 32-delivery-lead (קשת), folding in 18-devops-platform (פז)
**Linear:** [EMET-165](https://linear.app/my-company1460/issue/EMET-165) · [EMET-115](https://linear.app/my-company1460/issue/EMET-115) (Done)
**Status:** QUEUED — PC heartbeat OFFLINE this run. This is not a nudge waiting for a reply; it runs automatically the next time Windows/your shell is up. No PIN needed (repo stays private for now — see visibility gate below).

**Supersedes:** `2026-09-10_pci-16-consolidated-urgent-checklist.md` item 3, and the standalone `2026-09-10_pci-17-cake-recipe-devops-push.md`. Both are now folded into this one file — you only need to read this one for the cake-recipe-demo bet. (Item 1 of PCI-16 — HQ→private — is CONFIRMED DONE, live-verified `private:true`. Item 2 of PCI-16 — aztodev-company-system Pages toggle — is still separately open, unrelated repo, not part of this packet.)

## Known blocker on your side (found by Paz, not assumed)

Your founder-PC shell was reported broken (`exit 0xC0000142`) — if `git fetch`/`git pull` still fails when you pick this up, skip straight to the **verbatim fallback** section below and use file **Write**, not git.

## Why one file, one push

Three separate pieces (repo, frontend bundle, DevOps/Pages files) were staged across several parallel Cloud runs and briefly went out of sync with each other. All of it is now consolidated on `main` in this HQ repo — this packet is the single source of truth for what to copy.

## Task — do all of this in ONE PC session, ONE commit

**Quick automated path:**
If git/node works on your PC, you can run the unified script directly:
```bash
node ops/scripts/pci-17b-unified-push.mjs
```
This reads the 7 canonical files already bundled in `ops/exports/cake-recipe-demo/`, uses your PC GitHub credentials, creates `ZionAmar/cake-recipe-demo` (private), commits, pushes, enables Pages, and runs verification.

**Manual / step-by-step path:**
1. Create **private** repo:
   ```
   gh repo create ZionAmar/cake-recipe-demo --private
   ```
2. Copy these **7 files** (also available in `ops/exports/cake-recipe-demo/`) into the new repo root:

   | File | Source in HQ (git, if fetch works) |
   |------|------|
   | `index.html` | `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html` |
   | `styles.css` | `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/styles.css` |
   | `README.md` | `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/README.md` |
   | `Dockerfile` | `ops/staging/cake-recipe-demo/Dockerfile` |
   | `.dockerignore` | `ops/staging/cake-recipe-demo/.dockerignore` |
   | `.github/workflows/pages.yml` | `ops/staging/cake-recipe-demo/.github/workflows/pages.yml` |
   | `PAGES_SETUP.md` | `ops/staging/cake-recipe-demo/PAGES_SETUP.md` |

   **If git fetch fails:** the frontend 3 files (verbatim, full contents) are in `agents/14-frontend-engineer/outbox/2026-09-10_pci-16-cake-recipe-bundle-hq.md`; the DevOps 4 files (verbatim, full contents) are in `agents/18-devops-platform/outbox/2026-09-10_pci-16-cake-recipe-devops-verbatim.md`. Both are plain markdown you can read via GitHub's web UI (github.com, not git) even with a broken local shell, then copy-paste with a text editor / GitHub web "Add file" if needed.

3. Commit: `feat: RTL cake recipe demo + Docker + GitHub Pages workflow`
4. Push to `main`.
5. **One-time manual step (do not skip — this is exactly the failure mode that made `aztodev-company-system` Pages 404 for 40+ minutes):** repo **Settings → Pages → Build and deployment → Source: GitHub Actions** → Save.
6. Confirm the **Deploy to GitHub Pages** Action run succeeds (Actions tab).
7. Check: `curl -I https://zionamar.github.io/cake-recipe-demo/` → expect `200`.
8. Optional Docker smoke (Cloud sandbox has no `docker` binary, so this is real verification only if you run it):
   ```bash
   docker build -t cake-recipe-demo .
   docker run --rm -p 8080:80 cake-recipe-demo
   curl -sf http://localhost:8080/ | head
   ```

## Visibility gate — separate decision, do NOT flip yet

Repo starts **private**. The founder's "לפרטי, לפרטי, להפוך אותו לפרטי" plan is a **different, still-open** ask (Noa is holding it for founder «אשר») — don't change visibility on this repo based on that thread. If Pages doesn't work on a private repo without a paid plan, see the fallback note in `PAGES_SETUP.md` — flag it in your outbox rather than guessing.

## After you finish

Write `agents/34-pc-ops/outbox/2026-09-10_pci-17b-cake-recipe-unified-result.md` with: repo URL, commit SHA, Pages workflow run result, live URL + `curl -I` status code, Docker smoke result if run (or "not run"). If any step is blocked (PIN, permission, shell error) — write the exact error, that's a useful signal on its own.

Then **32-delivery-lead** hands off to QA (20-qa-sdet / Uri) to verify the live page (RTL correct, images load, mobile OK) before EMET-165's build phase closes.
