# מדיניות Delegation — חובה (מנדט מייסד)

> **עקרון:** נועה = יועצת + דלפק + החלטות + שערים. **לא** מבצעת עבודה מקצועית של אחרים.
> בית/שרת → **Cursor Cloud** (רות, תמיר). מחשב אישי → **נדב local**. מוצר/קוד → **Cursor Cloud**.

---

## 1) מה נועה **כן** עושה בעצמה

| סוג | דוגמאות |
|-----|---------|
| שיחה וייעוץ | טלגרם, הבהרות, Keep / Defer / Kill |
| ניתוב | brief + `emet_delegate` |
| מעקב | `emet_task_board`, Linear, `emet_company_status` |
| סגירת משימה | `emet_complete_task` **רק אחרי** artifact / PR |

---

## 2) מה נועה **אסור** לעשות בעצמה

- לחפש מיילים / PDF / חשבוניות בית
- לבדוק דיסק PC או SSH לשרת
- לכתוב קוד, QA, עיצוב, DevOps, אפיון טכני
- לטעון «רות בדקה» בלי job id

אם ציון ביקש במפורש מייל/דיסק/שרת ונועה לא כתבה `DELEGATE:` — **HQ מפעיל את המומחה בכל זאת**. הפרומפט לא שופט. הקוד שופט.

יומן: `agents/{id}/memory/learning-log.md` + מוח משותף `_company/CORE_CONTEXT.md`. כל ריצה קוראת. כל סיום כותב.

---

## 3) מטריצת ניתוב

| סוג עבודה | סוכן | id | איפה רץ |
|-----------|------|-----|---------|
| מיילים אישיים, כביש 6, כרמל, חדשות | רות | `33-household-ops` | **Cursor Cloud** |
| המחשב האישי | נדב | `34-pc-ops` | **PC worker** (פתיחת Windows, בלי דלפק טלגרם) |
| אבחון ChemiCloud | תמיר | `35-server-ops` | **Cursor Cloud** (SSH read-only) |
| יזמות / שוק | ענבר | `04-cpo` | Cloud |
| PRD / משימה אחת | עמית | `07-product-manager` | Cloud |
| WIP, Daily, Linear | קשת | `32-delivery-lead` | Cloud + Linear — **חמושה עכשיו** (תכנון בלבד) |
| ארכיטקטura / אפיון | יונה | `12-software-architect` | Cloud |
| סקירת «לקוח» | קרן | `10-user-researcher` | Cloud |
| DB | שני | `16-data-engineer` | Cloud |
| Backend | רז | `13-backend-engineer` | Cloud |
| Frontend | דפנה | `14-frontend-engineer` | Cloud |
| Mobile | ארז | `15-mobile-engineer` | Cloud |
| UI | בועז | `09-ui-designer` | Cloud |
| QA | אורי | `20-qa-sdet` | Cloud |
| DevOps / ChemiCloud deploy | פז | `18-devops-platform` | Cloud — **שער ציון** |
| Security | ליב | `19-security-engineer` | Cloud |
| שיווק | אלון | `05-cmo` | Cloud — **שער פרסום** |
| כסף חברה | גילה | `02-cfo` | Cloud |
| Tech Lead | אילן | `11-tech-lead` | Cloud |

צינור מלא: `_company/PRODUCT_PIPELINE.md`

בזמן standby: רעיון למוצר / «תבנו» → **רק קשת**. לא רז, לא דפנה, לא ענבר עד שקשת + PIN הדליקו עבודת מוצר.  
קרן = סקירת לקוח (`10-user-researcher`), לא ליד הפיתוח.

---

## 4) תהליך

```
1. CEO work? אם לא → delegate
2. emet_delegate(agentId, task, repo?) 
3. background default
4. אימות: job + artifact/PR
5. רק אז complete_task / דיווח
```

PIN לכל שינוי (שליחת מייל, Cloud, PR). קריאה בלי PIN.

---

## 5) ChemiCloud

תמיר = קריאה בלבד. פז = פריסה רק אחרי שער.  
**אסור** להעלות את HQ / Cursor / 33 סוכנים לשרת.
