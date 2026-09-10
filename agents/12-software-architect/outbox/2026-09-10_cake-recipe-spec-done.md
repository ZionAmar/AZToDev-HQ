# cake-recipe-demo — architect spec complete

**Run:** https://cursor.com/agents/bc-eab515ba-6289-4940-ba27-5253e5999845  
**Architect:** יונה (12-software-architect) · **Date:** 2026-09-10  
**Bet:** `cake-recipe-demo` · **Linear:** [EMET-115](https://linear.app/my-company1460/issue/EMET-115/ksh-03-יונה-architect-spec-screens-use-cases-erd-tree)

## What I did

Read Keshet brief (`agents/12-software-architect/inbox/2026-09-10_cake-recipe-spec-brief.md`). Confirmed scope: **static RTL Hebrew page, no DB/backend**.

**Recipe locked:** עוגת שוקולד עשירה — classic chocolate cake, Hebrew rewrite (not verbatim copy).

**Deliverables written:**

| File | Content |
|------|---------|
| `ops/pipeline/cake-recipe-demo/02-spec.md` | Full spec, tokens, recipe, images, ADR, rejected alternatives |
| `ops/pipeline/cake-recipe-demo/03-screens.md` | Single RecipePage — sections, states, responsive |
| `ops/pipeline/cake-recipe-demo/04-usecases.md` | UC-01 view, UC-02 print (minimal) |
| `ops/pipeline/cake-recipe-demo/05-db.md` | N/A — explicit no-DB decision |
| `ops/pipeline/cake-recipe-demo/06-tree.md` | Repo + HQ mirror layout |
| `ops/pipeline/cake-recipe-demo/diagrams/system-flow.md` | Mermaid: visitor → GitHub Pages |

**Inbox packets for next stage:**

- `agents/09-ui-designer/inbox/2026-09-10_cake-recipe-ui-tokens.md`
- `agents/14-frontend-engineer/inbox/2026-09-10_cake-recipe-build.md`

## Architecture decisions (summary)

- **Static HTML/CSS only** — modular monolith rejected; micro-frontend rejected; React SPA rejected for this demo horizon.
- **GitHub Pages** for live link — ChemiCloud and Nadav excluded per Keshet plan.
- **Quality bar:** `products/kids-math-quiz/index.html`.

## Pipeline status

| Stage | Owner | Status |
|-------|-------|--------|
| Planning | Keshet | Done (EMET-165) |
| Spec | יונה | **Done (this run)** |
| UI tokens | בועז | Ready — inbox packet |
| Frontend build | דפנה | Ready — inbox packet |
| Docker + Pages | פז | Blocked on Dafna repo |
| QA | אורי | Blocked on Paz live URL |

## Separate gate (not blocking this bet)

Founder «אשר» still pending on **GitHub-via-Nadav-only verification plan** (EMET-66). Cake demo proceeds under existing תבנו+PIN — documented in `factory.json.productWorkEnabledNote`.

## Hebrew summary (for Noa → founder)

סיימתי את האפיון לדף מתכון העוגה: מתכון עוגת שוקולד בעברית, עיצוב RTL, בלי בסיס נתונים. העברתי לבועז (עיצוב) ולדפנה (בניית העמוד). אחריהן — פז יעלה דוקר ולינק חי, ואורי יבדוק.

---

LEARNING:
- do: For demo bets, write explicit N/A on 05-db.md instead of skipping — prevents downstream agents from assuming DB was forgotten
- dont: Expand scope to backend/React without stopping at Keshet — brief said stop if DB needed; static was correct
- note: First real architect run; cake-recipe-demo spec pack complete; DELEGATE to Boaz+Dafna

HANDOFF:
- done: Full spec pack under ops/pipeline/cake-recipe-demo/ + inbox packets for UI and frontend
- next: בועז UI tokens (parallel OK) → דפנה builds repo `ZionAmar/cake-recipe-demo` → פז Docker+GitHub Pages live link → אורי QA
- files: ops/pipeline/cake-recipe-demo/*, agents/09-ui-designer/inbox/2026-09-10_cake-recipe-ui-tokens.md, agents/14-frontend-engineer/inbox/2026-09-10_cake-recipe-build.md

DELEGATE: 09-ui-designer | UI tokens for cake-recipe-demo — read inbox packet, output CSS :root + component notes to outbox
DELEGATE: 14-frontend-engineer | Build static RTL recipe page in new private repo ZionAmar/cake-recipe-demo — read inbox + ops/pipeline/cake-recipe-demo/, then DELEGATE to 18-devops-platform for Docker + GitHub Pages live URL
