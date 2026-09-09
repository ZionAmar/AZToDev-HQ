# PCI-07/08/09 — Full GitHub relevance review (private + public)

**Board:** `ops/intake/pc-production-inventory-board.json` (phase P4, same bet as `pc-production-inventory` — do NOT open a new Linear project or a parallel board. Phase P3 on this same board is a separate, unrelated in-flight item — tehillim/tehora repo creation — leave it alone.)
**Owner:** 32-delivery-lead (קשת)
**Priority:** P1 (PCI-07/08), P0 for the final report handoff (PCI-09, owned by 00-ceo once your input is ready)
**Founder ask (verbatim intent):** "עברו על הגיטהאב שלי, יש מלא פרויקטים, חלק פרטי חלק ציבורי, חלק קטנים חלק גדולים — תגידו לי מה לדעתכם פרויקטים לא רלוונטיים, תעברו עליהם, תלמדו אותם."

## Do first — reconcile the repo count before anything else

Two different repo counts exist right now and they don't match:

- `ops/config/factory.json.cursorGithubRepoCount` = 49
- This Cloud session's own live check (`gh repo list ZionAmar`, run 2026-09-09T15:33Z) returned **18** repos — same 18 seen during the earlier PCI-02 check today. All but `AZToDev-HQ` show as public. `kidnest`, `Work_clock`, and `TelemustAddUsers` — all listed as private repos in `ops/config/factory.json` `repos{}` — do not appear in this live list at all.

Root cause hypothesis (not yet confirmed): the Cursor GitHub App token this Cloud session runs under is scoped/limited and cannot see every private repo under `ZionAmar`. **Do not report a final repo count or a full relevance table to the founder until this is reconciled against one authoritative source** — either:

1. Chain a `DELEGATE: 34-pc-ops | <task>` in your own outbox asking Nadav to run `gh repo list ZionAmar --limit 200 --json name,visibility,pushedAt,description,diskUsage` (or open github.com/ZionAmar?tab=repositories while logged in personally) and paste the full raw list back — his session is logged in as the actual person, not the scoped Cursor App; or
2. If you have a way to get a full-scope token in this Cloud session, use that instead and note the method used.

Either way, log which method produced the final authoritative count/list in your outbox — this is exactly the kind of unverified-number mistake already burned once (see `ops/company-lessons.md`).

## PCI-07 — Full inventory

For every repo in the authoritative list: name, visibility (private/public), primary language, approx size, last push date, one-line description (from GitHub, or infer from README if empty). Write the table into your outbox as a real artifact (markdown or JSON), not just prose.

## PCI-08 — Relevance classification

For each repo, classify as one of:
- **Keep — active/relevant** (real product, still used, or clearly valuable)
- **Keep — portfolio/learning value** (course finals, demos worth keeping visible even if not "live")
- **Review** (unclear — needs the founder's own call, e.g. old client work, ambiguous ownership)
- **Candidate to archive/delete** (forks with no changes, throwaway CI/test repos, exact duplicates, dead scaffolding)

One-line reasoning per repo. Use signals you already have: last push date, whether it's a fork, whether the name/description reads as a test/scratch repo (e.g. `ci-test`, `ci-pipeline-test`, `chrome-test`, `todo` look like candidates worth a second look — verify, don't assume from the name alone).

**Hard constraint:** this is a recommendation only. No repo gets archived, deleted, made private/public, transferred, or removed from disk. Any of those is a mutation and needs the founder's explicit yes + PIN, per `_company/DELEGATION_POLICY.md`.

## PCI-09 — Handoff to 00-ceo

Write your findings to your outbox (`agents/32-delivery-lead/outbox/`) as a dated markdown file with the full table + classification + the reconciliation method you used for the repo count. `00-ceo` picks that up to write the short Hebrew Telegram report and hold for the founder's Keep/Review/Archive decision per repo (PCI-09 in the board is already assigned to `00-ceo` for that reason — you only need to hand off a clean artifact, not draft the Telegram message yourself).

## Do not

- Do not open a new Linear project or a second board for this — same bet, phase P4 (P3 on this board is the unrelated tehillim/tehora work, don't touch it).
- Do not report a repo count to the founder that mixes the 18/49 numbers without saying which is authoritative and why.
- Do not touch repo visibility, delete anything, or transfer ownership.
