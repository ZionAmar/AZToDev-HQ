# GitHub — 7 public repos → private (founder approved + PIN)

**Date:** 2026-09-10  
**Founder:** ציון עמר  
**PIN:** received (unlock window open this turn)  
**Approval text:** «אני מאשר» + PIN  

## What founder ordered

Make **private** (currently public under `ZionAmar`):

1. expo-app  
2. chrome-test  
3. todo  
4. ci-test  
5. ci-pipeline-test  
6. news  
7. coffee_and_cake_App_DB  

Source: PCI-08 archive-candidates + founder explicit list 2026-09-10.

## How we execute

- **Owner:** `34-pc-ops` (Nadav) — PC ONLINE; real `gh` session as ZionAmar can mutate repo visibility. Cloud GitHub App is scoped to AZToDev-HQ only (see PCI-07 knownDiscrepancy) and cannot edit these repos from Cloud.
- **Tracker:** `32-delivery-lead` — board PCI-11, report back to Noa when done.
- **Method:** one repo at a time — `gh repo edit ZionAmar/<name> --visibility private --accept-visibility-change-consequences`; verify with `gh repo view`; log each result in outbox.
- **WIP=1:** no parallel repo edits.

## Success criteria

- All 7 show `visibility: PRIVATE` on live `gh repo view` from Nadav's session  
- Outbox lists per-repo success/failure  
- No other repos touched  

DELEGATE: 34-pc-ops | Founder PIN approved — make private one-by-one: expo-app, chrome-test, todo, ci-test, ci-pipeline-test, news, coffee_and_cake_App_DB under ZionAmar. Verify each with gh repo view. Write outbox evidence. If any fail, stop and report exact error — do not retry blindly.

HANDOFF:
- done: Confirmed founder approval + PIN; queued PCI-11; routed to Nadav (PC gh auth)
- next: Execute visibility change per repo; verify; report Hebrew summary path for Noa
- files: agents/34-pc-ops/inbox/2026-09-10_pci-11-seven-repos-to-private.md, ops/intake/pc-production-inventory-board.json

LEARNING:
- do: GitHub visibility mutations on repos outside Cursor App scope → Nadav (34-pc-ops) with PIN, not Cloud Keshet alone
- dont: Promise Keshet will run gh edit from Cloud when installation is scoped to AZToDev-HQ only
- note: Founder approved 7-repo private flip; delegated Nadav with PCI-11 on board
