# Founder mandate — agent stake automation (2026-09-09)

**Status:** Keep — architecture direction from ציון  
**Owner:** נועה (routing) → קשת (spec + Linear)  
**Pilot:** KidNest GitHub upload (after spec slice 1)

## What the founder wants

Each agent has a **stake in GitHub** (`agents/{id}/`) that defines everything about them:

1. **Knowledge** — what they know (ROLE, TRAINING, PLAYBOOK, memory)
2. **Identity & scope** — who they are, exact job, boundaries (ROLE, PERMISSIONS, ACCESS)
3. **Action history** — dated log of what they did, inputs received, outputs produced, handoffs

A **Cursor Cloud agent** is assigned to each stake. It **listens** for changes in that folder (especially `inbox/`). When a packet appears or updates, the agent reads, understands, acts, writes to `outbox/` + history, and updates **Linear**.

Founder gets updates in Telegram (via נועה) and can track in Linear — automatic, shared, no theater.

## What exists today (honest)

| Piece | Status |
|-------|--------|
| Agent folders (ROLE, inbox, outbox, memory) | ✅ scaffolded for all agents |
| Learning log per agent | ✅ manual append at end of run |
| `emet_delegate` + people ledger (runtime) | ✅ code exists; not always wired to git-visible history |
| File-change listener → auto-run agent | ❌ not production-ready |
| Structured action history (input/output/timestamps) | ❌ missing standard format |
| `activeWork` in factory.json | ❌ null — pipelines not registered |
| Linear auto-sync on agent completion | ❌ partial scripts only (KidNest audit) |

## Corrections (founder 2026-09-09)

- **Do not** route תמיר (35-server-ops) for server checks unless the founder explicitly asks. Server status in company summary should use cached config, not repeated SSH probes.
- KidNest upload pipeline: **קשת** (Linear + plan) + **נדב** (PC folder scan). **Not** תמיר unless server question is raised.

## Build order (proposed)

1. **Spec** — standard packet format, action-log schema, trigger rules (קשת)
2. **Pilot** — KidNest upload as first `activeWork` with 4 phases in Linear
3. **Wire** — inbox drop → delegate → outbox → history → Linear comment
4. **Scale** — same pattern for רות, תמיר (on-demand only), product pipeline

## Success metric

Founder opens Linear or agent folder and sees: who got what, when they started, what they delivered — without asking נועה «מה קורה?».
