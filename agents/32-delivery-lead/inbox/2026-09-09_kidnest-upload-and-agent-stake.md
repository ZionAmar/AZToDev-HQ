---
packetId: pkt-2026-09-09-kidnest-upload-agent-stake
stakeOwner: 32-delivery-lead
delegatedFrom: 00-ceo
initiative: kidnest-github-upload
boardTaskId: KNU-01
mode: plan
pinRequired: false
priority: P0
deadline: 2026-09-09
nextAgent: 34-pc-ops
linearProject: KidNest — GitHub upload
mandate: MANDATE-2026-09-09
---

# KidNest GitHub upload pilot + agent-stake spec

## Goal

Founder opens **one Linear project URL on phone** with 4 gated phases; HQ has agent-stake spec + boards updated with evidence.

## Context

- **Mandate:** MANDATE-2026-09-09 (Noa → Keshet, plan-only)
- **Boards:** `ops/intake/kidnest-github-upload-board.json`, `ops/intake/agent-stake-board.json`
- **Spec:** `agents/32-delivery-lead/memory/agent-stake-spec.md`
- **Prior audit:** KidNest production review (EMET audit project, done)

## Constraints

- WIP=1 · `productWorkEnabled` false — no repo create/push, no product PRs
- Monorepo v1 — do not split api/admin/mobile/tv
- No secrets in git
- KNU-03/KNU-04 blocked until founder PIN

## Success metric

| Deliverable | Evidence |
|-------------|----------|
| Linear project (4 phases) | `linearProjectUrl` on kidnest board |
| Agent-stake spec | `agents/32-delivery-lead/memory/agent-stake-spec.md` |
| Board statuses | both board JSONs `updatedAt` + summary |
| Stake log | `ops/runtime/agent-stake-log.jsonl` entry |

## Deadline

2026-09-09 (same day)

## Next agent

**נדב** (`34-pc-ops`) — KNU-02 PC scan after KNU-01 done.
