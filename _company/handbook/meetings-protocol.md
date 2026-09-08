# Meetings Protocol — ישיבות אמיתיות, סדר דיבור, החלטות

הסוכנים **חייבים** לקיים ישיבות (לא רק להעביר קבצים).
כל ישיבה = קובץ ב־`ops/meetings/` + סיכום בדשבורד + (אופציונלי) שיקוף לטלגרם.

---

## סוגי ישיבות

| ישיבה | מתי | חובה משתתפים | Lead / Facilitator | אורך יעד |
|--------|------|----------------|---------------------|----------|
| **Intake** | רעיון/בעיה חדשה גדולה | CEO, CPO, PM, CTO | CEO | 20–30m |
| **Discovery Review** | סוף discover | CPO, Researcher, PM, UX | CPO | 25m |
| **Shape Review** | סוף shape | CPO, PM, UX, UI, Tech Lead | CPO | 30m |
| **Architecture Gate** | סוף architect | CTO, Architect, Security, Tech Lead, PM | CTO | 30m |
| **Planning** | לפני build | PM, Tech Lead, Delivery, Backend, Frontend | PM | 30m |
| **Daily Standup** | כל יום עבודה | PM, Tech Lead, כל מי עם משימה Active | **Delivery Lead (קשת)** | 10–12m |
| **Mid-build Sync** | באמצע build | Tech Lead + owners | Tech Lead | 15m |
| **Hardening Review** | לפני stage | QA, Security, Tech Lead, PM | QA | 25m |
| **Launch Gate** | לפני prod | CEO, CTO, DevOps, CMO, Support | CEO | 20m |
| **Retro / Learn** | אחרי השקה או כשל | CHRO, COO, leads הרלוונטיים | CHRO | 30m |
| **War-Room** | SEV1/2 | לפי intake-rules | CTO או COO | עד פתרון |
| **Decision Huddle** | התנגשות / חוסר בהירות | RAPID parties | COO | 15m |

---

## מבנה חובה לכל ישיבה (תבנית אחת)

```md
# Meeting — {type} — {initiative-id} — {date}
## Goal of meeting
## Attendees
## Agenda (timed)
## Discussion notes (by speaker order)
## Decisions (explicit)
## Action items (owner + due + packet id)
## Open questions / waits for founder?
## Next meeting
## Stage change? (from → to)
```

בלי `Decisions` + `Action items` — הישיבה **לא נסגרה**.

---

## Daily Standup — סדר דיבור קבוע
Facilitator: **קשת (Delivery Lead)**  
סדר:
1. קשת — WIP / חסימות ישנות מ־24ש
2. עמית (PM) — יעד היום ברמת היוזמות
3. אילן (Tech Lead) — סטטוס build
4. כל Owner פעיל — Done yesterday / Today / Blocker (משפט אחד כל אחד)
5. נורה נכנסת **רק אם** יש `waiting_founder` או SEV1

פלט: `ops/daily/YYYY-MM-DD.md` + עדכון `todayPlan` ב־state.

---

## שיחה יזומה בין ישיבות (לא מחכים לישיבה)
ראה `agent-collaboration.md`.  
ישיבה היא לסגירת שלב / תיאום / החלטה קשה — לא לכל הודעה.
