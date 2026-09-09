# Agent-stake automation — spec (plan-only)

> **Source:** Noa delegation 2026-09-09 · intake `ops/intake/ideas/2026-09-09_agent-stake-automation.md` (referenced; file not yet in HQ clone — spec derived from runtime + handbook).
> **Owner:** Keshet (`32-delivery-lead`) · **Mode:** plan + Linear only until PIN.

## Problem

Agents claim work without durable stake. HQ cannot answer: *who owns WIP=1, what changed, what artifact proves it?* Theater when Telegram says «רות בדקה» without `people-ledger` / board / PR.

**Agent-stake** = one accountable owner + machine-readable trail from packet → action → artifact.

---

## 1. Packet format

File: `agents/{agentId}/inbox/YYYY-MM-DD_{slug}.md`

### Frontmatter (required — machine parse)

```yaml
---
packetId: pkt-2026-09-09-kidnest-github-knu01
stakeOwner: 32-delivery-lead          # agent id with WIP accountability
delegatedFrom: 00-ceo                 # who routed (usually Noa)
initiative: kidnest-github-upload     # matches board.initiative slug
boardTaskId: KNU-01                   # optional link to ops/intake/*-board.json
mode: plan                            # plan | build | read | house | pc | server
pinRequired: false                    # true if task mutates prod/spend/publish/repo
priority: P0                          # P0 | P1 | P2
deadline: 2026-09-10                  # ISO date or null
nextAgent: 34-pc-ops                  # handoff target when this packet completes
linearProject: KidNest — GitHub upload
---
```

### Body (human + agent — unchanged from `_company/WORKFLOW.md`)

```md
# Title (one line)

## Goal
What “done” looks like in one sentence.

## Context
Links: intake idea, board JSON path, prior artifacts.

## Constraints
- WIP=1 · no product PR if `productWorkEnabled` false
- No secrets in git
- Evidence path required

## Success metric
Measurable: file path, Linear issue id, PR url — not “I checked”.

## Deadline
Same as frontmatter or explicit.

## Next agent
Who receives outbox handoff.
```

### Outbox handoff (`agents/{id}/outbox/YYYY-MM-DD_{slug}-handoff.md`)

```md
# Handoff → {next-agent-id}

## Done
- bullet list

## Artifacts (paths)
- `ops/intake/...`
- `agents/32-delivery-lead/memory/...`

## Open risks
- blocker + age

## Asks
One Ask for founder if needed (APPROVE|CHOOSE|INFO|EMERGENCY)
```

### Packet states

`inbox → active → blocked → review → outbox → archived`

Recorded in `ops/runtime/packet-registry.json` (future) or inferred from inbox/outbox filenames + board task status.

---

## 2. Action-log schema

Three layers — **do not merge**; each serves a different consumer.

### A. `ops/runtime/journal/YYYY-MM-DD.jsonl` — system events

Append-only. Existing `journal()` in `runtime/lib/paths.mjs`.

```json
{
  "at": "2026-09-09T10:15:00.000Z",
  "event": "delegate_background_start",
  "jobId": "job-1788788179373-sh3zn",
  "agentId": "32-delivery-lead",
  "fromAgentId": "00-ceo"
}
```

**Use:** ops debugging, PIN gates, Linear sync, product activate.

### B. `ops/runtime/people-ledger.jsonl` — agent turns (founder-visible summary source)

Append-only. Existing `appendPeopleLedger()` in `runtime/lib/agent-memory.mjs`.

```json
{
  "at": "2026-09-09T10:20:00.000Z",
  "agentId": "32-delivery-lead",
  "name": "Keshet",
  "fromAgentId": "00-ceo",
  "ok": true,
  "jobId": "job-1788788179373-sh3zn",
  "cloudAgentId": "bc_abc123",
  "url": "https://cursor.com/agents/bc_abc123",
  "task": "KidNest GitHub upload — publish Linear 4 phases",
  "preview": "Board live EMET-xxx..yyy; activeWork registered"
}
```

**Use:** «who actually ran» — anti-theater. No row = claim did not happen.

### C. `ops/runtime/agent-stake-log.jsonl` — **stake transitions** (new)

One line per stake change. Writer: Keshet runtime hook (future) or manual on board/factory updates.

```json
{
  "at": "2026-09-09T10:25:00.000Z",
  "type": "stake_assigned",
  "slug": "kidnest-github-upload",
  "stakeOwner": "32-delivery-lead",
  "boardPath": "ops/intake/kidnest-github-upload-board.json",
  "boardTaskId": "KNU-01",
  "linearIssue": "EMET-143",
  "packetId": "pkt-2026-09-09-kidnest-github-knu01",
  "mode": "plan",
  "pinRequired": false,
  "evidence": "agents/32-delivery-lead/memory/kidnest-github-upload-plan.md",
  "note": "WIP=1 registered in factory.json activeWork"
}
```

