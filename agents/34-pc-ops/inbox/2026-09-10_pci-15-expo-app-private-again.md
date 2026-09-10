# PCI-15 — הפיכת expo-app מציבורי חזרה לפרטי

**Board:** `ops/intake/pc-production-inventory-board.json` → task `PCI-15`
**סוג:** שינוי נראות בגיטהאב (mutation).
**Founder ask (2026-09-10):** «עכשיו תהפכו אותו חזרה לפרייבט» + «תהפכי לי את הריפוזיטורי אקספו-אפ לפרייבט»

## ריפו (1 בלבד)

| Repo | כיוון |
|------|--------|
| `ZionAmar/expo-app` | public → **private** |

**Fingerprint:** `TARGET:private REPOS:ZionAmar/expo-app`

**מצב נוכחי (Cloud live-check 2026-09-10T10:28Z):** **PUBLIC** (`GET /repos/ZionAmar/expo-app` → 200, `private=false`). PCI-13 public test succeeded.

## מה לעשות (PC, חיבור אישי ל-ZionAmar)

**אל תריץ דרך Cursor shell** — השתמש ב-`gh` או בדפדפן עם חשבון ZionAmar.

1. `gh auth status` — ודא חיבור אישי.
2. לפני: `gh repo view ZionAmar/expo-app --json visibility,name`
3. שנה: `gh repo edit ZionAmar/expo-app --visibility private --accept-visibility-change-consequences`
4. אחרי: `gh repo view ZionAmar/expo-app --json visibility` → חייב `PRIVATE`
5. אימות חיצוני: `curl -s -o /dev/null -w "%{http_code}" https://api.github.com/repos/ZionAmar/expo-app` → **404**

## DoD

- outbox: `agents/34-pc-ops/outbox/2026-09-10_pci-15-expo-app-private-again.md`
- טבלה: repo | before | after | status | note
- **אל** תשנה שום ריפו אחר (במיוחד לא FiTime — זה PCI-14)

## סדר

Run **after** PCI-14 unless founder PIN window still open for both — one repo at a time.
