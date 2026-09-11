# QA Verify — cake-recipe-demo live (GitHub Pages)

**Date:** 2026-09-11  
**Agent:** 20-qa-sdet (אורי)  
**URL:** https://zionamar.github.io/cake-recipe-demo/  
**Task:** Verify RTL Hebrew, mobile layout, images — evidence before founder handoff  
**Verdict:** **CONDITIONAL PASS** — site live and RTL/mobile OK; **images missing (SEV-Medium)**

---

## Executive summary (Hebrew — for Noa → ציון)

האתר **חי** (HTTP 200) ונראה טוב בעברית RTL ובמובייל.  
**בעיה:** אין **אף תמונה** — לא תמונת גיבור ולא תמונות בשלבים. לפי האפיון (`03-screens.md`) תמונות הן חובה.  
המתכון עצמו קריא ומסודר; חסר רק השכבה הוויזואלית.

**המלצה:** לא לסמן «מושלם» לציון עד שדפנה מוסיפה תמונות. RTL + מובייל — **עובר**.

---

## Verification matrix

| Check | Method | Result | Severity |
|-------|--------|--------|----------|
| Site live | `curl -sI` → HTTP 200 | **PASS** | — |
| `lang="he"` | HTML parse | **PASS** | — |
| `dir="rtl"` | HTML parse | **PASS** | — |
| Hebrew content | Regex + visual | **PASS** | — |
| Viewport meta | HTML parse | **PASS** | — |
| Mobile responsive | 375×812 browser + CSS `@media (min-width: 720px)` | **PASS** | — |
| No horizontal overflow | Mobile visual inspection | **PASS** | — |
| Logical CSS (RTL-safe) | `margin-inline`, `inset-inline-start` in CSS | **PASS** | — |
| Hero image | HTML `<img>` count + asset probe | **FAIL** (0 tags; `/assets/hero.jpg` 404) | SEV-Medium |
| Step images | HTML + visual | **FAIL** (none present) | SEV-Medium |
| Spec title match | vs `02-spec.md` | **WARN** — live «רכה» vs spec «עשירה» (known) | SEV-Low |
| Step count | vs spec (7 steps) | **WARN** — live has 6 steps | SEV-Low |

---

## Evidence

### HTTP (2026-09-11T05:27Z)

```text
curl -sI https://zionamar.github.io/cake-recipe-demo/
HTTP/2 200
content-type: text/html; charset=utf-8
last-modified: Fri, 11 Sep 2026 05:10:44 GMT
```

### Automated HTML/CSS checks

```text
lang=he: True
dir=rtl: True
viewport: True
img_tags: 0
hebrew_chars: True
title: עוגת שוקולד רכה — מתכון
has_mobile_media: True
has_logical_props: True
```

### Asset probe

```text
styles.css: 200
index.html: 200
assets/hero.jpg: 404
images/hero.jpg: 404
hero.jpg: 404
```

### Visual QA (browser)

| Viewport | Finding |
|----------|---------|
| Desktop (~1280px) | RTL Hebrew readable; brown gradient header; ingredients + steps in card grid; footer credits «דמו סטטי RTL · AZToDev · Frontend Engineer (דפנה)» |
| Mobile 375×812 | Single column; no overflow; typography scales via `clamp()`; cards stack correctly |

Screenshots (Cloud artifacts):

- `/opt/cursor/artifacts/screenshots/cake-demo-desktop.webp`
- `/opt/cursor/artifacts/screenshots/cake-demo-mobile-375.webp`

---

## Spec gaps (non-image)

Reference: `ops/pipeline/cake-recipe-demo/02-spec.md`, `03-screens.md`

| Item | Spec | Live | Notes |
|------|------|------|-------|
| Title | עוגת שוקולד **עשירה** | עוגת שוקולד **רכה** | Already flagged by DevOps — cosmetic |
| Difficulty | בינוני | קל | Minor |
| Servings | 12 פרוסות | 10 פרוסות | Minor |
| Steps | 7 (incl. optional coating) | 6 | Missing step 7 «ציפוי» |
| Ingredients split | לבלילה / לציפוי | Single flat list | Minor structure diff |
| Tips | 3 bullet items | 1 tip card «טיפ של דפנה» | Minor |

These are **documentation/content drift**, not release blockers for a demo — **images are the blocker** for the verification checklist Noa sent.

---

## Risk assessment

| Risk | Level | Rationale |
|------|-------|-----------|
| User cannot see what cake looks like | Medium | Recipe demo purpose is visual + readable |
| Founder expects images per spec | Medium | Explicit in architect screens doc |
| RTL/mobile broken on real devices | Low | Verified meta + CSS + mobile viewport |
| Site down / 404 | None | curl 200 confirmed |

---

## Recommended actions

1. **14-frontend-engineer (דפנה):** Add hero `<img>` + step images per `03-screens.md`; use royalty-free placeholders or bundled assets; redeploy via existing Pages workflow.
2. **20-qa-sdet (re-run):** After images land — re-verify img 200s, mobile hero height (~360px), alt text, broken-image fallback.
3. **Optional (Keshet):** Align title/steps/content with `02-spec.md` if founder wants exact spec wording.

---

## Hebrew handoff substance

**מה נבדק:** הקישור החי עובד. העברית RTL תקינה. במובייל (375px) הדף נראה מסודר — עמודה אחת, בלי גלילה לצד.  
**מה לא עבר:** **תמונות** — אין בכלל. זה פער מול האפיון.  
**לציון:** אפשר לפתוח ולקרוא את המתכון; זה עדיין לא «מתכון עם תמונות» כמו שתוכנן.

---

HANDOFF:
- done: Live URL verified (200); RTL Hebrew + mobile layout PASS; images FAIL documented with curl + browser evidence.
- next: Frontend adds hero + step images per `03-screens.md`, push to `ZionAmar/cake-recipe-demo`, then QA re-run.
- files: `agents/20-qa-sdet/outbox/2026-09-11_cake-recipe-demo-qa-verify.md`, `/opt/cursor/artifacts/screenshots/cake-demo-{desktop,mobile-375}.webp`

DELEGATE: 14-frontend-engineer | Add hero image + step images to `ZionAmar/cake-recipe-demo` per `ops/pipeline/cake-recipe-demo/03-screens.md` (object-fit cover, lazy load, alt text). Push and confirm live URL shows images; ping QA for re-verify.

LEARNING:
- do: curl 200 + count `<img>` tags before claiming images pass; cross-check against `03-screens.md` not just visual polish.
- dont: Rubber-stamp «images OK» when `img_tags: 0` and asset paths return 404.
- note: First QA run — cake demo live RTL/mobile good; zero images vs architect spec.
