# Founder Q — הרשאות לשינוי נראות כשהמחשב כבוי?

**Date:** 2026-09-10  
**Founder:** ציון עמר  
**Type:** INFO (no mutation)

## Question

«אין איזה הרשאות שאני יכול לתת לכם שתוכלו לעשות את זה גם כשהמחשב סגור?»

## Answer (Telegram)

כן — יש שתי דרכים אפשריות, ושתיהן דורשות החלטה מודעת ממך.

**המצב היום:** החיבור של הענן לגיטהאב מוגבל לריפו המשרד של החברה בלבד. לכן שינוי פרטי/ציבורי בפרויקטים האישיים שלך עובר דרך נדב (כשהמחשב דולק) — או שאתה משנה בעצמך מהטלפון בגיטהאב.

**אפשרות 1 — הרחבת ההרשאות של Cursor בגיטהאב**  
בהגדרות גיטהאב → Applications → Cursor → לתת גישה לכל הפרויקטים (או לרשימה שתבחר).  
אז הענן יוכל לשנות נראות גם כשהמחשב כבוי — בלי נדב.

**אפשרות 2 — מפתח אישי (טוקן) שלך**  
יוצרים מפתח בגיטהאב עם הרשאה לנהל הגדרות פרויקט, שומרים אותו בצורה מאובטחת אצלנו.  
גם זה עובד כשהמחשב כבוי — אבל זה רגיש יותר: צריך להגביל למה שבאמת צריך ולחדש מדי פעם.

**בכל מקרה:** שינוי כזה עדיין יעבור דרך שער אישור + סיסמה — לא נעשה לבד.

**מה הלאה:** אם תרצה, אכין תוכנית קצרה לאחת מהאפשרויות — תגיד איזו מעדיפ/ה (Cursor מורחב / מפתח אישי / להשאיר כמו היום עם נדב).

## Technical notes (HQ only)

- Cloud GitHub App: `repository_selection=selected`, 1 repo (`AZToDev-HQ`)
- Live mutation attempts: 403/404 on personal repos
- Option 1 = expand App installation scope on github.com/settings/installations
- Option 2 = fine-grained PAT with "Administration: Read and write" on selected repos, stored in `.env` (never git), gated by PIN
- Security review recommended before either path (ליב / founder explicit yes)

LEARNING:
- do: On "permissions when PC off" — offer two concrete paths (expand App vs PAT) + still PIN-gated; don't say impossible
- dont: Promise Cloud can mutate today without explaining scope change is required first
- note: Founder INFO follow-up after Nadav-only visibility explanation; no action requested yet
