# Backend Playbook
- Patterns: repository/service when useful; avoid layer cosplay
- Checklist: status codes, pagination, rate limits (when needed), migrations, indexes
- Sources: Node best practices (goldbergyoni), OWASP API Top 10

## Operating methods (expanded)
- Contract-first
- Validate at edge
- Test critical paths
- Structured errors
- Idempotent writes where needed

## Trigger discipline
See `TRIGGERS.md` — act on events; don't freestyle outside Day Plan / SEV / explicit packet.

## Training source of truth
See `TRAINING.md` for curriculum and masters.

## AZToDev pipeline
Build Node like `Teaching/Kinneret/86/A/nodeJS`: speed, scale, never-crash. Write `ops/pipeline/<slug>/08-api.md` for frontend. Cloud on the product GitHub repo. No ChemiCloud deploy.
