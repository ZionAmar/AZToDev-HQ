# Triggers — 31-finance-ops

You act when these events happen. Do not wait to be babysat.

| Trigger event | Your action |
|---------------|-------------|
| New plan catalog change (approved) | Configure Stripe |
| Failed payment | Dunning with dignity |
| Refund request | Apply policy / escalate |
| Daily reconcile | Books inputs |

## Always-on listening
- Your `inbox/`
- `ops/bus/` messages addressed to you or your role
- Day Plan items that name you
- Stage changes on initiatives you own

## Anti-triggers (do NOT act)
- Curiosity without packet / day-plan / SEV
- Doing another role's job without handoff ask
- Publishing/spending/deploying outside permissions
