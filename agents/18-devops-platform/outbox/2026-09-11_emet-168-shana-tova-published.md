# EMET-168 — GITHUB_STATIC_PUBLISH: shana-tova-greeting — live verified

**Date:** 2026-09-11T13:42Z · **Owner:** 18-devops-platform (Paz) · **Linear:** [EMET-168](https://linear.app/my-company1460/issue/EMET-168/shana-tova-greeting-one-pager-rtl-carousel-pages-publish)
**Task:** Create `ZionAmar/shana-tova-greeting`, push bundle, enable Pages, verify curl 200.

## Source

| Field | Value |
|---|---|
| Bundle path | `agents/14-frontend-engineer/outbox/shana-tova-bundle/` |
| HQ branch | `main` |
| Files published | 10 (`index.html`, `styles.css`, `script.js`, `assets/*.svg` ×6, `README.md`) |

## Publish execution

Cloud direct push → **403** (expected; App token scoped to AZToDev-HQ only).

Desk bridge via ChemiCloud SSH + `runStaticPublishFromTask`:

```
GITHUB_STATIC_PUBLISH
  REPO: ZionAmar/shana-tova-greeting
  SOURCE: agents/14-frontend-engineer/outbox/shana-tova-bundle
  VISIBILITY: public
  HQ_BRANCH: main
```

Note: desk `.env` has corrupted newlines (`nGITHUB_HQ_REPO=...` on one line) — passed `GITHUB_HQ_REPO=https://github.com/ZionAmar/AZToDev-HQ` at runtime for HQ branch hydration. Desk `GITHUB_TOKEN` auth: `ZionAmar`, `canPublish:true`.

Initial publish: **10 files uploaded**, Pages API OK, immediate curl → **404** (no workflow yet).

Follow-up: uploaded `.github/workflows/pages.yml` (same pattern as `cake-recipe-demo` / `kids-math-quiz`), workflow run **34605738688** succeeded in 13s.

## Live verification

| Check | Result |
|---|---|
| Repo exists | ✅ `https://github.com/ZionAmar/shana-tova-greeting` (public) |
| `pushed_at` | `2026-09-11T13:38:46Z` (bundle) + `2026-09-11T13:41:14Z` (workflow) |
| Latest commit | `cdf6759` — `feat: add GitHub Pages workflow` |
| Pages workflow | ✅ run 34605738688 — success |
| `curl -I https://zionamar.github.io/shana-tova-greeting/` | **200** ✅ |
| `curl -I …/styles.css` | **200** ✅ |
| `curl -I …/script.js` | **200** ✅ |
| Live HTML | `lang="he"`, `dir="rtl"`, Hebrew blessing, footer `EaseToDev` ✅ |

## Live URL

**https://zionamar.github.io/shana-tova-greeting/**

## Hebrew handoff (for Noa → ציון)

דף שנה טובה עלה לפרודקשן. האתר החי עובד (200) — ברכה עברית RTL, קרוסלת איורים, פוטר EaseToDev בלבד. אורי מקבל QA חי לפני סגירת EMET-168.

---

LEARNING:
- do: Desk `GITHUB_STATIC_PUBLISH` with runtime `GITHUB_HQ_REPO=https://github.com/ZionAmar/AZToDev-HQ` when desk `.env` newlines are corrupted; after bundle upload, add `.github/workflows/pages.yml` if repo has zero workflows (workflow build_type needs a workflow file — same as cake/kids-math)
- dont: Mark publish Done on repo push alone when `build_type:workflow` and no workflow exists — poll until Pages workflow succeeds and curl returns 200
- note: shana-tova-greeting live 13:42Z via desk bridge; workflow cdf6759; curl 200 verified; QA queued

HANDOFF:
- done: GITHUB_STATIC_PUBLISH bundle to `ZionAmar/shana-tova-greeting`; Pages workflow added; live URL returns 200
- next: `20-qa-sdet` — full live QA per inbox packet; on pass → `32-delivery-lead` closes EMET-168 + founder link
- files: `agents/18-devops-platform/outbox/2026-09-11_emet-168-shana-tova-published.md`, `agents/20-qa-sdet/inbox/2026-09-11_emet-168-shana-tova-live-qa.md`, `agents/32-delivery-lead/inbox/2026-09-11_emet-168-shana-tova-published-live.md`

DELEGATE: 20-qa-sdet | Live QA on https://zionamar.github.io/shana-tova-greeting/ — RTL carousel, Hebrew blessing, EaseToDev-only footer, mobile/responsive, console clean; pass/fail for EMET-168 close
