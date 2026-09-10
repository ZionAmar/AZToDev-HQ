# PCI-17b — cake-recipe-demo Unified Push Execution Report

**Date:** 2026-09-10T22:35:00Z  
**Agent:** 35-server-ops (תמיר)  
**Task:** Execute PCI-17b cake-recipe-demo unified push with founder gh/git credentials  
**Linear:** [EMET-165](https://linear.app/my-company1460/issue/EMET-165) / [EMET-115](https://linear.app/my-company1460/issue/EMET-115)  

---

## Hebrew Summary for Noa (סיכום לנועה עבור ציון)

הכנתי את כל חבילת הייצוא PCI-17b והרצתי את סקריפט הדחיפה המאוחד:
1. **חבילת 7 הקבצים נוצרה בהצלחה** תחת `ops/exports/cake-recipe-demo/` (קוד דף עוגה RTL, עיצוב CSS, Dockerfile, dockerignore, README, הגדרות Pages ו-GitHub Actions workflow מלא).
2. **נבנה והורץ סקריפט אוטומציה מאוחד:** `node ops/scripts/pci-17b-unified-push.mjs`.
3. **תוצאת הריצה בענן Cursor Cloud:**
   - יצירת הריפו בענן נחסמה ב-`GraphQL: Resource not accessible by integration (createRepository) (HTTP 403)`.
   - טוקן ה-GitHub App של Cursor Cloud מוגדר במפורש ל-`AZToDev-HQ` בלבד (`repository_selection: "selected"`, טווח 1 ריפו בלבד) ואינו מכיל הרשאות ליצירת ריפו אישי חדש תחת החשבון האישי `ZionAmar`. אין טוקן PAT אישי של ציון במשתני סביבה של הענן.
   - הדף עדיין מחזיר HTTP 404 (טרם נוצר ב-GitHub).
4. **פתרון מוכן להרצה במחשב של נדב (34-pc-ops):**
   - כל החבילה מוכנה ומסודרת בריפו HQ.
   - כשהמחשב/Windows של נדב עולה (המשימה מסומנת **QUEUED**, ללא צורך בהפרעה לציון), נדב יכול להריץ פקודה אחת פשוטה:
     `node ops/scripts/pci-17b-unified-push.mjs`
     הסקריפט משתמש ב-Git Credential Manager המקומי של ציון, ייצור את הריפו הפרטי, ידחוף את 7 הקבצים ויבדוק את הסטטוס.

---

## Technical Diagnostic Results

### 1. 7 Canonical Files Exported (`ops/exports/cake-recipe-demo/`)
All 7 files verified present in `ops/exports/cake-recipe-demo/`:
- `index.html` (RTL semantic HTML, accessible skip link, Hebrew cake recipe demo)
- `styles.css` (responsive design, warm bakery palette, CSS custom properties)
- `README.md` (project overview & local preview instructions)
- `Dockerfile` (`nginx:1.27-alpine` serving static bundle on port 80)
- `.dockerignore` (excludes `.git`, `.github`, etc.)
- `.github/workflows/pages.yml` (GitHub Actions workflow deploying static site to Pages)
- `PAGES_SETUP.md` (instructions for repository setup & Docker preview)

### 2. Execution of `ops/scripts/pci-17b-unified-push.mjs`
Command: `node ops/scripts/pci-17b-unified-push.mjs`

```json
{
  "push": "fail",
  "commitSha": "1008eafd472e1bb07245a2daf717236ef770925d",
  "repoPrivateStatus": "not_found_404",
  "pagesEnableResult": "blocked_repo_missing",
  "workflowRunStatus": "blocked_repo_missing",
  "curlStatusCode": 404,
  "errors": [
    "gh repo create failed: GraphQL: Resource not accessible by integration (createRepository)",
    "AUTH_SCOPE_LIMITATION: Cursor Cloud GitHub App token is scoped to AZToDev-HQ only (repository_selection=selected). It lacks permission to create user repositories under ZionAmar. Founder personal credentials (gh auth on PC / personal PAT) required."
  ]
}
```

### 3. Empirical Verification Evidence
- **Cloud App Token Scope:** `gh api /installation/repositories` confirmed `total_count: 1`, `repositories: ["ZionAmar/AZToDev-HQ"]`.
- **Founder Credential Fill:** `git credential fill` in Cloud sandbox returns `{ ok: false, error: 'credential_fill_failed' }` (no personal PAT injected in Cloud Agent environment secrets).
- **Live URL Curl:** `curl -s -I https://zionamar.github.io/cake-recipe-demo/` returns `HTTP/2 404`.
- **Local Staging Commit:** Git commit `1008eafd472e1bb07245a2daf717236ef770925d` created locally with commit message `feat: RTL cake recipe demo + Docker + GitHub Pages workflow`.

---

DELEGATE: 34-pc-ops | Run `node ops/scripts/pci-17b-unified-push.mjs` on PC once Windows/shell is online (queued, no nudge). Script uses Windows Git Credential Manager to create private repo, push 7 files from `ops/exports/cake-recipe-demo/`, and verify Pages.

HANDOFF:
- done: Staged 7 canonical files in `ops/exports/cake-recipe-demo/`, implemented `ops/scripts/pci-17b-unified-push.mjs`, ran execution, diagnosed Cloud GitHub App permission boundaries, captured full technical output.
- next: Nadav (34-pc-ops) executes `node ops/scripts/pci-17b-unified-push.mjs` with founder Windows credentials when online; Uri (20-qa-sdet) verifies live Pages.
- files: `ops/exports/cake-recipe-demo/*`, `ops/scripts/pci-17b-unified-push.mjs`, `agents/35-server-ops/outbox/2026-09-10_pci-17b-cake-recipe-unified-push-status.md`

LEARNING:
- do: Build reusable unified push scripts that fall back gracefully between local Git Credential Manager and Cloud diagnostic mode, reporting exact structured JSON.
- dont: Assume Cloud GitHub App token can create personal user repositories outside its scoped repo selection (`total_count: 1`).
- note: Ran PCI-17b unified push check; confirmed Cloud App 403 on personal repo create; prepared turnkey script and export directory for Nadav PC execution.
