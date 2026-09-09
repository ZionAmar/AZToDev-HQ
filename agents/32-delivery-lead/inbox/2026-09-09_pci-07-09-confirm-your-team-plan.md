# Addendum to PCI-07/08/09 — founder wants YOUR real plan, not Noa's guess

**Refers to:** `2026-09-09_pci-07-09-github-relevance-review.md` (same task, same owner, same phase P4 — this is not a new packet, just a required checkpoint before you go further).

## What just happened

Noa gave the founder a first-draft breakdown of this work using invented generic role labels (a placeholder `code-review-id`, not a real roster agent). The founder caught it and pushed back hard: he specifically wants **you** — because you already run WIP/Linear/blockers for the whole Emet dev+SaaS pipeline — to say concretely who on your own team you'd loop in and how, instead of Noa guessing on your behalf. He does not want another straight-to-him answer that isn't actually checked with you first.

## What we need from you before Noa reports anything final to ציון

Write to your outbox (short, this doesn't need to be the full PCI-07/08 deliverable yet):

1. Do you need any other roster agent's help at all for PCI-07 (inventory) / PCI-08 (relevance classification), or can you produce the full table + classification yourself from `gh` data + repo metadata?
2. If you do want help, name **real roster IDs only** (see `_company/ROSTER.md` — e.g. `11-tech-lead`, `12-software-architect`, `20-qa-sdet` — not invented placeholders), and say exactly what you'd hand each of them and why.
3. Confirm you understood the hard constraint already in the main packet: **read-only recommendation only** — no repo archive/delete/visibility change, and this classification pass itself is not "build" work, so it does not need `productWorkEnabled`/PIN. But if your plan would have an engineer open a PR or touch product code, stop and flag that back to Noa first — that crosses into the `תבנו` gate, which is not lit yet.
4. Still resolve the 18 vs 49 repo-count discrepancy per the main packet before any count reaches the founder.

Noa will hold the founder-facing confirmation until this lands in your outbox — she is not going to guess your team composition for you again.
