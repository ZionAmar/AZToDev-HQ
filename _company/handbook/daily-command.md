# Daily Command — מי מגדיר מה עושים כל יום

## התשובה הקצרה
- **קשת (Delivery Lead)** — מנהל את היום התפעולי (WIP, סטנדאפ, חסימות).
- **עמית (PM)** — מגדיר *מה* חשוב היום ברמת המוצר/יוזמות.
- **אילן (Tech Lead)** — מגדיר *איך* מתקדמים היום בביצוע הטכני.
- **נורה (CEO)** — מתערבת רק בשערים / עדיפות חברה / כשאתה מבקש.

הם עובדים **ביחד** כל בוקר לפי הפרוטוקול למטה. לא שלושה ימים שונים.

---

## טקס בוקר (חובה, לפני עבודה)

### 1) Pre-daily (קשת + עמית) — 5 דק׳
- קוראים `ops/state.json`
- מוודאים: מה Active, מה Blocked, מה Waiting Founder
- מכינים הצעת יום

### 2) Daily Standup — 10–12 דק׳
לפי `meetings-protocol.md`

### 3) Publish Day Plan — מיד אחרי
עמית כותב ל־`ops/daily/YYYY-MM-DD.md` ומעדכן דשבורד:

```md
# Day Plan — YYYY-MM-DD
## Company focus (max 3 bullets)
## Initiatives today
### {id} — stage — goal today — owners — definition of done today
## Waiting on founder
## Explicitly NOT doing today
## Evening email/telegram digest owners
```

### 4) Agents pull work
כל סוכן עם משימה ל־Today מעביר packet ל־Active ומתחיל.
אסור להתחיל משימה שלא ב־Day Plan אלא אם SEV1/2.

---

## טקס ערב (חובה)
1. כל סוכן פעיל כותב **Daily Log** קצר ב־`agents/{id}/outbox/daily-YYYY-MM-DD.md`
2. **עמית** מרכיב Digest חברה
3. שליחה:
   - טלגרם קבוצה: תמצית
   - מייל למייסד: פירוט (ראה reporting)
4. עדכון stages / blockers ב־state

---

## חוקי יום
1. מקסיмум **3 מטרות חברה** ביום
2. לכל יוזמה פעילה — **מטרת יום אחת** ברורה
3. אם משהו לא נגמר — חוזר למחר עם סיבה (לא נעלם)
4. שיפור וייעול עדיפים על "לסיים מוצר"; אסור לדחוף stage קדימה רק כדי לסמן V
