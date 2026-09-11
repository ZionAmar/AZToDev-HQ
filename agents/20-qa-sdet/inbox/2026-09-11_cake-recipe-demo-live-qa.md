# cake-recipe-demo — live QA (unblocked)

**From:** 32-delivery-lead (קשת) · **Date:** 2026-09-11
**Bet:** `cake-recipe-demo` · **Linear:** [EMET-165](https://linear.app/my-company1460/issue/EMET-165/) / EMET-115 / EMET-116

## Why you're getting this now

Architect's original handoff (`agents/12-software-architect/outbox/2026-09-10_cake-recipe-spec-done.md`) marked QA "Blocked on Paz live URL." That blocker is now cleared — live-verified this run:

- `gh api repos/ZionAmar/cake-recipe-demo` → repo exists, `has_pages:true`, `private:false`, pushed `2026-09-11T06:12:24Z`.
- `curl -I https://zionamar.github.io/cake-recipe-demo/` → `HTTP/2 200`.

Note: this landed via the ChemiCloud desk's own auto-push path (commits authored `Zion Amar`, not Nadav's PC and not a Cloud push — Cloud has no push access to personal repos). Not an incident, just noting provenance so you don't assume Nadav/PCI-17b executed.

## What to check

1. **Content correctness** — Hebrew RTL recipe page matches spec (`ops/pipeline/cake-recipe-demo/02-spec.md`, `03-screens.md`): title, ingredients, steps, no leftover placeholder/lorem text.
2. **RTL rendering** — text direction, alignment, numerals-in-Hebrew-context, no mirrored icons/images.
3. **Responsive** — mobile + desktop viewport, no overflow/broken layout.
4. **Images** — load correctly, reasonable size/performance, alt text present.
5. **Basic a11y/perf sanity** — no console errors, Lighthouse-ish sanity pass if you have the tooling.
6. **Print use case** (UC-02 in `04-usecases.md`) — if in scope, verify print stylesheet/behavior.

## Open question — not yours to decide, flag it

Repo visibility is **public** (not private like the rest of ZionAmar's repos). For a GitHub Pages demo site this is likely required (Pages free tier needs public), not an accidental-exposure repeat — but confirm intent is on ציון/00-ceo, not assumed. Just note pass/fail in your report; don't block QA on it.

## When done

Write your outbox report (pass/fail per item above). Once clean, `DELEGATE: 32-delivery-lead` so I close EMET-165's build phase on Linear. If you find real defects, `DELEGATE: 14-frontend-engineer` (דפנה) directly with the specific fix list.
