# PCI-KMG-01 — GITHUB_STATIC_PUBLISH: kids-math-quiz

**Date:** 2026-09-11 · **Owner:** 34-pc-ops (נדב) · **Priority:** High — founder waiting on a live link
**Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167) · **From:** 32-delivery-lead (קשת)
**Founder ask (verbatim):** «צרו לי משחק מתמטיקה קטן לילדים בריאקט ועשו הכל ותנו לי קישור בסוף לאתר»
**Gate:** `productWorkEnabled=true`. Founder's own ask is the GO for this bet — no separate PIN
ledger entry found for this specific repo/publish action; flagged, not fabricated. If your PC
session challenges for a PIN/אשר before a mutating GitHub step, say so in your outbox and hold —
do not guess it.

## Task — `GITHUB_STATIC_PUBLISH`

```
REPO:       ZionAmar/kids-math-quiz
SOURCE:     agents/14-frontend-engineer/outbox/kids-math-quiz-bundle
VISIBILITY: public
```

1. Create the repo (`gh repo create ZionAmar/kids-math-quiz --public`) if it doesn't already exist
   — **verified from Cloud this run it does not** (`gh api repos/ZionAmar/kids-math-quiz` → 404).
2. Push the **root-level files** from
   `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` (`index.html`, `assets/`,
   `favicon.svg`, `icons.svg`) to `main`, repo root. **Do not push the `source/` subfolder as the
   site content** — it's the editable React/Vite source, not the built output; pushing it as-is
   would not render (it needs `npm run build` first, already done for you in the bundle root).
3. Enable GitHub Pages: Settings → Pages → Source: **Deploy from a branch → `main` / `(root)`**.
4. Verify: `curl -I https://zionamar.github.io/kids-math-quiz/` → expect `200`.

## Why this needs you (not Cloud)

Live-verified this run: Cloud's GitHub App token gets `403 Resource not accessible by integration`
on both `gh api user` and `gh repo create ZionAmar/kids-math-quiz` — same root cause as every
prior PCI item (PCI-11, PCI-14): Cloud's token is scoped to `AZToDev-HQ` only, it cannot create
repos or push under the founder's personal account. This is a pure GitHub action — **no PC boot
required** if the desk's own GitHub write path (the one that auto-published `cake-recipe-demo` on
2026-09-11T06:12Z, per `agents/32-delivery-lead/outbox/2026-09-11_pci-kmg-01-*` and
`ops/company-lessons.md#cloud_github_pc_off_bridge`) can pick this up instead. If that desk token
is missing or not configured, say so loudly in your outbox (do not silently wait for the PC to
boot — per the same company lesson, "missing desk token = loud error not silent PC wait").

## Definition of done

- [ ] Repo `ZionAmar/kids-math-quiz` exists, public
- [ ] `index.html` + `assets/` on `main` at repo root (built bundle, not source)
- [ ] Pages enabled, source = `main` / root
- [ ] `curl -I https://zionamar.github.io/kids-math-quiz/` → `200`
- [ ] Outbox: `agents/34-pc-ops/outbox/2026-09-11_pci-kmg-01-kids-math-quiz-published.md` with repo
      URL, commit SHA, Pages URL, curl status — or the exact blocker if any step fails

Once step 4 passes, notify `32-delivery-lead` (or write directly to
`agents/32-delivery-lead/inbox/`) so the founder gets the real live link, not a guess.
