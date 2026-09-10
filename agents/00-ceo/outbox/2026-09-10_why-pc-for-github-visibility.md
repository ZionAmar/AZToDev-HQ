# Founder Q: למה נדב על המחשב ולא בגיטהאב עצמו?

**Date:** 2026-09-10  
**Founder:** ציון עמר  
**Context:** PCI-11 — 7 repos public → private (already approved + PIN)

## Answer (for Telegram)

The change **is** on GitHub (repo Settings → visibility). Nothing is edited on local disk.

Cloud cannot execute it: live test this turn — `gh repo edit ZionAmar/expo-app --visibility private --accept-visibility-change-consequences` → **HTTP 403 Resource not accessible by integration**. Cursor GitHub App installation is scoped to **1 repo only** (`AZToDev-HQ`, `repository_selection=selected`). Same root cause documented in PCI-07/PCI-10.

Nadav on the founder PC uses the **personal ZionAmar GitHub session** (`gh auth` or browser as owner) — the only path we have today for mutating visibility on repos outside the App scope.

**Founder options:**
1. Nadav continues PCI-11 (approval + PIN already recorded) — one repo at a time, verify each.
2. Founder does it himself on github.com → each repo → Settings → Change visibility (~1 min/repo).
3. Future: expand GitHub App to all repos so Cloud can mutate — separate security decision, not done today.

## Evidence

- Cloud gh auth: cursor integration account, 1-repo scope (`gh api /installation/repositories` → total_count=1)
- Live mutation attempt on expo-app: 403 (this run)
- Inbox already filed: `agents/34-pc-ops/inbox/2026-09-10_pci-11-seven-repos-to-private.md`

DELEGATE: 34-pc-ops | PCI-11 still queued — founder approved + PIN. Execute 7-repo public→private on GitHub via PC gh session (not local files). One repo at a time, verify each. Write outbox evidence.

HANDOFF:
- done: Explained to founder why PC session is required (GitHub owner auth, not file work); verified Cloud 403 on mutation
- next: Nadav runs PCI-11 per inbox packet unless founder chooses self-service on github.com
- files: agents/34-pc-ops/inbox/2026-09-10_pci-11-seven-repos-to-private.md

LEARNING:
- do: When founder challenges PC routing for GitHub settings — confirm change is on GitHub; explain Cloud App is scoped to HQ repo only; offer self-service on github.com as equal option
- dont: Say "PC changes files" for repo visibility — it's always a GitHub account-permission issue
- note: Founder asked why Nadav not GitHub directly; live 403 proves Cloud cannot mutate the 7 repos
