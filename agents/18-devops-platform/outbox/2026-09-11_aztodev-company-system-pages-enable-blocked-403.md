# aztodev-company-system — GitHub Pages enable attempt (Cloud blocked 403)

**Agent:** 18-devops-platform (Paz)  
**Date:** 2026-09-11T08:00Z  
**Task:** Enable GitHub Pages (`build_type=workflow`), rerun failed workflow `34526813041`, verify live URL.

## Result

**NOT DONE from Cloud.** Both mutating API calls returned `403 Resource not accessible by integration`. Cloud GitHub App token is scoped to AZToDev-HQ only — no admin/maintain on `ZionAmar/aztodev-company-system`. Pages still disabled (`has_pages: false`), live URL still **404**.

**Queued to 34-pc-ops (Nadav)** — requires founder `gh` token on PC.

---

## 1. POST /repos/ZionAmar/aztodev-company-system/pages

**Request:** `gh api -X POST repos/ZionAmar/aztodev-company-system/pages -f build_type=workflow`

**Response (403):**

```json
{
  "message": "Resource not accessible by integration",
  "documentation_url": "https://docs.github.com/rest/pages/pages#create-a-apiname-pages-site",
  "status": "403"
}
```

---

## 2. POST /repos/ZionAmar/aztodev-company-system/actions/runs/34526813041/rerun

**Request:** `gh api -X POST repos/ZionAmar/aztodev-company-system/actions/runs/34526813041/rerun`

**Response (403):**

```json
{
  "message": "Resource not accessible by integration",
  "documentation_url": "https://docs.github.com/rest/actions/workflow-runs#re-run-a-workflow",
  "status": "403"
}
```

---

## 3. GET /repos/ZionAmar/aztodev-company-system/pages

**Request:** `gh api repos/ZionAmar/aztodev-company-system/pages`

**Response (404 — site not configured):**

```json
{
  "message": "Not Found",
  "documentation_url": "https://docs.github.com/rest/pages/pages#get-a-apiname-pages-site",
  "status": "404"
}
```

---

## 4. GET /repos/ZionAmar/aztodev-company-system (repo metadata excerpt)

**Request:** `gh api repos/ZionAmar/aztodev-company-system`

**Key fields:**

```json
{
  "full_name": "ZionAmar/aztodev-company-system",
  "private": false,
  "visibility": "public",
  "has_pages": false,
  "default_branch": "main",
  "permissions": {
    "admin": false,
    "maintain": false,
    "push": false,
    "triage": false,
    "pull": false
  }
}
```

---

## 5. GET workflow run 34526813041 (read succeeded)

**Request:** `gh api repos/ZionAmar/aztodev-company-system/actions/runs/34526813041`

**Response (excerpt):**

```json
{
  "id": 34526813041,
  "name": "Deploy to GitHub Pages",
  "head_branch": "main",
  "head_sha": "804bc59f93b2599af86e01a2562cfb8e7a9e7f13",
  "path": ".github/workflows/pages.yml",
  "display_title": "PCI-15: add Dockerfile, GitHub Pages workflow, and setup docs (Paz st…",
  "run_number": 1,
  "event": "push",
  "status": "completed",
  "conclusion": "failure",
  "html_url": "https://github.com/ZionAmar/aztodev-company-system/actions/runs/34526813041"
}
```

**Job failure root cause (Setup Pages step):**

```json
{
  "name": "Setup Pages",
  "status": "completed",
  "conclusion": "failure",
  "number": 3
}
```

Pages was never enabled in repo Settings — workflow cannot bootstrap itself.

---

## 6. curl verification

**Request:** `curl -sI https://zionamar.github.io/aztodev-company-system/`

**Response:**

```
HTTP/2 404
server: GitHub.com
content-type: text/html; charset=utf-8
x-github-request-id: B756:4F28A:6423E5:6D4EDD:6AA3AB56
```

---

## Nadav commands (PC — founder gh token)

Run from any shell with `gh auth login` as ZionAmar:

```powershell
# 1. Enable Pages (workflow source)
gh api -X POST repos/ZionAmar/aztodev-company-system/pages -f build_type=workflow

# 2. Rerun failed deploy
gh api -X POST repos/ZionAmar/aztodev-company-system/actions/runs/34526813041/rerun

# 3. Verify (wait ~60s after rerun succeeds)
gh api repos/ZionAmar/aztodev-company-system/pages
curl -sI https://zionamar.github.io/aztodev-company-system/
```

Alternative UI path: Settings → Pages → Source: **GitHub Actions** → Save, then rerun workflow.

Expected after success: GET pages returns `status: built`, curl returns **HTTP 200**.

---

## References

- Staging already in repo: `.github/workflows/pages.yml` (commit `804bc59`)
- HQ setup doc: `ops/staging/aztodev-company-system/PAGES_SETUP.md`
- PCI-16 item 2: `agents/34-pc-ops/inbox/2026-09-10_pci-16-consolidated-urgent-checklist.md`
