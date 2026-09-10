# PCI-14 — הפיכת FiTime מציבורי לפרטי

**Board:** `ops/intake/pc-production-inventory-board.json` → task `PCI-14`
**סוג:** שינוי נראות בגיטהאב (mutation). **PIN נקלט** (2026-09-10).
**Founder ask:** «תהפכי לי את הריפוזיטורי פי טיים… לפרייבט» + «ביקשתי את fitime» + «FeeTime» + «מאשר» + PIN

## ריפו (1 בלבד)

| Repo | כיוון |
|------|--------|
| `ZionAmar/FiTime` | public → **private** |

**Fingerprint:** `TARGET:private REPOS:ZionAmar/FiTime`

**מצב נוכחי (Cloud live-check 2026-09-10T10:28Z):** **PUBLIC** (`GET /repos/ZionAmar/FiTime` → 200, `private=false`).

## מה לעשות (PC, חיבור אישי ל-ZionAmar)

**אל תריץ דרך Cursor shell** — השתמש ב-`gh` או בדפדפן עם חשבון ZionAmar.

1. `gh auth status` — ודא חיבור אישי, לא Cursor App token.
2. לפני: `gh repo view ZionAmar/FiTime --json visibility,name`
3. שנה: `gh repo edit ZionAmar/FiTime --visibility private --accept-visibility-change-consequences`
4. אחרי: `gh repo view ZionAmar/FiTime --json visibility` → חייב `PRIVATE`
5. אימות חיצוני: `curl -s -o /dev/null -w "%{http_code}" https://api.github.com/repos/ZionAmar/FiTime` → **404**

## DoD

- outbox: `agents/34-pc-ops/outbox/2026-09-10_pci-14-fitime-private.md`
- טבלה: repo | before | after | status | note
- **אל** תשנה שום ריפו אחר
