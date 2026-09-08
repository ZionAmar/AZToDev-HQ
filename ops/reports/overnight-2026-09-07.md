# סיכום לילה — EMET | 2026-09-07

שלום ציון,

עבדתי על ייצוב החברה בזמן שישנת. זה המצב.

## מה עובד עכשיו
- **EMET ON** — דשבורד `http://localhost:8787`
- **טלגרם ↔ נעה** = שיחת Cursor אמיתית ב־`agents/00-ceo` (בלי מסלול מהיר מדומה)
- **מודל Cursor:** `composer-2.5` (תוקן — `composer-2.5-fast` לא היה זמין אצלך וגרם ל־«נתקעתי»)
- **Poll מהיר לטלגרם** כל ~2 שניות — כדי שהודעות לא יישארו תקועות
- **Ack רך** («רגע, על זה…») אם התשובה לוקחת יותר מכמה שניות
- **Timeout** מאפס session כדי לא להשאיר ריצה תקועה
- **ניקוי CMD** אגרסיבי יותר + loop כל 12 שניות
- **33 סוכנים** עם SYSTEM_PROMPT
- **מייל** מחובר (Gmail app password) → `aztodev@gmail.com`

## מה תוקן הלילה (עיקרי)
1. מודל לא תקין → תקיעות מיידיות
2. הודעות טלגרם שלא נמשכו בזמן
3. תיאטרון מסלולים / OpenAI fast lane (הוסר)
4. האצלות בין סוכנים = Cursor sessions אמיתיים (`emet_delegate`)
5. תהליכי `linear-setup` תקועים שפתחו עשרות CMD — נסגרו
6. תשתית מייל לסיכומים

## עדיין פתוח (צריך ממך כשתקום)
| נושא | למה | מה לעשות |
|------|-----|----------|
| **Linear** | אין `LINEAR_API_KEY` / OAuth Connect ב־Cursor | Cursor → MCP → Linear → Connect (פעם אחת) |
| **KidNest board** | לוח 25 משימות מוכן מקומית, לא ב־Linear | אחרי Connect — לבקש מנעה «תעלי ל־Linear» |
| **quiet hours** | 21:30–08:30 — לא מפריעים אלא אם אתה כותב | אופציונלי לשנות ב־`ops/founder-prefs.json` |

## איך לדבר עם החברה
1. פתח Whatsbot / נעה בטלגרם
2. כתוב כמו בצ'אט Cursor — היא עונה / עובדת
3. `שיחה חדשה` = איפוס חלון
4. דשבורד מקומי: http://localhost:8787

## קבצים חשובים
- `ops/intake/kidnest-audit-board.json` — לוח KidNest
- `ops/meetings/2026-09-07_kidnest-audit-plan.md`
- `_company/handbook/telegram-front-desk.md`
- `ops/reports/` — דוחות בריאות

## Loop לילה
רץ ברקע לבדיקות המשך כל ~15 דקות. כשתקום — אפשר לבטל.

---
EMET · בונים אמת. משיטים ערך. מרחיבים מינוף.
