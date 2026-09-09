# IDEA-kidnest-github-upload — KidNest private GitHub

## Source
Noa → Keshet (`32-delivery-lead`) — 2026-09-09

## One sentence
העלאת מונורפו KidNest מהמחשב האישי לריפו GitHub פרטי — בסיס לעבודת Cloud Agents בעתיד.

## Who is it for?
ציון + AZToDev Cloud (מהנדסים על הספסל עד «תבנו» + PIN)

## Problem / outcome
- KidNest חי ב-ChemiCloud (`nestube.aztodev.com`) אבל הקוד רק על הדיסק המקומי.
- בלי GitHub פרטי אין PR, אין Cloud Agent, אין audit trail.
- **Outcome:** `https://github.com/ZionAmar/KidNest` (private), push ראשון נקי, ללא סודות.

## Why now?
ביקורת פרודקשן (KidNest audit) הושלמה. המייסד רוצה את הקוד ב-GitHub לפני עבודת פיתוח עתידית.

## Constraints
- **Plan-only** עד PIN — KNU-03 מכין handoff; KNU-04 מבצע על PC (נדב).
- מונורפו v1 — **לא** לפצל לריפואים נפרדים.
- אין `.env` / סודות / `node_modules` ב-git.
- KNU-02 (סריקת PC) **סגור** — לא לפתוח מחדש.
- WIP=1 — זה initiative יחיד עד סיום KNU-04.

## Success signal in 14 days
- ריפו פרטי קיים עם `main` push.
- `git ls-files` בלי `.env` / מפתחות.
- Linear project «KidNest — GitHub upload» עם KNU-01..04 מסומנים.

## Non-goals
- Refactor / split monorepo
- Deploy / ChemiCloud changes
- Product PRs (`productWorkEnabled` still false)

## Attachments / refs
- Audit board: `ops/intake/kidnest-audit-board.json`
- PC path: `C:\Users\amazi\Desktop\Projects\in_production\kidnest`
- Board: `ops/intake/kidnest-github-upload-board.json`
- Repo plan: `agents/32-delivery-lead/memory/kidnest-github-upload/KNU-01-repo-plan.md`
