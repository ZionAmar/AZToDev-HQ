# Product pipeline — איך AZToDev בונה מוצר

מקור הסגנון: הקורסים והפרויקטים של ציון על הדיסק.  
**ברירת מחדל לסטאק:** MySQL + Node + React. PWA אם זה מתאים. אחרת הארכיטקט בוחר ומנמק.  
**WIP=1.** כל שלב שמשנה מסמך/קוד/פריסה דורש **PIN + אישור ציון** לפני השלב הבא.  
קוד חי בריפו GitHub פרטי. אפיון ופלטים: `ops/pipeline/<slug>/` (עותק לצפייה) + אותו תוכן ב-PR אם יש ריפו.

## מקורות למידה (חובה לקרוא לפני השלב)

| שלב | תיקייה על הדיסק (C: או D: אחרי ההעברה) |
|------|------------------------------------------|
| יזמות | `Desktop/Studies/יזמות` |
| אפיון, UC, DB Designer | `Desktop/Projects/Final_project` |
| Backend Node | `Desktop/Teaching/Kinneret/86/A/nodeJS` |
| React components/pages | `Desktop/Studies/React` |
| React Native / Expo | `Desktop/Teaching/Kinneret/86/B/React-native-Expo` |

אם תיקייה עברה ל-`D:\` — קרא משם. אל תמציא מתודולוגיה אחרת.

---

## הסדר (לא מדלגים)

```
1. יזם (ענבר)     → סיכום שוק + ערך ייחודי + שווי
2. ציון מאשר
3. ארכיטקט (יונה) → אפיון, מסכים, ERD, מבנה תיקיות, בחירת native vs PWA
4. ציון מאשר את תיקיית הפלטים
5. לקוח (קרן)     → חווה דעה: נוחות, פיצ'רים, סקייל, עיצוב
6. תיקונים עד שציון + קרן שבעי רצון
7. DB (שני)       → בונה לפי הפלט המדויק
8. Backend (רז)   → Node כמו בקורס; תיעוד API לפרונט
9. Frontend (דפנה + בועז) → React לפי האפיון; אייקונים; PWA אם נבחר
10. לקוח (קרן) שוב על כל מסך
11. QA (אורי)     → כל סוגי הבדיקות; מתקנת ממצאים עם ההנדסה
12. לקוח + ציון מאשרים
13. DevOps (פז)   → ChemiCloud / סאב-דומיין — רק אחרי שער פרוד מפורש
```

באגים במוצר חי: מדלגים על יזמות — תיקון → PR → QA. רעיון חדש = Keep מנועה קודם.

---

## מה כל שלב מוציא

תיקייה: `ops/pipeline/<slug>/`

| קובץ | מי | תוכן |
|------|-----|------|
| `01-venture.md` | ענבר | רעיון מלוטש, מתחרים, ערך ייחודי, הערכת שווי, המלצת Keep/Kill |
| `02-spec.md` | יונה | אפיון מלא בסגנון Final_project |
| `03-screens.md` | יונה | כל מסך — מטרה, שדות, מצבים |
| `04-usecases.md` | יונה | Use cases כמו בפרויקט הגמר |
| `05-db.md` + תמונות | יונה | ERD / DB Designer · screenshot אם אפשר |
| `06-tree.md` | יונה | מבנה תיקיות client + server |
| `07-customer-review.md` | קרן | הערות לקוח |
| `08-api.md` | רז | חוזה API לפרונט |
| `09-qa.md` | אורי | ממצאים + repro |
| `10-go-live.md` | פז | רק אחרי שער — מה עלה לאן |

---

## כללי סטאק

- **MySQL + Node + React** אלא אם הארכיטקט כותב למה אי-אפשר.
- React: תיקיית `components/` ותיקיית `pages/` (או `app/` + components) — דפים משתמשים בקומפוננטות.
- אפליקציה למערכת הזו: **PWA** אם אפשר. אחרת יונה בוחר Expo בסגנון הקורס.
- באק: מהירות, יעילות, סקייל, לא קורס. מבנה כמו בקורס Node של כינרת.
- לא Docker על מחשב ציון בלי APPROVE.
- לא ChemiCloud deploy בלי שער. לא «אין צורך ב-DevOps» כתירוץ לעלות ידנית בלי פז — פז עושה את זה **אחרי אישור**, לא במקומו בלי שער.

---

## Linear

קשת פותחת issue לכל שלב (Venture / Spec / DB / API / UI / QA / Release).  
פרויקט (פנימי): [AZToDev Product — EMET](https://linear.app/my-company1460/project/aztodev-product-emet-938f19d950dd). Delivery lead: **קשת**.  
עד שיש הימור אמיתי: [EMET-66](https://linear.app/my-company1460/issue/EMET-66/armed-wait-for-founder-build-order) (Armed — wait for founder).  
ציון רואה מהטלפון. סטטוס אמיתי = issue + artifact, לא סטטוס בטלגרם בלבד.  
Linear למוצר בלבד — לא לרות / נדב / תמיר.
