# External Task Board — Linear (ראייה מהטלפון)

## למה Linear
- אפליקציית טלפון מצוינת
- Daily / עדיפויות / סטטוסים בלי להציף טלגרם
- API לסוכנים לוקאליים לעדכן משימות

## מה מסתנכרן
| מקומי | Linear |
|--------|--------|
| יוזמה / stage | Project + status |
| Day Plan | Cycle / due today issues |
| Daily standup תוצאות | Comment על initiative |
| Blockers | Issue priority + label `blocked` |
| waiting_founder | Label `waiting-founder` + נורה שולחת טלגרם |

## מי כותב ל־Linear
- עמית (PM) — יוצר/מתעדף issues
- קשת (Delivery) — WIP / blocked / daily
- נורה — רק שערים / העברות אליך
- אילן — issues הנדסיים

שאר הסוכנים: עובדים לוקאלית; מקבלים משימה מ־Linear דרך עמית/אילן (לא כולם עם טוקן).

## Labels חובה
`intake` `discover` `shape` `architect` `plan` `build` `harden` `stage` `launch` `learn` `grow`  
`blocked` `waiting-founder` `sev1` `sev2`

## סודות
- `LINEAR_API_KEY` — רק ל־PM/Delivery/TechLead runtime (לא לכל סוכן)
- Team/Workspace ID

## חלופה
Notion Database / Trello — אם תעדיף; ברירת המחדל בחברה = Linear.
