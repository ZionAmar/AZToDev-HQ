# Founder order — make 7 GitHub repos private

**Date:** 2026-09-10  
**Founder ask (Telegram):** Turn these public repos private: expo-app, chrome-test, todo, ci-test, ci-pipeline-test, news, coffee&cake/appdb.

## What Noa understood

| # | Repo (ZionAmar/) | Current visibility | Founder wants |
|---|------------------|-------------------|---------------|
| 1 | expo-app | Public | Private |
| 2 | chrome-test | Public | Private |
| 3 | todo | Public | Private |
| 4 | ci-test | Public | Private |
| 5 | ci-pipeline-test | Public | Private |
| 6 | news | Public | Private |
| 7 | coffee_and_cake_App_DB | Public | Private |

Source: `agents/32-delivery-lead/outbox/2026-09-09_pci-07-08-github-relevance-review.md` (live gh list, 2026-09-09).

## Plan (not started — awaiting «אשר» + PIN)

1. Founder confirms with «אשר» and unlocks PIN (mutation gate).
2. Delegate `32-delivery-lead` — change visibility via `gh repo edit ZionAmar/<name> --visibility private --accept-visibility-change-consequences`, one repo at a time (WIP=1).
3. Report back to founder: which succeeded, any failures (permissions, token scope).
4. Update PCI board note; no archive/delete — visibility change only.

## Status

**Waiting:** founder «אשר» + PIN. No delegate emitted yet (COMPANY_LOOP gate).

## Telegram reply sent

Hebrew summary: 7 repos listed, plan explained, PIN required, waiting for approval.
