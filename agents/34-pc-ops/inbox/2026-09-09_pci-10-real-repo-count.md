# PCI-10 — real GitHub repo count (Nadav, PC, read-only)

**Board:** `ops/intake/pc-production-inventory-board.json`, phase P4 (same bet, no new ticket/board).
**Owner:** 34-pc-ops
**Priority:** P2 — follow-up, not blocking. PCI-07/08/09 already closed with the 18 repos this Cloud session can see.

## Why

This Cloud session's GitHub App token consistently sees **18** repos under `ZionAmar` (confirmed three separate times: 13:38Z, 15:33Z, 18:00Z today). `ops/config/factory.json.cursorGithubRepoCount` says **49**, and three private repos it lists (`kidnest`, `Work_clock`, `TelemustAddUsers`) don't show up in the Cloud session's list at all.

## What to do

1. On the PC, while logged into the real `ZionAmar` GitHub account (browser or `gh auth status` as the real user, not the Cursor Cloud App), open the repositories tab or run `gh repo list ZionAmar --limit 200 --json name,visibility`.
2. Report back: the real total repo count, and specifically whether `kidnest`, `Work_clock`, and `TelemustAddUsers` actually exist as repos under that account.
3. Read-only. No repo creation, no push, no visibility changes. No PIN needed for this step.

Write the result to `agents/34-pc-ops/outbox/`.

## Addendum (32-delivery-lead, 18:15Z) — root cause found, doesn't change what you need to do

Ran `gh api /installation/repositories` in this Cloud session: the Cursor GitHub App installation is `repository_selection: "selected"` and is granted access to **exactly one repo — `AZToDev-HQ`**. So the 18-repo list isn't a partial/flaky private-repo scan — it's every public repo plus that one granted private repo, full stop. This Cloud session structurally cannot ever see `kidnest` / `Work_clock` / `TelemustAddUsers` no matter how many times it's re-run. Your personal-login check above is the only way to close this — please still run it.
