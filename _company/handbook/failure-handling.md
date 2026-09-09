# Failure Handling

## Product incidents
1. Detect → mitigate → communicate → root cause → prevent
2. Severity: SEV1 user data/money down → page CEO+CTO immediately
3. Write incident report template after SEV1/SEV2

## Agent failure loops
If an agent retries the same failing approach **≥3** times:
- STOP
- Write minimal repro + what was tried
- Escalate to Tech Lead / human
- Do not burn tokens in circles (CFO principle)

## Cloud-run timeouts / disconnects (multi-step PC or specialist tasks)
Cursor Cloud runs are ephemeral — a run can end (turn boundary, real network timeout, PC disconnect) at any point, not only on failure. Treat every run as if it could be the last one for that step:
1. **Persist the moment a sub-step closes** — write the board/outbox/ledger file *before* ending the turn, not after the whole task finishes. A confirmed sub-step that only lives in the chat is not confirmed.
2. **Read-before-ask.** Before re-requesting a confirmation (folder path, credential, "is this right?") or re-running a scan, check the git-tracked board (`ops/intake/*-board.json`) and `ops/founder-channel/ledger.jsonl` for that step. If it is already marked done there, resume at the next open step — do not re-ask.
3. **3-strikes stop applies to loop-backs too.** If the same confirmation is being re-requested a 3rd time across separate runs, that is a process failure, not a retry — stop and flag it to Noa/CEO instead of asking the founder again.

See `ops/intake/problems/PROB-2026-09-09-1788961972584.md` for the incident that produced this rule (KidNest upload loop).

## Blameless retros
Fix systems and prompts. Update `PLAYBOOK.md` + `memory/`. CHRO owns prompt quality debt.
