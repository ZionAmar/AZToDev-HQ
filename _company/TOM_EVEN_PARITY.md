# Tom Even Parity+ — הרף החי של AZToDev

אנחנו לא מעתיקים Obsidian. אנחנו שואפים **לאותה תחושת חברה חיה** — ועולים מעליה במה שחשוב לציון: **מוצרי SaaS אמיתיים** על GitHub פרטי + Cursor Cloud.

מקור האמת לתפעול: [`FACTORY.md`](./FACTORY.md). המסמך הזה = רף + צ'קליסט.

## מה תום נותן / מה אצלנו עכשיו

| יכולת | תום | AZToDev (חי) |
|--------|------|----------------|
| זהות + תפקיד | פתקים | `agents/{id}/` + SYSTEM_PROMPT + מודל לפי תפקיד (`ops/config/agent-models.json`) |
| שיחה בין סוכנים | קבצים | `inbox/` → דיספצ'ר · `outbox/` + `DELEGATE:` → תור · (bus = יומן מקומי, לא מקור אמת) |
| ניהול מרחוק | הממשקים שלו | **נועה** בטלגרם + Linear |
| לא מת באמצע | תרבות חיה | stall nag על `activeWork` · PIN nag · outbox wake |
| תוצרים | תוכן/אופרציה | קוד + PR על Cloud (כש-`productWorkEnabled`) |
| PC | מחשב דולק | **נדב** worker בפתיחת Windows → תור על הדלפק |

## Definition of Done — Parity+ Live

- [x] טלגרם ↔ נועה חי (דלפק `aztodev-desk`)
- [x] סטטוס חי: עכשיו / מחכה ל / הבא + קישור Cloud
- [x] Inbox מעיר מומחה (WIP=1)
- [x] Outbox עם `DELEGATE:` מעיר את הבא
- [x] משימה פתוחה במפעל מטרידה כל ~8 דק׳
- [x] מודלים לפי תפקיד (Claude / Composer / Gemini / GPT דרך Cursor SDK)
- [x] בריף מייסד (טלגרם; מייל עם סיסמה / force)
- [x] דלפק מקבל קבצי HQ גם בלי git על השרת — נדב על ה-PC מושך מ-GitHub ודוחף inbox/outbox לדלפק (`hq/lib/hq-pc-mirror.mjs`)
- [ ] דלפק = git clone מלא (אופציונלי) — `ops/scripts/bootstrap-desk-git.sh` אם יש אימות GitHub על ה-VPS
- [x] נדב ב-Startup של Windows — `ops/scripts/install-nadav-startup.ps1`
- [ ] `productWorkEnabled` אחרי «תבנו» + PIN (מכוון כבוי)
- [ ] ישיבת Daily מלאה עם LLM על הדלפק (בריף ערב כן; swarm אופציונלי)

## מה חייב להיות **יותר טוב** מתום

1. SaaS אמיתי ב-GitHub פרטי (לא פתק)
2. שערי PIN + אשר
3. Least privilege (תמיר קריאה בלבד; אין כרטיס אשראי לכולם)
4. ראייה מהטלפון בלי 33 בועות

## אסור לבלבל

- `ops/bus/` = יומן מקומי gitignored — לא «צוות שמדבר»
- 28 כובעים על הספסל ≠ 28 תהליכים ערים
- דלפק בלי `.git` = Cloud כותב ל-GitHub והדלפק לא רואה — זה הפער ש-bootstrap סוגר
