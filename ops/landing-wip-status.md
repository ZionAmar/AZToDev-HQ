# Landing page initiative — WIP status (2026-09-07)

## Initiatives

| ID | Title | Status |
|----|-------|--------|
| IDEA-8976771 | Landing mobile-first + prod link + milestone updates | **DEFER** — order-no-bet |
| IDEA-9375161 | Lawyer landing page | **DEFER** — dedupe of 8976771 |
| IDEA-8132326 | Persona probe | **KILL** |

## Ready to build

**Nothing.** Zero build until founder CHOOSE A|B|C.

| Path | What unlocks | Ready when |
|------|--------------|------------|
| **A** Fold to Parity+ | `PP-LND-legal` sub-deliverable | CHOOSE A + bet (metric + timebox) |
| **B** Hold (default) | Parity+ sole WIP | 24h silence = B; no landing build |
| **C** EMET standalone | `EMET-LND-legal` fresh intake | CHOOSE C + full bet sentence |

## Blocked on

1. **Founder CHOOSE (A|B|C)** — gates all landing + legal work
2. **Intake minimum bar** — missing Problem | Users | Wedge | Non-goals on 8976771
3. **Linear visibility** — board tasks not yet in Linear (API key / MCP)

## What exists (pre-build)

- Intake meetings: `ops/meetings/2026-09-06_intake_IDEA-2026-09-06-1788718976771.md`, `…9375161.md`
- Idea files: `ops/intake/ideas/IDEA-2026-09-06-1788718976771.md`, `…9375161.md`
- CPO draft bet hypothesis (not PRD): in meeting notes
- Conditional ticket skeletons: **HOLD** in `blocked` column until CHOOSE
- Clean board: `ops/board.json`

## What does NOT exist

- PRD / tickets / deploy track / eng branches
- Production URL
- Linear issue URLs (pending publish)

## Recommended next step

**Founder:** Reply CHOOSE **A**, **B**, or **C** (+ one bet sentence if A or C).

**Parallel (2 min):** Add `LINEAR_API_KEY` to `.env` per `ops/linear-founder-unblock.md` → run `node runtime/scripts/linear-publish.mjs` → founder gets phone links.

**If B (or 24h silence):** Parity+ stays sole WIP; landing stays deferred — no eng slot opened.

**If A:** Fold landing under Parity+ pipeline; PM seeds `PP-LND-*` tickets after CPO gate pass.

**If C:** Fresh intake with full bet; PM seeds `EMET-LND-*` after gate pass.
