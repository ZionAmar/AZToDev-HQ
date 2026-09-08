# Permissions — what is actually connected

Keys in `.env` ≠ every product permission. Pixel ≠ Facebook post. SMTP ≠ inbox read until IMAP works.

Founder gates still apply at **execute** time. PIN for mutations.

| יכולת | סטטוס |
|--------|--------|
| טלגרם / קול (מקוטע תוקן + קצב טבעי) | מחובר כש-HQ דולק על ה-PC |
| Linear | מחובר |
| OpenAI / Gemini | מחובר |
| Gmail שליחה | מחובר — PIN |
| Gmail קריאה | 3 חשבונות (aztodev / amzion / zion) — דרך **רות** |
| GitHub (רשימה דרך Cursor) | מחובר. כתיבת קוד נעולה עד פקודה + PIN |
| מחשב | דרך **נדב** — רק כש-PC דולק |
| שרת ChemiCloud | דרך **תמיר** — SSH קריאה (כולל `ps` לזיכרון). לא restart |
| HQ על ChemiCloud | **כבוי** — `chemiCloudHqDeploy: false` |
| פייסבוק Pixel | יש מזהה. **אין** טוקן עמוד לפרסום |
| יוטיוב | **אין** OAuth |

חסר ב-`.env` לפרסום (לשים אצלך, לא בצ׳אט):

- `META_PAGE_ID` + `META_PAGE_ACCESS_TOKEN`
- `YOUTUBE_REFRESH_TOKEN`
