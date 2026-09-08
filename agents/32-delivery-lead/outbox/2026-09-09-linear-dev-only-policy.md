# Linear policy — development tasks only

**Date:** 2026-09-09  
**Owner:** קשת (`32-delivery-lead`)  
**Founder policy:** Linear = product **development** pipeline only.

## What changed

| Action | Count | Examples |
|--------|------:|----------|
| Canceled (non-dev) | 61 | OPS-HYGIENE, INV deck, intake board duplicates, KidNest audit, HQ desk EMET-65 |
| Active (Keshet pipeline) | 13 | EMET-66 + EMET-113…124 (KSH-00…KSH-12) |
| Blocked-by chain | 12 | Sequential pipeline per `_company/PRODUCT_PIPELINE.md` |

**Project (phone):** [AZToDev Product — Keshet](https://linear.app/my-company1460/project/aztodev-product-keshet-938f19d950dd)

**Holding issue:** [EMET-66](https://linear.app/my-company1460/issue/EMET-66/armed-wait-for-founder-build-order) — WIP=1 until founder «תבנו» + PIN.

## In Linear vs not in Linear

| Track here | Do **not** track here |
|------------|------------------------|
| Venture → Spec → DB → API → UI → QA → Release | Household / Ruth mail |
| Founder gates (`waiting-founder` label) | PC ops / Nadav |
| One bet, WIP=1 | Server read-only / Tamir |
| Product repo PRs (when enabled) | Intake hygiene, ops board, daily digest |

Ops / intake / household live in **HQ files**: `ops/intake/`, `ops/board.json`, agent outboxes — not Linear.

## Keshet pipeline (assignee + stage)

Source of truth: `ops/keshet-pipeline-board.json` · manifest: `ops/linear-keshet.json`

| Stage | Issue | Owner agent | Stage label |
|-------|-------|-------------|-------------|
| KSH-00 | EMET-66 | `32-delivery-lead` (קשת) | plan + WIP-1 + waiting-founder |
| KSH-01 | EMET-113 | `04-cpo` (ענבר) | discover |
| KSH-02 | EMET-114 | founder (ציון) | waiting-founder |
| KSH-03 | EMET-115 | `12-software-architect` (יונה) | architect |
| KSH-04 | EMET-116 | founder | waiting-founder |
| KSH-05 | EMET-117 | `10-user-researcher` (קרן) | shape |
| KSH-06 | EMET-118 | `16-data-engineer` (שני) | build |
| KSH-07 | EMET-119 | `13-backend-engineer` (רז) | build |
| KSH-08 | EMET-120 | `14-frontend-engineer` (דפנה) | build |
| KSH-09 | EMET-121 | `10-user-researcher` (קרן) | shape |
| KSH-10 | EMET-122 | `20-qa-sdet` (אורי) | harden |
| KSH-11 | EMET-123 | founder | waiting-founder |
| KSH-12 | EMET-124 | `18-devops-platform` (פז) | launch + blocked |

**Assignee in Linear UI:** workspace has one human user (zion). Each issue body lists **Owner agent:** `agent-id` (Hebrew name). When product work opens, assign the human reviewer on founder gates only; agents stay in description + DELEGATE.

**WIP=1 rule:** At most one issue **In Progress** in the Keshet project. קשת moves the single active card; everything else stays Backlog/Todo until unblocked.

**Re-run cleanup:** `node runtime/scripts/linear-keshet-restructure.mjs` (idempotent for cancel patterns; skip re-create if stages exist).

---

## Commit ↔ issue linking (when `productWorkEnabled` opens)

Use Linear’s GitHub integration + commit message keywords so PRs and commits auto-link.

### Commit / PR title format

```
<type>(<scope>): <summary> [EMET-NNN]
```

Examples:

- `feat(api): add session endpoint [EMET-119]`
- `fix(ui): login redirect [EMET-120]`
- `docs(pipeline): venture brief for slug-x [EMET-113]`

### Body (PR description)

```markdown
## Linear
Closes EMET-119

## Artifact
- ops/pipeline/<slug>/08-api.md
- Product repo PR: <url>
```

### Keyword cheat sheet

| Keyword | Effect |
|---------|--------|
| `[EMET-119]` in title | Links commit to issue |
| `Fixes EMET-119` / `Closes EMET-119` in PR body | Closes issue on merge (use only when stage truly done) |
| `Refs EMET-119` | Link without closing |

### Branch naming (Cloud agents)

```
cursor/<short-description>-7285
```

Always mention the active stage issue in the **first commit** of the branch.

### HQ vs product repo

| Repo | Linear issues |
|------|----------------|
| Product GitHub repo (private) | EMET-113…124 during build |
| AZToDev-HQ | No new dev issues — planning docs only |

### When a stage completes

1. Agent posts artifact path in issue comment.
2. PR merged with `Fixes EMET-NNN` only if Definition of Done met.
3. קשת moves next unblocked stage to **In Progress** (still WIP=1).

---

## Founder phone filters

- **Gates:** label `waiting-founder`
- **Active build (later):** label `build` + state In Progress
- **Project view:** AZToDev Product — Keshet only

Demo > status fiction. Age of blocker = time since last issue update on the blocked card.
