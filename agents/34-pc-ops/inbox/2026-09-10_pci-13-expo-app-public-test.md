# PCI-13 — טסט: הפיכת expo-app מפרטי לציבורי

**Board:** `ops/intake/pc-production-inventory-board.json` → task `PCI-13`
**סוג:** שינוי נראות בגיטהאב (mutation). **PIN נקלט** (2026-09-10).
**Founder ask:** «בוא נעשה טסט, תיקח את expo-app, תהפוך אותו לפאבליק» + «מאשר» + PIN

## ריפו (1 בלבד)

| Repo | כיוון |
|------|--------|
| `ZionAmar/expo-app` | private → **public** |

**מצב נוכחי (Cloud live-check 2026-09-10T08:44Z):** **PRIVATE** (public API 404).

## מה לעשות (PC, חיבור אישי ל-ZionAmar)

**אל תריץ דרך Cursor shell** — השתמש ב-`gh` או בדפדפן עם חשבון ZionAmar.

1. `gh auth status` — ודא חיבור אישי, לא Cursor App token.
2. לפני: `gh repo view ZionAmar/expo-app --json visibility,name`
3. שנה: `gh repo edit ZionAmar/expo-app --visibility public --accept-visibility-change-consequences`
4. אחרי: `gh repo view ZionAmar/expo-app --json visibility` → חייב `PUBLIC`
5. אימות חיצוני: `curl -s -o /dev/null -w "%{http_code}" https://api.github.com/repos/ZionAmar/expo-app` → **200**

## DoD

- outbox: `agents/34-pc-ops/outbox/2026-09-10_pci-13-expo-app-public-test.md`
- טבלה: repo | before | after | status | note
- **אל** תשנה שום ריפו אחר

## הערה

הודעה קודמת מנועה טעתה («8 ריפואים לפרטי») — המשימה הזו היא **רק expo-app → ציבורי**, טסט בודד.