| `type` | When |
|--------|------|
| `stake_assigned` | `factory.json` `activeWork` set or board task → `in_progress` |
| `stake_released` | task `done` + outbox handoff exists |
| `stake_blocked` | task `blocked` or `waiting_founder` > 0 |
| `stake_escalated` | blocker age > 24h → COO/CPO |
| `stake_pin_gate` | mutation attempted without PIN |

Required fields: `at`, `type`, `slug`, `stakeOwner`. Optional: rest.

### D. `ops/config/factory.json` → `activeWork` — company WIP pointer

```json
{
  "activeWork": {
    "slug": "kidnest-github-upload",
    "bet": "KidNest monorepo → private GitHub (plan-only until PIN for repo create/push)",
    "mode": "plan",
    "stakeOwner": "32-delivery-lead",
    "boardPath": "ops/intake/kidnest-github-upload-board.json",
    "linearProject": "KidNest — GitHub upload",
    "linearProjectUrl": "https://linear.app/...",
    "holdingIssueCanceled": false,
    "startedAt": "2026-09-09T10:30:00.000Z"
  }
}
```

When `productWorkEnabled` flips true via `ACTIVATE_PRODUCT`, merge `slug` + `bet` into same object (existing `product-activate.mjs` behavior).

---

## 3. Trigger rules

| # | Trigger | Condition | Action | Owner |
|---|---------|-----------|--------|-------|
| T1 | Founder product intent | `/תבנו|לבנות|לפתח/` + Keep from Noa | Route → Keshet; **plan only** until PIN | `00-ceo` → `32-delivery-lead` |
| T2 | Concrete ops bet lands | Board JSON exists + Noa `DELEGATE` | Set `factory.activeWork`; publish Linear; cancel EMET-66 when bet is real | `32-delivery-lead` |
| T3 | Packet lands in inbox | File in `agents/{id}/inbox/` | Agent moves to `active`; log `stake_assigned` if owns WIP task | stake owner |
| T4 | Background delegate | `startBackgroundDelegate()` | Write BUS handoff + `people-ledger` on completion | router |
| T5 | Infer delegate (Noa skip) | `inferRequiredDelegate()` match | HQ starts specialist without Noa theater claim | runtime |
| T6 | Blocker age | task `blocked` or `waiting_founder` > 24h | Escalate COO (`01-coo`); Telegram one-liner «Age of blocker?» | `32-delivery-lead` |
| T7 | WIP > limit | `activeWork` set while another bet in_progress | **Stop starting**; finish or kill current | `32-delivery-lead` |
| T8 | Mutation without PIN | deploy/spend/publish/repo create/push | Block; log `stake_pin_gate`; ask founder PIN | any agent |
| T9 | Task complete | board task → `done` + artifact path | Sync Linear; outbox handoff; optional `stake_released` | task owner |
| T10 | Product activate | `ACTIVATE_PRODUCT: slug \| bet` + PIN unlocked | `productWorkEnabled=true`; delegate pipeline stage owner | `32-delivery-lead` |

### Anti-triggers (do NOT assign stake)

- Curiosity without packet / day-plan / SEV
- Another role's tools without handoff
- «I asked Ruth» without `people-ledger` row or Gmail JSON artifact

---

## 4. Integration map (existing code)

| Concern | File |
|---------|------|
| WIP pointer | `ops/config/factory.json` |
| Board tasks | `ops/intake/*-board.json` + `runtime/lib/task-board.mjs` |
| Linear sync | `runtime/lib/linear-tasks.mjs`, `runtime/scripts/intake-board-linear-publish.mjs` |
| Delegate | `runtime/lib/background-delegate.mjs` |
| PIN | `runtime/lib/action-pin.mjs` |
| Product on | `runtime/lib/product-activate.mjs` |
| Agent memory | `runtime/lib/agent-memory.mjs` |
| Journal | `runtime/lib/paths.mjs` → `journal()` |

---

## 5. Rollout (plan-only now)

1. ✅ This spec committed under `agents/32-delivery-lead/memory/`
2. ✅ KidNest GitHub upload board + Linear (4 phases)
3. ✅ `factory.json` `activeWork` registered
4. ⏳ Runtime writer for `agent-stake-log.jsonl` — defer until PIN window (build phase)
5. ⏳ `packet-registry.json` — defer

**Do not** create GitHub repo or push KidNest until founder PIN + explicit «תבנו»/approve on KNU-03/KNU-04.
