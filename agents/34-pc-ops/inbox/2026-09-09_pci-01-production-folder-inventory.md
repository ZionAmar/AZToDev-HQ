# PCI-01 + PCI-02 — נדב, סריקת קריאה בלבד

**Board:** `ops/intake/pc-production-inventory-board.json`
**Linear:** EMET-155, EMET-156 (project: PC — סריקת in_production)
**סוג:** קריאה בלבד. אין יצירת ריפו, אין push, אין מחיקה, אין "מאשר מיקום" — ציון כבר נתן את הנתיב.

## PCI-01 — סרוק את `C:\Users\amazi\Desktop\Projects\in_production`

לכל תת-תיקייה (כל פרויקט) ברמה הראשונה תחת `in_production`:

1. שם התיקייה
2. גודל משוער (סה"כ, לא לרדת ל-node_modules בפירוט)
3. תאריך שינוי אחרון
4. יש `.git`? כן/לא
5. אם יש `.git` — `git remote -v` (מה ה-URL, אם קיים)
6. זיהוי טכנולוגי גס (יש `package.json`? `requirements.txt`? `.csproj`? וכו') — שורה אחת, לא ניתוח עומק

גם: רשימת שמות התיקיות ברמה של `C:\Users\amazi\Desktop\Projects\` (אחיות של `in_production`) — שמות בלבד, בלי סריקה עמוקה. זה כדי לדעת אם יש עוד "in_something" מלבד production.

## PCI-02 — אימות חוזר קצר על קידניסט (לא שער נפרד, פסקה אחת בדוח)

בדיקה חיה מ-Cursor Cloud (00-ceo, GitHub API, 2026-09-09 13:38Z) **לא מוצאת** ריפו `ZionAmar/kidnest` — לא ב-`gh repo list ZionAmar`, לא ב-`gh repo view`, לא בחיפוש. זה סותר את הסטטוס "done" שנרשם ב-KNU-03/EMET-153.

בתוך תיקיית `in_production\kidnest` המקומית תבדוק (קריאה בלבד):
- `git remote -v` — האם origin מוגדר, ולאיזה URL
- `git log --oneline -5` ו-`git status`
- אם יש ניסיון push קודם — מה השגיאה האחרונה (אם יש לוג/הודעה על המסך)

**אל תריץ push, אל תיצור ריפו, אל תשנה כלום.** רק דיווח מה קיים בפועל.

## פורמט תשובה

כתוב קובץ ל-`agents/34-pc-ops/outbox/2026-09-09_pci-inventory-report.md` עם:
- טבלה/רשימה של הפרויקטים תחת in_production + הפרטים מלמעלה
- פסקה נפרדת על קידניסט (PCI-02)
- החזרה קצרה בעברית שנועה יכולה להעביר לציון

**Playbook:** קריאה בלבד תמיד קודם. בלי לשאול "האם אני בתיקייה הנכונה" — הנתיב כבר אושר. בלי לבקש PIN — זו לא פעולה משנה.
