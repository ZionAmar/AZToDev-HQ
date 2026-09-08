# Stage Machine — לא לרוץ לסוף; להתקדם נכון

החברה **לא** מודדת הצלחה ב־"סיימנו מוצר מהר".
הצלחה = כל שלב נסגר באמת, עם למידה ומינוף, ורק אז עוברים הלאה.

---

## שלבי יוזמה (Initiative Stages)

| # | Stage | שם | מה נעשה בפנים | מי Lead | ישיבת סגירה | מותר קוד? |
|---|-------|-----|----------------|---------|-------------|-----------|
| 0 | `intake` | קליטה | סיווג IDEA/PROBLEM | CEO | Intake | לא |
| 1 | `discover` | גילוי | מחקר, ראיונות, מתחרים, כאב | CPO + Researcher | Discovery Review | לא (רק spikes קטנים) |
| 2 | `shape` | עיצוב פתרון | PRD, UX flows, non-goals, מטריקות | CPO + PM + UX | Shape Review | לא |
| 3 | `architect` | ארכיטקטורה | ERD, API, ADR, אבטחה | Architect + CTO | Architecture Gate | PoC קטן בלבד |
| 4 | `plan` | תכנון ביצוע | כרטיסים, סדר, DoD, סיכונים | PM + Tech Lead + Delivery | Planning | לא עדיין מוצר מלא |
| 5 | `build` | בנייה | Backend → Frontend → … | Tech Lead | Daily + Mid-build sync | כן |
| 6 | `harden` | חיזוק | QA, Security, perf, a11y | QA + Security | Hardening Review | תיקונים |
| 7 | `stage` | סטייג׳ינג | Deploy staging, smoke | DevOps | Staging Go | כן |
| 8 | `launch` | השקה | Prod gate + תמיכה + הודעות | CEO + CMO + DevOps | Launch Gate | רק hotfix |
| 9 | `learn` | למידה | מטריקות, רטרו, מינוף ל־memory | CPO + CHRO + Analytics | Retro | שיפורים קטנים |
| 10 | `grow` | צמיחה | Growth experiments, content | Growth + CMO | Growth Weekly | לפי ניסויים |

---

## כללי מעבר שלב (חובה)
1. **אין דילוג שלבים** בלי אישור CEO כתוב ב־ops (נדיר).
2. כל מעבר דורש:
   - ישיבת סגירה (או async formal decision אם SEV/זמן)
   - רשימת artifacts
   - סיכונים פתוחים
   - תאריך הישיבה הבאה
   - עדכון `ops/state.json`
3. אפשר **לחזור אחורה** (למשל מ־build ל־shape) אם נחשפה אי־אמת — זה חוזק, לא כישלון.
4. ב־`build` עובדים ב־**slices אנכיים קטנים**, לא "כל הבקאנד ואז כל הפרונט".

---

## מצבי יוזמה בדשבורד
- `active` — עובדים עליה
- `waiting_founder` — מחכים לך
- `blocked` — חסום פנימית
- `paused` — הוקפא במודע
- `done` — נסגר (כולל learn)
- `killed` — נהרג עם סיבה
