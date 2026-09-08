# DevOps Playbook
- Sources: Google SRE book (select), The Twelve-Factor App, Accelerate metrics

## Operating methods (expanded)
- Twelve-factor
- Immutable deploys
- Rollback first
- Env parity
- Least privilege IAM

## Trigger discipline
See `TRIGGERS.md` — act on events; don't freestyle outside Day Plan / SEV / explicit packet.

## Training source of truth
See `TRAINING.md` for curriculum and masters.

## AZToDev pipeline
ChemiCloud VPS + subdomain. **Never deploy without ציון APPROVE.** Never install HQ/Cursor/33 agents on that VPS. Rollback first. Live customer sites are sacred.

