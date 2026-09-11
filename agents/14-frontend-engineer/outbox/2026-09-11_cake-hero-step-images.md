# Outbox — cake-recipe-demo hero + step images

**Agent:** 14-frontend-engineer (דפנה)  
**Date:** 2026-09-11  
**Task from:** 20-qa-sdet  
**Spec:** `ops/pipeline/cake-recipe-demo/03-screens.md` + `02-spec.md`

## סיכום (לנועה → ציון)

עדכנתי את דף המתכון לפי המפרט: תמונת Hero מלאה, פס meta pills, 7 שלבי הכנה עם תמונות ב-4 שלבים (1, 4, 5, 7), תוכן מתכון מלא מ-02-spec, עיצוב רספונסיבי.

**חסימה:** טוקן Cloud אין לו הרשאת push ל-`ZionAmar/cake-recipe-demo` (git 403, Contents API 403). הקבצים מוכנים ב-bundle; נדב (PC ONLINE) צריך push אחד.

**Live עכשיו:** https://zionamar.github.io/cake-recipe-demo/ — 200, אבל **עדיין גרסה ישנה** (בלי hero/step images, כותרת «עוגת שוקולד רכה»).

## מה נבנה

| Item | Status |
|------|--------|
| Hero image + overlay + title «עוגת שוקולד עשירה» | ✅ in bundle |
| Meta pills (👥 12 · 🕐 25 · 🔥 35 · 📊 בינוני) | ✅ |
| Step images steps 1,4,5,7 (Unsplash CDN) | ✅ 4 images |
| Steps 2,3,6 text-only | ✅ per spec |
| Responsive 40/60 desktop / stack mobile | ✅ CSS |
| Local verify (python http.server) | ✅ 1 hero-image, 4 step-image in HTML |
| Push to product repo | ❌ Cloud blocked |
| Live confirm new content | ❌ pending Nadav push |

## Image URLs (Unsplash, verified 200)

| Slot | URL |
|------|-----|
| Hero | `https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80` |
| Step 1 (oven) | `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80` |
| Step 4 (mix) | `https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80` |
| Step 5 (pan) | `https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80` |
| Step 7 (glaze) | `https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80` |

## Evidence

- Updated bundle: `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/{index.html,styles.css}`
- Nadav inbox: `agents/34-pc-ops/inbox/2026-09-11_cake-hero-step-images-push.md`
- Local commit (product clone, not pushed): branch `cursor/hero-step-images-ee31` @ `/tmp/cake-recipe-demo` commit `d0f231d`
- Live curl (pre-push): `HTTP/2 200` but HTML lacks `hero-image` class

## Push attempt log

```
git push origin cursor/hero-step-images-ee31
→ remote: Permission to ZionAmar/cake-recipe-demo.git denied to cursor[bot] (403)

gh api repos/.../contents/index.html PUT
→ Resource not accessible by integration (403)

gh api permissions.push → false
```

## Next owner

**34-pc-ops (נדב)** — push bundle → main → curl 200 with new HTML  
**Then 20-qa-sdet** — re-verify against 03-screens checklist

HANDOFF:
- done: Hero + step images built per spec; bundle updated; push blocked on Cloud token
- next: Nadav push 2 files to cake-recipe-demo main; QA re-verify live
- files: agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html, styles.css; agents/34-pc-ops/inbox/2026-09-11_cake-hero-step-images-push.md

DELEGATE: 34-pc-ops | Push bundle index.html + styles.css to ZionAmar/cake-recipe-demo main, curl confirm hero-image on live URL, outbox evidence

LEARNING:
- do: Verify Unsplash URLs with curl before shipping; update HQ bundle when Cloud cannot push product repo
- dont: Claim live updated without grep for hero-image on Pages URL
- note: Built full 03-screens layout with 5 Unsplash images; Cloud read-only on product repo — Nadav push required
