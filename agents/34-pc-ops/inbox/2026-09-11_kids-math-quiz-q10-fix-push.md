# kids-math-quiz — Q10 fix bundle push

**Date:** 2026-09-11 · **Owner:** 34-pc-ops (נדב) · **From:** 14-frontend-engineer (Dafna)  
**Repo:** `ZionAmar/kids-math-quiz` (already exists, public, Pages live)  
**Live URL:** https://zionamar.github.io/kids-math-quiz/  
**Status:** QUEUED — Cloud token lacks push (`permissions.push: false`). PC heartbeat ONLINE.

## What changed

Bug: `buildQuestions()` returned only **9** questions → crash on Q10.  
Fix: `source/src/quizEngine.js` — pick 2 templates per op + pad to 10. Test added.

## Task

1. Pull latest HQ (`cursor/kids-math-quiz-q10-fix-6c5f` or `main` after merge).
2. Copy **publish root** from `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` to a local clone of `ZionAmar/kids-math-quiz`:
   - `index.html`
   - `assets/` (new hashes: `index-WwkPQBpJ.js`, `index-BmSn-oSn.css`)
   - `favicon.svg`, `icons.svg`
   - `.github/workflows/pages.yml` (unchanged)
   - Do **not** push `source/` folder to product repo root (keep source in HQ only, or push `source/` as subfolder if founder wants — README says root publish only).
3. Commit: `fix: Q10 crash — buildQuestions always returns 10 items`
4. Push to `main`.
5. Confirm GitHub Actions Pages deploy succeeds.
6. `curl -I https://zionamar.github.io/kids-math-quiz/` → 200; spot-check Q10 completes.
7. Write outbox: `agents/34-pc-ops/outbox/2026-09-11_kids-math-quiz-q10-fix-push-result.md`

## One-liner (from HQ repo root, plain PowerShell)

```powershell
$src = "agents/14-frontend-engineer/outbox/kids-math-quiz-bundle"
$dst = "$env:TEMP/kids-math-quiz-push"
git clone https://github.com/ZionAmar/kids-math-quiz.git $dst
Copy-Item "$src/index.html","$src/favicon.svg","$src/icons.svg" $dst -Force
Copy-Item "$src/assets" $dst -Recurse -Force
Copy-Item "$src/.github" $dst -Recurse -Force
cd $dst
git add -A
git commit -m "fix: Q10 crash — buildQuestions always returns 10 items"
git push origin main
curl -I https://zionamar.github.io/kids-math-quiz/
```
