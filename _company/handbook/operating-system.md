# Operating System

## Unit of work
A **packet** in an agent `inbox/` with goal, constraints, success metric, deadline, next agent.

## States
`Inbox → Active → Blocked → Review → Outbox → Archived`

## WIP limits
- Company: max 2 build bets + 1 growth bet
- Per agent: max 3 active packets
- If blocked > 24h: escalate to Tech Lead / COO with a one-liner ask

## Artifacts live in
- Plans/PRDs: `products/{name}/docs/`
- Code: `products/{name}/`
- Agent memory: `agents/{id}/memory/`
- Digests: `_company/daily/`

## Definition of progress
User-visible value, risk reduced, or a decision unlocked — not “meetings held” or “tokens spent”.
