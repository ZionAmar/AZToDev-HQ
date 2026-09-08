# Decision memo — רות + תמיר: מקומי vs ענן

**תאריך:** 2026-09-08  
**מחבר:** נועה (CEO)  
**שער:** ציון — APPROVE לפני כל שינוי

---

## Context

היום רות (`33-household-ops`) ותמיר (`35-server-ops`) רצים דרך **HQ דק** על המחשב האישי — לא כי העבודה שלהם דורשת PC, אלא כי:

- סודות Gmail (3 חשבונות) + SSH ChemiCloud יושבים ב-`.env` **מקומי**
- Cursor Cloud **לא** רואה את ה-`.env` המקומי
- ChemiCloud = אתרי לקוחות בלבד; `chemiCloudHqDeploy: false` — אסור להעלות HQ לשם בלי שער
- מצב הקמה (`standby`) — פחות moving parts

**מי באמת חייב PC:** נדב (`34-pc-ops`) + דלפק טלגרם (נועה) — כל עוד HQ על המחשב.

ציון שאל: למה לא בענן? התשובה: **אפשר** — רק צריך להחליט איפה יושבים הסודות וה-HQ.

---

## Options

### A) להשאיר כמו היום (status quo)

| יתרון | חיסרון |
|-------|--------|
| כבר עובד; אין migration | PC חייב להיות דולק לבית + שרת |
| סודות לא עוזבים את המחשב | רות/תמיר «תלויים» ב-HQ מקומי |
| אפס עלות / אפס שינוי config | כש-PC כבוי — אין מיילים/SSH (רק Cloud מוצר) |

**מתאים אם:** אתה מריץ PC רוב היום בכל מקרה לטלגרם.

---

### B) HQ דק על ChemiCloud (רות + תמיר + דלפק?)

העברת `hq/index.mjs` (+ `.env` מוצפן) לשרת ChemiCloud. PC = אופציונלי; טלגרם 24/7.

| יתרון | חיסרון |
|-------|--------|
| בית + שרת + טלגרם בלי PC דולק | **שער:** `chemiCloud_hq_deploy` — החלטה מודעת |
| סודות במקום אחד (שרת) | ChemiCloud = shared host עם אתרי לקוחות — attack surface |
| רות/תמיר «בענן» במובן המילולי | צריך hardening: firewall, secrets rotation, monitoring |
| | **נדב** (PC) עדיין מקומי — נשאר split |

**מתאים אם:** רוצה דלפק 24/7 ומוכן לאשר HQ על ChemiCloud עם ליב (security) לפני.

---

### C) סודות ל-Cloud; רק נדב + דלפק על PC

Gmail OAuth / app passwords + SSH key → **Cursor Cloud secrets** (או vault חיצוני). רות/תמיר רצים כ-Cursor Cloud agents — לא דרך HQ מקומי.

| יתרון | חיסרון |
|-------|--------|
| PC לא חייב לרות/תמיר | migration של 3 Gmail + SSH — עבודה חד-פעמית |
| עקבי עם מודל מומחי המוצר (Cloud) | Cloud צריך PIN לפעולות mutating בכל מקרה |
| ChemiCloud נשאר אתרי לקוחות בלבד | שליחת מייל / SSH write עדיין שערים |
| | חדשות Telegram — צריך לבדוק אם Cloud יכול לקרוא `household.json` + channels |

**מתאים אם:** רוצה ארכיטקטורה «Cloud-first» גם לבית/שרת, בלי לגעת ב-ChemiCloud.

---

### D) Hybrid (מומלץ לשלב מעבר)

**שלב 1 (מהיר):** תמיר → Cloud עם SSH key ב-secrets (קריאה בלבד — סיכון נמוך).  
**שלב 2:** רות → Cloud אחרי בדיקת IMAP OAuth ל-3 חשבונות.  
**נשאר מקומי:** נדב + HQ דק לטלגרם/PIN בלבד.

| יתרון | חיסרון |
|-------|--------|
| מפחית תלות PC בהדרגה | שני migrations, לא big bang |
| תמיר קל יותר (SSH read-only) | רות מורכבת יותר (3 Gmail + PDFs מקומיים?) |
| ChemiCloud HQ נשאר סגור | PDFs ביתיים — אולי נשארים local או S3 |

---

## Recommendation

**D — Hybrid, שלב אחר שלב.**

1. **עכשיו (standby):** status quo — אל תזיז בלי סיבה.
2. **כשתצא מ-standby / תרצה PC פחות דולק:** תמיר ל-Cloud קודם (SSH read-only = wedge קטן).
3. **אחר כך:** רות ל-Cloud — רק אחרי שמיפינו איפה PDFים וחדשות Telegram גרים.
4. **ChemiCloud HQ (B):** רק אם תרצה דלפק 24/7 **וגם** לא רוצה Cursor Cloud לסודות אישיים — ואז עם ליב לפני.

**לא ממליצה:** big bang (B+C ביחד) — יותר מדי variables בהקמה.

---

## Risks

| סיכון | mitigation |
|-------|------------|
| דליפת סודות ב-GitHub | secrets ב-Cursor/GitHub Secrets — **אף פעם** ב-repo |
| SSH key על Cloud | read-only user; rotate; audit log |
| Gmail OAuth revoke | app passwords נפרדים; monitor |
| ChemiCloud HQ = blast radius | firewall, isolate user, no Docker/33 agents |
| PC כבוי = אין טלגרם | B או Cloud Agent mobile — שער נפרד |

---

## Ask / Decide by

**CHOOSE** — איזו כיוון?

| | |
|---|---|
| **A** | משאירים כמו היום |
| **D1** | מכינים migration תמיר → Cloud (קריאה בלבד) |
| **D2** | D1 + רות → Cloud (אחרי מיפוי PDF/חדשות) |
| **B** | HQ מלא על ChemiCloud (דורש security review + שער) |

**Decide by:** כשתצא מ-standby או כש-PC-off יהיה כאב אמיתי — לא דחוף עכשיו.

---

## Decision (2026-09-08)

**ציון בחר:** Cloud-first **בלי ChemiCloud HQ**.

| סוכן | runtime |
|------|---------|
| נועה (00-ceo) | Cursor Cloud + HQ relay (Telegram/PIN) |
| רות (33) | Cursor Cloud |
| תמיר (35) | Cursor Cloud |
| נדב (34) | PC local |

Implementation: `runtime/lib/specialist-runtime.mjs`, `hq/lib/cloud-work.mjs`, `hq/lib/cloud-ceo.mjs`.  
Setup steps: `ops/setup/cloud-ops-migration.md`.

**Status:** IMPLEMENTED (2026-09-08) — `factory.json` `chemiCloudHqDeploy: false`, `desk: cursor-cloud`, docs aligned.

---

*Evidence path:* `ops/decisions/2026-09-08-hq-cloud-split.md`
