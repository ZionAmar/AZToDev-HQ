# PCI-11 — Make 7 GitHub repos private (PIN approved)

**From:** 00-ceo (נועה)  
**Date:** 2026-09-10  
**PIN:** founder approved this turn — mutations allowed  
**Board:** `ops/intake/pc-production-inventory-board.json` → PCI-11  
**PC:** ONLINE (heartbeat confirmed — do not ask founder)

## Task

Change visibility from **public → private** for these repos under owner `ZionAmar`, **one at a time** (WIP=1):

| # | Repo |
|---|------|
| 1 | expo-app |
| 2 | chrome-test |
| 3 | todo |
| 4 | ci-test |
| 5 | ci-pipeline-test |
| 6 | news |
| 7 | coffee_and_cake_App_DB |

## Method

For each repo:

```powershell
gh repo edit ZionAmar/<repo> --visibility private --accept-visibility-change-consequences
gh repo view ZionAmar/<repo> --json name,visibility
```

- If a repo is already private, log it and continue.  
- If any command fails, **stop** and write the exact stderr to outbox — do not bulk-script without verification.  
- Do **not** touch any other repo.

## Deliverable

Write `agents/34-pc-ops/outbox/2026-09-10_pci-11-seven-repos-private.md` with:

- Per-repo: before/after visibility, success or error  
- Summary count: X/7 done  
- End with `DELEGATE: 00-ceo | Hebrew founder summary ready` if all succeeded, or `DELEGATE: 00-ceo | PCI-11 partial failure — founder action needed` if blocked  

## Context

Founder chose these from yesterday's PCI-08 mapping (archive-candidate / scratch repos). This is an explicit mutation he approved with PIN — not a recommendation pass.
