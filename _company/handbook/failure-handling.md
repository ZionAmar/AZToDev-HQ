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

## Blameless retros
Fix systems and prompts. Update `PLAYBOOK.md` + `memory/`. CHRO owns prompt quality debt.
