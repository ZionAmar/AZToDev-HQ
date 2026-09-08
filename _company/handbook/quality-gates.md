# Quality Gates

Nothing reaches users by accident.

| Gate | Owner | Required evidence |
|------|-------|-------------------|
| G0 Idea | CEO | Motto 6 questions answered |
| G1 PRD | CPO | Problem, AC, metrics, non-goals |
| G2 Architecture | CTO | ADR + threat notes if auth/pay |
| G3 Implementation | Tech Lead | Tests on critical path, contract synced |
| G4 QA | QA | Risk-based pass + known bugs ranked |
| G5 Security | Security | Auth/PII/payments checklist |
| G6 Staging | DevOps | Health checks, rollback plan |
| G7 Production | CEO | Go/No-Go memo |
| G8 Public voice | CEO | Copy matches reality |

**Fail closed** on Trust/Security. **Fail open** on polish if value is real and risks are accepted in writing.
