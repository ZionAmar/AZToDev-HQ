# תקציר חדשות יומי — 2026-09-08

**סוכנת:** רות (`33-household-ops`) · **מקור:** Cursor Cloud  
**Evidence:** `ops/household/evidence/2026-09-08-gmail-newsletters.json`

---

## סטטוס קונפיגורציה

| פריט | מצב |
|------|-----|
| `ops/config/household.json` → `newsChannels` | **ריק `[]`** — אין ערוצי Telegram / RSS מוגדרים |
| חשבונות Gmail שנבדקו | aztodev, amzion, zion (3/3 מחוברים) |
| טווח סריקה | 48 שעות אחרונות (7–8 בספטמבר 2026) |

> **הערה לציון:** כדי שאוכל לסכם חדשות מערוצים, צריך להוסיף שמות ערוצים ל-`newsChannels` ב-`household.json`. בלי זה — מקור החדשות היחיד הוא Gmail.

---

## עיקרי היום (מ-Gmail)

### חדשות / תוכן מקצועי

1. **Quartz Founders Report** (zion, 08/09 13:04) — *"Takin' it for a test drive"*. ניוזלטר עסקי/סטארטאפ; לא נפתח גוף המייל (read-only subjects).
2. **GitHub Dependabot** (amzion, 08/09 06:42) — התראות אבטחה שבועיות (1–8 בספטמבר). כדאי לעבור ב-GitHub.
3. **Coursera** (zion, 07/09) — *"Ready: Google Cybersecurity"* — קורס מוכן/זמין.

### תוכן אישי / קהילתי (לא חדשות)

- **מאיה בן שוהם MSL** — ברכת שנה טובה אישית (zion, 08/09).
- **חני רובינשטיין** — תוכן כירולוגיה (zion, 08/09).
- **Tefilot Online** / **מש' גולדמן (Chessed)** — תוכן דתי/קהילתי (zion, 7–8/09).

### פרסומות / שיווק (דילגתי בסיכום מפורט)

- KSP (4 מיילים), הוט מועדון צרכנות, Elementor, CVwizard משרות — רובם פרסומת חג.

### aztodev — תיבת עבודה

אין ניוזלטרים ב-48 שעות. 5 המיילים האחרונים: דוחות EMET/נעה (KN-002, NS-08, סוף-יום), סטטוס מערכת, מצגת Rakza.

### amzion — שוטף

AliExpress: חבילה RS1336250716Y נמסרה (07/09). Google Play: קבלה (08/09). Google: Security alert (08/09) — לבדוק אם זה login חדש/צפוי.

---

## מה חסר

- **אין מקור Telegram/RSS** — `newsChannels` ריק.
- **אין Haaretz/Ynet/TechCrunch/The Verge** ב-48 שעות (חיפוש Gmail).
- **לא נפתחו גופי מיילים** — רק נושאים ושולחים (read-only policy).

---

## המלצה לנועה / ציון

1. אם רוצים תקציר חדשות אמיתי מדי יום — להוסיף ל-`household.json` ערוצי Telegram או RSS (למשל: ynet, calcalist, techcrunch).
2. לבדוק **GitHub Dependabot** ב-amzion ו-**Google Security alert** — האם login צפוי.
3. Quartz Founders Report — אם רלוונטי, לפתוח ידנית ב-zion.

---

*נוצר אוטומטית על ידי רות · AZToDev Household Ops*
