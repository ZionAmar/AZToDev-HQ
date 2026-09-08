# AZToDev HQ

המפעל האמיתי לפי החלום: **טלגרם תמיד-חי + Cursor Cloud על ריפו פרטי**.  
33 התיקיות ב-`agents/` הן ספריית מומחים, לא 33 תהליכים.

## מה רץ
```
הטלפון (Telegram)
    → נורה (HQ)
    → קוד: Cursor Cloud על GitHub פרטי  (המחשב יכול להיות כבוי)
    → לוח: Linear (כבר ב-.env)
    → מייל: Gmail (כבר ב-.env)
```

## הפעלה מקומית
```bat
HQ-ON.bat
```
בריאות: http://127.0.0.1:8788/health

המפתחות נטענים מ-`.env` הקיים. אל תדביק אותם בצ'אט.

## Cloud (כשהמחשב כבוי)
1. חבר GitHub לחשבון Cursor (Settings → GitHub).
2. שים ב-`.env`: `GITHUB_REPO=https://github.com/OWNER/repo` (פרטי).
3. נורה קוראת `emet_cloud_work` — PR, לא דיפלוי לפרוד.

## VPS (ChemiCloud) — כדי שטלגרם יעבוד כשה-PC כבוי
ראה [`../deploy/CHEMICLOUD.md`](../deploy/CHEMICLOUD.md)

## שערים (ציון בלבד)
פרוד, כסף, פרסום, מוצר חדש, סודות.
