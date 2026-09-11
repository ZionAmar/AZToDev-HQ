# PCI-KMG-01 — GITHUB_STATIC_PUBLISH: kids-math-quiz Q10 fix — live verified

**Date:** 2026-09-11T11:43Z · **Owner:** 18-devops-platform (Paz) · **Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167)
**Task:** Republish fixed bundle from `cursor/kids-math-quiz-q10-fix-afab` → `ZionAmar/kids-math-quiz` via desk bridge; verify live JS hash ≠ `index-mKCXMWMT.js`; queue final QA.

## Source

| Field | Value |
|---|---|
| HQ branch | `cursor/kids-math-quiz-q10-fix-afab` |
| Bundle path | `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` |
| New JS | `index-ZmMTvbPf.js` |
| New CSS | `index-RtW13Do3.css` |
| Old JS (pre-fix) | `index-mKCXMWMT.js` |

## Publish execution

Cloud direct push → **403** (expected; App token scoped to AZToDev-HQ only).

Desk bridge via ChemiCloud SSH + `runStaticPublishFromTask`:

```
GITHUB_STATIC_PUBLISH
  REPO: ZionAmar/kids-math-quiz
  SOURCE: agents/14-frontend-engineer/outbox/kids-math-quiz-bundle
  VISIBILITY: public
  HQ_BRANCH: cursor/kids-math-quiz-q10-fix-afab
```

Note: desk `.env` missing `GITHUB_HQ_REPO` — passed `GITHUB_HQ_REPO=https://github.com/ZionAmar/AZToDev-HQ` at runtime for HQ branch hydration. Desk `GITHUB_TOKEN` auth: `ZionAmar`, `canPublish:true`.

Result: **7 files uploaded**, Pages OK, desk reported live **200**.

## Live verification (post-Pages CDN deploy)

| Check | Before (08:17Z) | After (11:43Z) |
|---|---|---|
| `pushed_at` | `2026-09-11T08:17:29Z` | `2026-09-11T11:42:53Z` |
| Live HTML JS | `index-mKCXMWMT.js` | **`index-ZmMTvbPf.js`** ✅ |
| `last-modified` | `08:20:39 GMT` | `11:43:52 GMT` |
| Latest commit | `9df69b6` | `c6a6daf` — `feat: publish static site from HQ desk` |
| Pages URL | 200 | **200** |

**Acceptance:** live JS hash **≠** `index-mKCXMWMT.js` — **PASS**.

## Live URL

**https://zionamar.github.io/kids-math-quiz/**

## Hebrew handoff (for Noa → ציון)

תיקון Q10 עלה לפרודקשן. האתר החי משרת עכשיו build חדש (`index-ZmMTvbPf.js`) — לא ה-build הישן שקרס בשאלה 10. אורי מקבל QA סופי לפני סגירת EMET-167.

---

LEARNING:
- do: Desk `GITHUB_STATIC_PUBLISH` with `HQ_BRANCH:cursor/...` + runtime `GITHUB_HQ_REPO=https://github.com/ZionAmar/AZToDev-HQ` when desk `.env` lacks it; poll Pages CDN until HTML hash flips (workflow ~30s)
- dont: Report publish Done on repo push alone — HTML `last-modified` and JS hash in live curl must change from `index-mKCXMWMT.js`
- note: Q10 fix republished 11:42Z via desk bridge; live verified `index-ZmMTvbPf.js`; QA queued to 20-qa-sdet

HANDOFF:
- done: GITHUB_STATIC_PUBLISH fixed bundle from `cursor/kids-math-quiz-q10-fix-afab`; live JS hash confirmed new; final QA packet written
- next: `20-qa-sdet` — full QA with Q10 focus per inbox packet; on pass → `32-delivery-lead` closes EMET-167
- files: `agents/18-devops-platform/outbox/2026-09-11_kids-math-quiz-q10-fix-republished.md`, `agents/20-qa-sdet/inbox/2026-09-11_kids-math-quiz-final-qa-after-q10-republish.md`

DELEGATE: 20-qa-sdet | Final live QA on https://zionamar.github.io/kids-math-quiz/ — Q10 fix republished (JS hash `index-ZmMTvbPf.js`); pass/fail per `agents/20-qa-sdet/inbox/2026-09-11_kids-math-quiz-final-qa-after-q10-republish.md` for EMET-167 close
