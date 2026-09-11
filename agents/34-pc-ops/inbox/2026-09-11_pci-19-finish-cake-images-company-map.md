# PCI-19 — Finish open cake + company-map deliverables

**Date:** 2026-09-11T06:04Z · **Owner:** 34-pc-ops (נדav) · **From:** 00-ceo (נועה)
**Founder directive:** «אז תסיימו קודם את מה שחסר ממקודם» — close cake images + company map before any new bet (kids math game deferred).

## Live-verified now (curl / GitHub API — not assumed)

| Target | State |
|--------|-------|
| `https://zionamar.github.io/cake-recipe-demo/` | **200** — page works, **0 `<img>` tags** (no hero/step images) |
| `https://zionamar.github.io/aztodev-company-system/` | **404** |
| `ZionAmar/aztodev-company-system` | `public`, `has_pages: false` — Pages never enabled |
| `ZionAmar/cake-recipe-demo` | exists, `main` has index.html with **0 images** |
| `ZionAmar/AZToDev-HQ` | private (no action) |

## Item 1 — NOW — aztodev-company-system: enable Pages + verify

1. Open `https://github.com/ZionAmar/aztodev-company-system/settings/pages`
2. **Build and deployment → Source → GitHub Actions** → Save (one-time manual toggle)
3. Rerun latest failed Pages workflow, or push empty commit to `main`:
   ```
   gh workflow run pages.yml --repo ZionAmar/aztodev-company-system
   ```
   Or: `gh run list --repo ZionAmar/aztodev-company-system --limit 3` then `gh run rerun <id>`
4. Confirm: `curl -I https://zionamar.github.io/aztodev-company-system/` → expect **200**

## Item 2 — cake-recipe-demo: push images version

**Blocker check:** HQ bundle at `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html` currently has **no `<img>` tags**. Dafna (14-frontend-engineer) is adding hero + 4 step images per `ops/pipeline/cake-recipe-demo/03-screens.md` in parallel.

**When bundle contains `<img>` tags (or Dafna's outbox says ready):**

1. Clone or pull `ZionAmar/cake-recipe-demo`
2. Copy updated files from HQ bundle (at minimum `index.html`, `styles.css`, any `images/` folder)
3. One commit + push to `main`
4. Wait for Pages deploy (~1–2 min)
5. Confirm: `curl -s https://zionamar.github.io/cake-recipe-demo/ | grep -c '<img'` → expect **≥ 1**

If bundle still has no images when you finish item 1, **complete item 1 anyway** and write outbox noting item 2 blocked on Dafna — do not wait idle.

## Outbox (required)

Write `agents/34-pc-ops/outbox/2026-09-11_pci-19-finish-cake-images-company-map.md` with:

- Item 1: HTTP status + workflow run URL
- Item 2: commit SHA + img count on live URL, or honest blocker quote
- If both live: `DELEGATE: 20-qa-sdet | Verify cake (RTL + images + mobile) and company-map Pages; report pass/fail before founder gets final links`
