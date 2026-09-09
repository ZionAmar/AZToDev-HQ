# MANDATE-2026-09-09 — Agent stake model (founder voice)

> Captured from Telegram 2026-09-09. Source of truth for how every agent should run.

## What the founder wants

Each agent has a **GitHub stake** — their folder under `agents/{id}/`. That folder defines:

1. **Knowledge** — role, tools, memory, boundaries
2. **Identity** — who they are, what they do and do not do
3. **Action history** — dated log of handoffs: input received, output produced, project context

A **Cloud engine** (Cursor Cloud agent) sits on that folder, **listens for changes** (especially new inbox packets), reads, acts, writes artifacts, and updates **founder + Linear**.

This must be **automatic and shared** — not babysat in Telegram.

## Pilot

**KidNest GitHub upload** is the first end-to-end pilot of this model.

## Explicit exclusions

- **Tamir (35-server-ops)** enters only when the founder explicitly asks for server work — not on every status or project.
- No product code PRs until `productWorkEnabled` + PIN.

## Success criteria

- Founder can open Linear on phone and see phase progress
- Each agent writes to `memory/action-log.jsonl` on every run
- Inbox drop → Cloud run → outbox artifact → board + Linear update — without founder saying «תתקדמו»

## Owner

- Spec + orchestration: **Keshet** (`32-delivery-lead`)
- PC folder prep: **Nadav** (`34-pc-ops`)
- Front desk + gates: **Noa** (`00-ceo`)
