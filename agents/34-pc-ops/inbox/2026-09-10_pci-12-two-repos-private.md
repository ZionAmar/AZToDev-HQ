# PCI-12 — הפיכת 2 ריפואים מציבורי לפרטי

**Board:** `ops/intake/pc-production-inventory-board.json` → task `PCI-12`
**סוג:** שינוי נראות בגיטהאב (mutation). **דורש PIN** — אל תריץ עד ש-HQ מאשר ש-PIN נקלט.
**Founder ask (2026-09-10):** «גם את final project nodejs וגם את workclock expo app תהפכו לפרטיים»

## ריפואים (2)

| # | Repo | שם ידידותי |
|---|------|------------|
| 1 | `ZionAmar/FinalProjectNodeJS` | Final Project NodeJS |
| 2 | `ZionAmar/ZionAmar-workclock-expo-app` | Workclock Expo App |

**מצב נוכחי (Cloud live-check 2026-09-10T08:16Z):** שניהם **PUBLIC**. Cloud PATCH → 403 (App scoped to AZToDev-HQ only).

## מה לעשות (PC, חיבור אישי ל-ZionAmar)

1. `gh auth status` — ודא שאתה מחובר כמשתמש האמיתי, לא Cursor App token.
2. לכל ריפו, **אחד בכל פעם:**
   - `gh repo edit ZionAmar/<name> --visibility private --accept-visibility-change-consequences`
   - אימות: `gh repo view ZionAmar/<name> --json visibility` → חייב `PRIVATE`
   - אם נכשל — רשום שגיאה מלאה, אל תדלג בשקט.
3. כתוב outbox: `agents/34-pc-ops/outbox/2026-09-10_pci-12-two-repos-private.md`

## DoD

- טבלה: repo | before | after | status (ok/fail) | note
- כל שני הצליחו = done; כל כישלון = fail עם סיבה
- **אל** תשנה ריפואים אחרים

## קשר ל-PCI-11

PCI-11 (7 repos private flip) הושלם בפועל (כל 7 private) אך בלי outbox attribution. PCI-12 הוא בקשה **חדשה** — 2 repos נוספים, לא חלק מ-PCI-11.
