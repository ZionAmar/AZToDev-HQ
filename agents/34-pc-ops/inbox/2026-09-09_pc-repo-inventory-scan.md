# Task for נדב (34-pc-ops) — PRI-01 / PRI-02

**Delegated by:** 00-ceo (Noa), founder order in Telegram 2026-09-09
**Board:** `ops/intake/pc-repo-inventory-board.json`
**Type:** Read-only inventory. No repo creation, no push, no code changes.

## What ציון asked
"תבדקי איזה עוד פרויקטים משמעותיים יש שקיימים רק על המחשב ולא קיימים בגיטאב" — list significant project folders on the desktop (especially anything under an `in_production`-style path) that are **not** already uploaded to GitHub.

## Do
1. Scan the desktop projects root (reuse the root already confirmed for KidNest — do **not** re-ask "is this the right folder" again; that step is closed, see `ops/intake/kidnest-github-upload-board.json` KNU-02).
2. For each project folder found, record: name, path, has-`.git`?, last-modified date, any production signal (deploy config, prod env file names — do **not** open/print secret contents, just note the filename exists).
3. Cross-check each folder name against `ops/config/factory.json` → `repos` (already-known GitHub repos: hq, work_clock, fitime, telemust, kidnest).
4. Write the result to `agents/34-pc-ops/outbox/2026-09-09_pc-repo-inventory.md` **as soon as the scan finishes** — do not hold it only in chat.
5. Mark `PRI-01` and `PRI-02` `done` in the board file with `completedAt` + `artifact` path.

## Don't
- Don't create any GitHub repo.
- Don't push any code.
- Don't re-run the folder-confirmation dance from the KidNest task.
- Don't open `.env` / credential file contents — filename only.

## Handoff back
Short Hebrew summary to Noa (00-ceo) with the outbox path, so she reports the list to ציון and waits for his pick.
