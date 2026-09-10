# PCI-17b — cake-recipe-demo unified push (Paz · 18-devops-platform)

**Date:** 2026-09-10T22:07Z · **Run:** Cursor Cloud · **Branch:** `cursor/pci-17b-unified-export-script-84a1` (commit `6e566d6`)

## Summary

| Step | Result |
|------|--------|
| Bundle 7/7 files in `ops/exports/cake-recipe-demo/` | **OK** |
| Script `ops/scripts/pci-17b-unified-push.mjs` | **Created + executed** |
| Repo create `ZionAmar/cake-recipe-demo` | **FAIL** — 403 |
| Git push to new repo | **Not reached** (repo 404) |
| Commit SHA on target repo | **N/A** |
| Repo private status | **N/A** (repo does not exist) |
| Pages enable via API | **Not reached** |
| Workflow run | **Not reached** |
| `curl -I https://zionamar.github.io/cake-recipe-demo/` | **404** |

**Verdict:** Cloud GitHub App integration (`cursor` account, scoped to `AZToDev-HQ` only) **cannot** create or push to founder personal repos. Export bundle + automation script are staged on HQ branch; push must run with **founder `gh` session** (PC Nadav or dedicated Cloud run with founder PAT).

---

## 1) Bundle verification — 7/7 OK

All files present under `ops/exports/cake-recipe-demo/`:

| File | Source |
|------|--------|
| `index.html` | `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/` |
| `styles.css` | same |
| `README.md` | same |
| `Dockerfile` | `ops/staging/cake-recipe-demo/` |
| `.dockerignore` | same |
| `.github/workflows/pages.yml` | same |
| `PAGES_SETUP.md` | same |

---

## 2) Auth probe

```
credential_helper: FAIL (credential_fill_failed)
gh auth user GET /user: 403 (login: null)
gh auth account: cursor (GitHub App integration)
```

---

## 3) Repo create attempt

```
POST /user/repos { name: cake-recipe-demo, private: true }
→ 403 Resource not accessible by integration
```

```
GET /repos/ZionAmar/cake-recipe-demo
→ 404 Not Found
```

---

## 4) Push / commit SHA

Not executed — repo does not exist. Script exits at repo-create gate (exit code 5).

---

## 5) Pages enable

Not attempted (blocked at repo create).

Manual step still required after push (per PCI-17b packet): **Settings → Pages → Source: GitHub Actions → Save**.

---

## 6) Workflow run

Not applicable — no repo, no push.

---

## 7) Live URL curl

```
curl -sI https://zionamar.github.io/cake-recipe-demo/
HTTP/2 404
```

---

## What to run next (founder credentials)

From HQ root after merge/pull:

```bash
node ops/scripts/pci-17b-unified-push.mjs
```

Or Nadav manual path (PCI-17b inbox): `gh repo create` + copy 7 files + push + Pages toggle.

Expected success output fields: `push.push.ok: true`, `commitSha`, `repoPrivate: true`, workflow `status: completed`, `curl.statusCode: 200`.

---

## HQ artifacts

- `ops/exports/cake-recipe-demo/` — unified 7-file bundle
- `ops/scripts/pci-17b-unified-push.mjs` — automation script
- PR branch: `cursor/pci-17b-unified-export-script-84a1`

---

HANDOFF:
- done: Verified 7-file bundle; created export dir + unified push script; ran script; documented full API/curl failures from Cloud App scope
- next: Run `node ops/scripts/pci-17b-unified-push.mjs` with founder `gh` auth (Nadav PC or Tamir run with founder PAT); then manual Pages source toggle if API enable fails; QA verify RTL page
- files: `ops/exports/cake-recipe-demo/*`, `ops/scripts/pci-17b-unified-push.mjs`, `agents/34-pc-ops/inbox/2026-09-10_pci-17b-unified-cake-recipe-repo-devops-pages.md`

DELEGATE: 34-pc-ops | PCI-17b: PC online — `git pull`, merge/run `node ops/scripts/pci-17b-unified-push.mjs` with founder gh session; Settings→Pages→GitHub Actions; write outbox with repo URL + SHA + curl 200

LEARNING:
- do: Stage `ops/exports/<repo>/` + runnable script on HQ before claiming push; run script and paste raw JSON even on 403
- dont: Claim unified push succeeded from Cloud when POST /user/repos returns 403 integration scope
- note: PCI-17b bundle+script ready on branch 6e566d6; repo still 404; Pages curl 404; blocked on founder GitHub creds not Cloud App
