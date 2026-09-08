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

---

## 3) מטריצת ניתוב

| סוג עבודה | סוכן | id | איפה רץ |
|-----------|------|-----|---------|
| מיילים אישיים, כביש 6, כרמל, חדשות | רות | `33-household-ops` | **Cursor Cloud** |
| המחשב האישי | נדב | `34-pc-ops` | **HQ local** (PC דולק) |
| אבחון ChemiCloud | תמיר | `35-server-ops` | **Cursor Cloud** (SSH read-only) |
| יזמות / שוק | ענבר | `04-cpo` | Cloud |
| PRD / משימה אחת | עמית | `07-product-manager` | Cloud |
| WIP, Daily, Linear | קשת | `32-delivery-lead` | Cloud + Linear |
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

תמיר = SSH **קריאה בלבד** מ-**Cursor Cloud** (לא רץ על השרver).  
פז = deploy ללקוחות **רק אחרי שער פרוד**.  
**Kill:** HQ / Telegram relay / Cursor / Docker / 33 סוכנים על ChemiCloud — `chemiCloudHqDeploy: false` ב-`factory.json`.
