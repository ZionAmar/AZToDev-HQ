# PCI-12 — Founder-approved visibility: PUBLIC → PRIVATE (2 repos)

**From:** 00-ceo (Noa)  
**When:** 2026-09-10T08:22Z  
**Gate:** Founder sent «מאשר» + PIN (recorded by desk; do not log PIN in outbox)  
**PC heartbeat:** ONLINE (A_Z · 2026-09-10T08:19:36Z)

## Task

On the PC, using **ZionAmar personal GitHub login** (`gh auth status` must show the real user, not Cursor Cloud App), change visibility to **private** for exactly these two repos — one at a time, verify after each:

1. `FinalProjectNodeJS`
2. `ZionAmar-workclock-expo-app`

## Method (each repo)

```powershell
gh repo edit ZionAmar/FinalProjectNodeJS --visibility private --accept-visibility-change-consequences
gh repo view ZionAmar/FinalProjectNodeJS --json visibility
```

Repeat for `ZionAmar-workclock-expo-app`.

## DoD

Write `agents/34-pc-ops/outbox/2026-09-10_pci-12-visibility-two-repos.md` with:

| Repo | Before | After | OK? |
|------|--------|-------|-----|
| FinalProjectNodeJS | | | |
| ZionAmar-workclock-expo-app | | | |

Include `gh auth status` one-liner (redact tokens). If any repo fails, paste the error — do not skip.

## Cloud note (for context)

This Cloud session's GitHub App is scoped to **one repo only** (`AZToDev-HQ`) and returns HTTP 403 on visibility PATCH even for repos it can read. That is why this runs on PC with founder auth.
