# PCI-17b — UNIFIED: cake-recipe-demo repo create + bundle + DevOps + Pages (ONE push)

**Date:** 2026-09-10T21:4xZ · **Owner:** 34-pc-ops (נדב) · **From:** 32-delivery-lead (קשת), folding in 18-devops-platform (פז)
**Linear:** [EMET-165](https://linear.app/my-company1460/issue/EMET-165) · [EMET-115](https://linear.app/my-company1460/issue/EMET-115) (Done)
**Status:** QUEUED — PC heartbeat OFFLINE this run. This is not a nudge waiting for a reply; it runs automatically the next time Windows/your shell is up. No PIN needed (repo stays private for now — see visibility gate below).

**Supersedes:** `2026-09-10_pci-16-consolidated-urgent-checklist.md` item 3, and the standalone `2026-09-10_pci-17-cake-recipe-devops-push.md`. Both are now folded into this one file — you only need to read this one for the cake-recipe-demo bet. (Item 1 of PCI-16 — HQ→private — is CONFIRMED DONE, live-verified `private:true`. Item 2 of PCI-16 — aztodev-company-system Pages toggle — is still separately open, unrelated repo, not part of this packet.)

## Known blocker on your side (found by Paz, not assumed)

Your founder-PC shell was reported broken (`exit 0xC0000142`) — if `git fetch`/`git pull` still fails when you pick this up, skip straight to the **verbatim fallback** section below and use file **Write**, not git.

## Update 2026-09-10T22:4xZ — run it OUTSIDE Cursor entirely (new, added this turn)

A later attempt at this same task still hit `0xC0000142` running a `node` command even after the PC heartbeat showed ONLINE. That points at **Cursor's own embedded terminal/runtime on your machine**, not at this packet's instructions (which only ever needed plain `git`/`gh`, never Cursor or `node`).

A new script was added this turn that does the whole thing (create repo, copy the 7 files, commit, push, enable Pages, check the workflow run, `curl` the live URL, write the outbox result) in one shot using only PowerShell + `git` + `gh` — **no Cursor, no `node`**:

```
ops\scripts\pci-17b-cake-recipe-push.ps1
```

Run it from a **plain Windows Terminal / PowerShell window** (Start menu → Windows PowerShell — not Cursor's built-in terminal), or wire it into Task Scheduler / a Startup shortcut the same way `NADAV-PC.vbs` + `ops\scripts\install-nadav-startup.ps1` already do for the desk worker:

```powershell
powershell -ExecutionPolicy Bypass -File ops\scripts\pci-17b-cake-recipe-push.ps1
```

It writes+pushes `agents/34-pc-ops/outbox/...pci-17b-cake-recipe-unified-result.md` itself, so one successful run closes this ticket's evidence loop without touching Cursor at all. If a step fails it still writes the outbox file with the exact error, and the manual steps below remain a valid fallback.

**Correction on file locations (an unrelated task mentioned paths that never existed in this repo):** there is no `ops/scripts/pci-17b-unified-push.mjs` anywhere in HQ git history — never committed by any agent. `ops/exports/<repo-name>/` (seen in the older PCI-15 packet) is Nadav's own **local, untracked** clone-staging convention on his PC, not a path in this git repo. The real source-of-truth files are the 7 listed in the table below, already on `main`.

## Why one file, one push

Three separate pieces (repo, frontend bundle, DevOps/Pages files) were staged across several parallel Cloud runs and briefly went out of sync with each other. All of it is now consolidated on `main` in this HQ repo — this packet is the single source of truth for what to copy.

## Task — do all of this in ONE PC session, ONE commit

1. Create **private** repo:
   ```
   gh repo create ZionAmar/cake-recipe-demo --private --confirm
   ```
2. Copy these **7 files** into the new repo root:

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
