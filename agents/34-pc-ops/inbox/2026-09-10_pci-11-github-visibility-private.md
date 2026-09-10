# PCI-11 — Flip 7 public repos to private (Nadav, PC, mutating)

**Board:** `ops/intake/pc-production-inventory-board.json`
**Owner:** 34-pc-ops
**Priority:** P0 — founder approved + PIN already received (2026-09-10)
**Gate:** PIN unlocked — execute now

## Founder order (verbatim intent)

Make these 7 repos **private** (not public):

1. expo-app
2. chrome-test
3. todo
4. ci-test
5. ci-pipeline-test
6. news
7. coffee_and_cake_App_DB

## Why Nadav (not Cloud)

Cloud session gets 403 on `gh repo edit` for these repos — GitHub App is scoped to AZToDev-HQ only. PC session logged in as the real ZionAmar account can mutate visibility.

## What to do

For each repo, one at a time (WIP discipline):

1. Verify current visibility: `gh repo view ZionAmar/<name> --json visibility,name`
2. If PUBLIC, change: `gh repo edit ZionAmar/<name> --visibility private --accept-visibility-change-consequences`
3. Re-verify after each change — must show `"visibility":"PRIVATE"` before moving to next repo
4. If any repo fails, stop and record the exact error — do not skip silently

## Deliverable

Write `agents/34-pc-ops/outbox/2026-09-10_pci-11-visibility-results.md` with:

- Table: repo name | before | after | status (ok/failed) | error if any
- Summary line: X/7 succeeded
- Timestamp of each change

Noa will relay a short Hebrew summary to the founder.
