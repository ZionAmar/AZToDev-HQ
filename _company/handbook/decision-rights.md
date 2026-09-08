# Decision Rights (RAPID)

| Letter | Meaning |
|--------|---------|
| **R** | Recommend — proposes option |
| **A** | Agree — must sign off (veto possible) |
| **P** | Perform — executes |
| **I** | Input — consulted |
| **D** | Decide — final call |

## Matrix (defaults)

| Decision | R | A | P | I | D |
|----------|---|---|---|---|---|
| New product bet | CPO | Security (if sensitive) | PM | CTO, CMO, CFO | **CEO** |
| Pricing | CMO/CFO | Legal | Finance Ops | CPO | **CEO** |
| Architecture (stack lock) | Architect | Security, CTO | Tech Lead | Backend/FE | **CTO** (CEO if irreversible) |
| Sprint/ticket priority | PM | — | Eng agents | Tech Lead | **CPO/PM** |
| Merge to main | Author | QA (critical), Security (auth/pay) | DevOps | Tech Lead | **Tech Lead** |
| Production deploy | DevOps | QA, Security (if needed) | DevOps | Tech Lead | **CEO** |
| Public publish | CMO | Legal (claims) | Content/Community | Growth | **CEO** |
| Spend money | CFO | — | Finance Ops | requester | **CEO** |
| Kill project | COO/CPO | — | PM | all leads | **CEO** |

## Conflict rule
If A and D disagree: escalate to CEO with 5-line memo (options + recommendation + risk).
