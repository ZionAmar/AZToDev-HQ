# Founder clarified repo — public + Docker plan (waiting אשר)

**Date:** 2026-09-10T20:34Z  
**Founder:** ציון עמר  
**Clarifier:** https://zionamar.github.io/aztodev-company-system/ → repo **aztodev-company-system**

## Answer (Telegram — Hebrew)

ציון, הבנתי — הפרויקט הוא **aztodev-company-system** (מהקישור ששלחת).

**מה רואים עכשיו:** הלינק עדיין לא פותח (404). כנראה שהריפו עדיין פרטי, או שהקוד עדיין לא עלה — נדב יאמת על המחשב.

**מה כבר מוכן:** דף מתכון העוגה (עברית מימין לשמאל) מוכן בענן ומחכה להעלאה.

**התוכנית — אחרי «אשר»:**

• **נדב** (המחשב דולק) — יוצר/מאמת את הריפו, מעלה את דף העוגה, **הופך לציבורי**
• **פז** (ענן) — מארוז בדוקר ומפעיל תצוגה בדפדפן
• **אורי** — בודק, ואז תקבל לינק חי

שינוי לציבורי דורש סיסמה — אם עדיין פתוח, נשתמש בה; אם לא — תשלח שוב.

**מחכה ל:** «אשר» או «קדימה» — ואז מריצים.

## Evidence

- Prior: founder «תהפכו את זה לפאבליק ואז תפעילו»; Noa asked which repo; founder sent Pages URL
- Live check this run: `zionamar.github.io/aztodev-company-system/` → HTTP 404; `gh repo view ZionAmar/aztodev-company-system` → not found from Cloud token (may exist only on PC / private)
- Page bundle ready on main: `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/`
- PC heartbeat: ONLINE (A_Z · 2026-09-10T20:33:12Z)
- Repo name updated in PCI-14 inbox from `cake-recipe-demo` → `aztodev-company-system` per founder link

HANDOFF:
- done: Identified repo from founder link; wrote public+Docker plan; updated PCI-14 target repo; honest 404 status
- next: On founder «אשר» — DELEGATE 34-pc-ops PCI-14 (upload bundle + flip public); then 18-devops-platform Docker+live link; then 20-qa-sdet
- files: agents/34-pc-ops/inbox/2026-09-10_pci-14-cake-recipe-repo-create.md, agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/

LEARNING:
- do: When founder sends a github.io URL, extract repo name and confirm plan in Hebrew before delegating; verify link live with curl/gh
- dont: Assume cake-recipe-demo name if founder points to a different Pages URL; start specialists before «אשר» on visibility+Docker plan
- note: Founder clarified aztodev-company-system; Pages 404; plan written, waiting אשר
