# Work packet — KNU-03: KidNest private repo create + push

**To:** Nadav (`34-pc-ops`)  
**From:** Keshet (`32-delivery-lead`)  
**Date:** 2026-09-09  
**PIN:** Required before any disk write / git push / `gh repo create`

---

## One line

Create private GitHub repo `ZionAmar/KidNest` and push the local monorepo — no secrets, no `node_modules`.

---

## Preconditions (all must be true)

- [ ] Windows on · PC worker active
- [ ] Founder unlocked PIN (Noa confirms)
- [ ] `gh auth status` → logged in as `ZionAmar`
- [ ] Source path exists: `C:\Users\amazi\Desktop\Projects\in_production\kidnest`

**Do not** reopen KNU-02 scan. Only confirm path exists; if missing, **block** and report to Noa.

---

## Inputs (read-only)

| Doc | Path |
|-----|------|
| Repo plan | `agents/32-delivery-lead/memory/kidnest-github-upload/KNU-01-repo-plan.md` (pull HQ or read from Noa's brief) |
| Scan baseline | `agents/32-delivery-lead/memory/kidnest-github-upload/KNU-02-scan-summary.md` |
| Board | `ops/intake/kidnest-github-upload-board.json` |

---

## Execute steps

### 1. Navigate & inspect (read-only first)

```powershell
cd C:\Users\amazi\Desktop\Projects\in_production\kidnest
dir
git status 2>$null
```

Record: does `.git` exist? any remote? rough folder list.

### 2. Ensure .gitignore

- If missing, create from KNU-01 template.
- If exists, verify `.env`, `node_modules`, `dist-deploy`, `.expo` are ignored.
- **Never** `git add .env` or `*.pem`.

### 3. Create private repo (if not exists)

```powershell
gh repo view ZionAmar/KidNest 2>$null
if ($LASTEXITCODE -ne 0) {
  gh repo create KidNest --private --description "KidNest monorepo — filtered YouTube for kids (private import)"
}
```

### 4. Init git & push

**If no `.git`:**

```powershell
git init -b main
git remote add origin https://github.com/ZionAmar/KidNest.git
git add .
git status
# STOP if .env or node_modules appear staged
git commit -m "chore: initial KidNest monorepo import"
git push -u origin main
```

**If `.git` exists with wrong remote:**

```powershell
git remote -v
git remote set-url origin https://github.com/ZionAmar/KidNest.git
git push -u origin main
```

### 5. Secret smoke test (mandatory)

```powershell
git ls-files | Select-String -Pattern '\.env|node_modules|\.pem|\.key'
```

Must return **nothing**. If hits → `git reset`, fix `.gitignore`, recommit.

---

## Definition of done (evidence back to HQ)

Return to Noa (Hebrew summary) + paste:

1. **Repo URL:** `https://github.com/ZionAmar/KidNest`
2. **`gh repo view ZionAmar/KidNest --json name,isPrivate,defaultBranchRef,url`**
3. **`git log -1 --oneline`**
4. **`git ls-files | Measure-Object -Line`** → file count
5. Confirm: no `.env` / no `node_modules` in tracked files

Save full output to:  
`C:\Users\amazi\Desktop\Projects\in_production\kidnest\.emet\KNU-04-verify.txt` (create `.emet/` if needed)

---

## Out of scope

- ChemiCloud deploy / apache
- npm install / build / test
- Splitting monorepo
- Adding repo to Cursor (founder + Cloud later)
- Re-running KNU-02 directory scan

---

## On failure

| Failure | Action |
|---------|--------|
| Path missing | Block → Noa → founder |
| `gh` not auth | Block → founder login |
| Secrets in staged files | Abort push → fix gitignore → retry |
| Repo exists with content | **Do not force-push** → report to Noa |

---

## After success

KNU-04 (verify) auto-ready on board. Keshet closes loop when evidence lands.

`DELEGATE: 34-pc-ops | KNU-04 verify KidNest GitHub push`
