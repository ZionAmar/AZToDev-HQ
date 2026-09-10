# 02-spec — cake-recipe-demo (עוגת שוקולד עשירה)

**Bet:** `cake-recipe-demo` · **Architect:** יונה (12-software-architect) · **Date:** 2026-09-10  
**Linear:** [EMET-115](https://linear.app/my-company1460/issue/EMET-115/ksh-03-יונה-architect-spec-screens-use-cases-erd-tree)  
**Quality bar:** `products/kids-math-quiz/index.html` — polished static HTML, RTL, mobile-friendly, no framework bloat.

---

## 1. Purpose

Single-page Hebrew RTL recipe site for **עוגת שוקולד עשירה** (classic rich chocolate cake). Founder opens a live link and sees a beautiful, readable recipe with images — no login, no backend, no database.

## 2. Scope (explicit boundaries)

| In scope | Out of scope |
|----------|--------------|
| One static HTML page | User accounts, forms that submit |
| Hebrew RTL layout | Backend API, MySQL |
| Hero + ingredients + numbered steps + images | Mobile native app |
| Responsive (mobile + desktop) | ChemiCloud deploy |
| Docker for local preview | CMS / admin panel |
| GitHub Pages live link | Nadav / PC disk |

**ADR:** Static site only. No DB — the grain of this entity is *content*, not *records*. Reject clever.

## 3. Recipe content (approved)

**Title:** עוגת שוקולד עשירה  
**Subtitle:** עוגה רכה ולחה — מושלמת ליום הולדת או קפה של שישי  
**Servings:** 12 פרוסות · **Prep:** 25 דק' · **Bake:** 35 דק' · **Difficulty:** בינוני

### Ingredients (מרכיבים)

**לבלילה:**
- 200 גרם קמח לבן
- 50 גרם אבקת קקאו
- 1½ כפיות אפייה
- ½ כפית מלח
- 200 גרם סוכר
- 2 ביצים גדולות
- 240 מ"ל חלב
- 120 מ"ל שמן קנולה
- 1 כפית תמצית וניל

**לציפוי (אופציונלי):**
- 100 גרם שוקולד מריר
- 50 מ"ל שמנת מתוקה

### Steps (שלבים)

1. **חימום תנור** — 180°C. מריחת תבנית 24×34 ס"מ בחמאה וקמח.
2. **ערבוב יבשים** — קמח, קקאו, אבקת אפייה ומלח במערוך.
3. **ערבוב רטובים** — סוכר, ביצים, חלב, שמן ווניל עד תערובת חלקה.
4. **שילוב** — הוספת תערובת יבשה לרטובה; ערבוב עד איחוד (לא לערבב יותר מדי).
5. **אפייה** — יציקה לתבנית, 35 דק' עד שקיסם יוצא נקי.
6. **צינון** — 15 דק' בתבנית, אחר כך על רשת.
7. **ציפוי (אופציונלי)** — המסת שוקולד + שמנת, מריחה על עוגה מצוננת.

### Tips (טיפים)

- אל תפתחו את דלת התנור ב-20 הדקות הראשונות.
- עוגה טובה יותר ביום למחרת — עטפו בניילון נצמד.
- ללא ציפוי: פיזור אבקת סוכר מעל.

*Content note: Rewritten in Hebrew from common public-domain-style chocolate cake patterns — not a verbatim copy of any single source.*

## 4. Visual / UX direction

Reference quality: `products/kids-math-quiz/index.html`.

| Token | Value | Rationale |
|-------|-------|-----------|
| `--bg` | warm cream `#faf6f1` | Food-friendly, not clinical |
| `--card` | `#ffffff` | Content panels |
| `--primary` | chocolate `#5c3d2e` | Brand anchor |
| `--accent` | caramel `#c4956a` | Highlights, step numbers |
| `--success` | sage `#6b8f71` | Optional "done" micro-states |
| `--text` | `#2d2420` | High contrast on cream |
| `--muted` | `#7a6b63` | Meta (time, servings) |
| `--radius` | `16px` | Soft, approachable |
| Font stack | `"Segoe UI", Tahoma, Arial, sans-serif` | Same as kids-math-quiz — proven RTL |

**Layout:** Single column, max-width ~720px centered. Hero full-bleed image with gradient overlay + title. Ingredients in a card with checklist-style bullets. Steps as numbered cards with step image left (desktop) / top (mobile). Sticky "back to top" optional — not required.

## 5. Images (stock — real URLs, no AI fakes)

| Slot | Suggested source | Alt text (he) |
|------|------------------|---------------|
| Hero | Unsplash: chocolate cake slice | פרוסת עוגת שוקולד על צלחת |
| Step 1 | Unsplash: oven / preheat | תנור חם מוכן לאפייה |
| Step 4 | Unsplash: mixing batter | ערבוב בלילת עוגה בקערה |
| Step 5 | Unsplash: cake in pan | עוגה בתבנית לפני אפייה |
| Step 7 | Unsplash: chocolate glaze | ציפוי שוקולד מבריק |

Implementers: pick stable Unsplash CDN URLs (`images.unsplash.com/photo-...?w=800`) or download to `images/` in repo. **Do not** use placeholder gray boxes in the shipped page.

## 6. Technical architecture

```
Browser ──► GitHub Pages (static files)
              │
              └── index.html + css/styles.css + images/

Local dev ──► docker compose up ──► nginx:alpine serves ./
```

- **No backend.** Trust boundary = static file host only.
- **No secrets** in repo.
- **Repo:** new private `ZionAmar/cake-recipe-demo` (created by Cloud in build phase).
- **Live link:** GitHub Pages on that repo (`https://zionamar.github.io/cake-recipe-demo/` or custom Pages URL — Paz confirms exact URL after enable).

## 7. Non-functional requirements

- First Contentful Paint reasonable on 4G (optimize images ≤200KB each where possible).
- Valid HTML5, `lang="he"` `dir="rtl"`.
- Works without JS; optional JS: smooth scroll to sections, print stylesheet trigger.
- Accessible: semantic headings, alt on every image, sufficient color contrast.

## 8. Rejected alternatives

| Alternative | Why rejected |
|-------------|--------------|
| React + Node + MySQL | Overkill for one recipe; founder asked for a page, not a product |
| Expo / mobile app | No mobile-native requirement; PWA not needed for demo |
| ChemiCloud deploy | Explicitly excluded; GitHub Pages is faster and gate-free |
| Nadav pulls from PC | Content born in Cloud; no local disk dependency |
| WordPress / CMS | Adds moving parts; static wins for 12-month demo horizon |

## 9. Handoff checklist

- [x] Spec (this file)
- [x] Screens (`03-screens.md`)
- [x] Use cases (`04-usecases.md`) — minimal
- [x] DB — N/A (`05-db.md` skipped; no persistence)
- [x] Tree (`06-tree.md`)
- [ ] UI tokens sketch — בועז (`09-ui-designer`)
- [ ] HTML/CSS build — דפנה (`14-frontend-engineer`)
- [ ] Docker + Pages — פז (`18-devops-platform`)
- [ ] QA pass — אורי (`20-qa-sdet`)
