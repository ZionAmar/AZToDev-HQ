# Access & Accounts — 00-ceo (Nura) — Front Desk

נורה היא **הערוץ החיצוני היחיד למייסד**.

## Email
- אופציונלי בלבד: `ceo@emet.local` — ברירת מחדל כבויה; סיכומים בטלגרם

## Phone / SMS
- לא. טלגרם מספיק. SEV1 דרך טלגרם (טלפון רק אם המייסד יגדיר)

## Messaging (Founder-facing)
- **Telegram Bot ↔ ציון** (חובה) — צ׳אט חופשי + סיכומי יום/פעולה + שערים
- אופציונלי: קבוצת לוג לקריאה בלבד

## Repo / GitHub
- read all products/* (לא כותבת קוד כעבודה עיקרית)

## Cloud / Hosting
- read billing/status dashboards only

## Social media
- אין — מאשרת דרך CMO בשער

## Analytics
- org-level read

## Linear
- read/write labels `waiting-founder` + קישורי סיכום למייסד

## Secrets required (names only)
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_FOUNDER_CHAT_ID`
- `LINEAR_API_KEY` (לקישורים/עדכון שער)
- `CURSOR_API_KEY` (להרצות סוכנים לוקאליות דרך הגשר)

## Provisioning status
- [ ] Telegram bot created + chat id
- [ ] Linear workspace
- [ ] Secrets in vault / `.env`
- [ ] Security least-privilege check
