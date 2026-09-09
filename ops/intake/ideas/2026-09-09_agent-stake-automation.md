# IDEA — Agent-stake automation

> **Date:** 2026-09-09 · **Mandate:** MANDATE-2026-09-09 · **Routed:** Noa → Keshet

## Problem

Agents claim work without durable stake. HQ cannot answer who owns WIP=1, what changed, and what artifact proves it.

## Bet

**Agent-stake** = one accountable owner + machine-readable trail from packet → action → artifact.

## Scope (plan-only)

1. Packet format with YAML frontmatter (`agents/{id}/inbox/`)
2. Three log layers: journal, people-ledger, agent-stake-log
3. Trigger rules T1–T10
4. Pilot on KidNest GitHub upload initiative

## Boards

- `ops/intake/agent-stake-board.json` — rollout AS-01..04
- `ops/intake/kidnest-github-upload-board.json` — pilot KNU-01..04

## Spec

`agents/32-delivery-lead/memory/agent-stake-spec.md`

## Status

AS-01 + AS-02 done (plan). AS-03/04 blocked until PIN + build phase.
