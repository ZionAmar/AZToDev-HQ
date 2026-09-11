# IDEA — 2026-09-11-kids-math-game-react

## In ציון's words
> צרו לי משחק מתמטיקה קטן לילדים בריאקט וצעשו הכל ותנו לי קישור בסוף לאתר

Follow-up GO: **«יאללה צרו את המשחק»** (2026-09-11, Telegram thread).

## Nura — Keep / Defer / Kill
- **Decision:** Keep
- **Why:** בקשה ברורה, מתאימה לסטאק (React static + GitHub Pages), יש quality bar קיים (`products/kids-math-quiz/index.html`). גרסה ראשונה: חיבור וחיסור, עברית RTL, נוח לנייד, בלי חשבונות ובלי שרת.
- **Questions asked:** אין — GO מפורש מהמייסד.

## Amit — slice
- **User + outcome:** ילדים (גילאי 6–10) מתרגלים חיבור/חיסור בכיף, מקבלים משוב מיידי, רואים ניקוד.
- **Non-goals:** כפל/חילוק, חשבונות, backend, multiplayer, אפליקציה native.
- **Acceptance criteria:**
  - [ ] React SPA (Vite or CRA), RTL Hebrew UI
  - [ ] Addition + subtraction drills, random questions, score tracking
  - [ ] Mobile-friendly, polished (match kids-math-quiz quality bar)
  - [ ] Private GitHub repo `ZionAmar/kids-math-game-react`
  - [ ] GitHub Pages live URL returns 200
  - [ ] QA pass before founder gets link
- **Repo:** `kids-math-game-react` (new, private → public for Pages)
- **Owner specialist:** 32-delivery-lead → pipeline

## Ilan — technical one-pager
- **Approach:** Vite + React, static build, GitHub Actions Pages deploy (same pattern as cake-recipe-demo). Reference UX from `products/kids-math-quiz/index.html`.
- **Risk:** WIP fragmentation / theater without real packet — mitigated by PCI-KMG-01 merged to main this run.
- **Blocked?:** `new_product` founder gate — needs action PIN before engineer PRs.

## Status
`ready-for-cloud`
