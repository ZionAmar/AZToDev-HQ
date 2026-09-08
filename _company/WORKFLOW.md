# Workflow — Idea / Problem → Deliberate Delivery

> Full rules: [`RULES.md`](./RULES.md) · Stages: [`handbook/stage-machine.md`](./handbook/stage-machine.md)

## A) IDEA path (do not rush)
1. Founder / agent drops IDEA → `ops/intake/ideas/` (+ optional `inbox-ceo/`)
2. **Intake meeting** (CEO, CPO, PM, CTO) — Keep / Defer / Kill / Explore
3. Stages in order: `discover → shape → architect → plan → build → harden → stage → launch → learn → grow`
4. Each stage ends with a meeting + dashboard update + optional Telegram summary
5. Founder is pinged only on gates / `waiting_founder`

## B) PROBLEM path
1. Drop in `ops/intake/problems/`
2. Severity classification
3. SEV1/2 → War-Room; else PM backlog / Tech Lead assign
4. Fix → QA → deploy gates as needed → prevent recurrence (COO)

## C) Every working day
1. Keshet (Delivery) facilitates Daily
2. Amit (PM) publishes Day Plan → `ops/daily/` + `ops/state.json`
3. Agents collaborate on `ops/bus/` proactively
4. Evening: Telegram summary + founder email digest (+ per-agent emails when active)

## D) Dashboard
```bash
node dashboard/server.mjs
```
Open http://localhost:8787

## Packet format (inbox item)
```md
# Title
## Goal
## Context
## Constraints
## Success metric
## Deadline
## Next agent
```

## Handoff format (outbox item)
```md
# Handoff → {next-agent}
## Done
## Artifacts (paths)
## Open risks
## Asks
```
