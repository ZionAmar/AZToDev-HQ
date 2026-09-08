# AZToDev Factory — איך החברה עובדת עכשיו

> **מקור האמת.** אם מסמך ישן סותר את זה — המסמך הזה מנצח.  
> מותג: **AZToDev** · [aztodev.com](https://aztodev.com)  
> דלפק: **נועה** (לא נורה).

## במשפט אחד

ציון מדבר בטלגרם עם **נועה**. היא יועצת + מנתבת. היא **לא** עושה עבודת מומחה.  
מומחים רצים **בשרתי Cursor** (Cloud) על ריפו GitHub פרטי — לא 33 חלונות על המחשב, לא Cursor על ChemiCloud.  
דלפק טלגרם דק על ChemiCloud (`aztodev-desk`). המחשב האישי: **נדב** נפתח עם Windows (בלי סקר טלגרם כפול).

---

## שלוש שכבות

| שכבה | איפה רץ | מה זה | כש-PC כבוי |
|------|---------|--------|-------------|
| **דלפק טלגרם** | ChemiCloud `aztodev-desk` בלבד | טלגרם, PIN, תור לנדב | **כן** |
| **נועה** | **Cursor Cloud** | ייעוץ, ניתוב, שערים | **כן** |
| **מומחים (מוצר)** | Cursor Cloud + GitHub | קוד, PR, QA | כן |
| **רות / תמיר** | Cursor Cloud (repo HQ) | מיילים, SSH read-only | **כן** |
| **נדב** | PC worker בפתיחת Windows | דיסק, קבצים | **לא** — PC כבוי |

**ChemiCloud = אתרים חיים של לקוחות.** אסור להעלות לשם את החברה, Cursor, Docker, או 33 סוכנים.

---

## עכשיו (הקמה)

- `ops/config/factory.json` → `"productWorkEnabled": false`, `"chemiCloudHqDeploy": false`
- אין PR למוצר, אין deploy, אין נגיעה באתרים חיים
- טלגרם + בית + סטטוס PC/שרת (קריאה) — **כן**
- לוח נייד: Linear [EMET-65](https://linear.app/my-company1460/issue/EMET-65)

---

## זרימה

```
ציון (טלפון / קול / טקסט)
    → נועה: שיחה, ייעוץ, Keep / Defer / Kill
         ├── בית / מיילים / חדשות     → רות  (33-household-ops)
         ├── המחשב האישי              → נדב  (34-pc-ops)     [PC דולק]
         ├── שרת ChemiCloud (קריאה)   → תמיר (35-server-ops)
         └── מוצר / קוד / אפיון
                → קשת (WIP=1, Linear)
                → צינור: יזם → אישור ציון → ארכיטקט → לקוח → DB → באק → פרונט → QA
                → כל שלב משמעותי = סיסמה (PIN) + אישור ציון
                → Cloud Agent על ריפו פרטי → PR
                → deploy לפרוד = שער נפרד (לא עכשיו)
```

צינור מלא: [`PRODUCT_PIPELINE.md`](./PRODUCT_PIPELINE.md)

---

## סיסמה (PIN)

כל פעולה **שמשנה** משהו דורשת `FOUNDER_ACTION_PIN` בטלגרם (חלון 10 דקות).

| בלי PIN | עם PIN |
|---------|--------|
| סטטוס, שיחה, ייעוץ | שליחת מייל |
| קריאת מייל / PDF | Cloud / PR / כתיבת קוד |
| PC / שרת קריאה | deploy, כסף, פרסום, מוצר חדש |
| Linear לצפייה | מחיקת דאטה, סודות |

נועה **לא** מנחשת את הסיסמה ולא מדפיסה אותה.

---

## שערים (רק ציון)

פרוד, כסף, פרסום לציבור, מוצר חדש, מחיר, סודות, מחיקת דאטה, חריגת אבטחה, העלאת HQ ל-ChemiCloud.

---

## מסמכים שמחייבים

| מסמך | תפקיד |
|------|--------|
| [`ROSTER.md`](./ROSTER.md) | מי בליבה, מי ספסל |
| [`PRODUCT_PIPELINE.md`](./PRODUCT_PIPELINE.md) | איך בונים מוצר |
| [`STACK.md`](./STACK.md) | כלים |
| [`PERMISSIONS.md`](./PERMISSIONS.md) | מה באמת מחובר |
| [`DELEGATION_POLICY.md`](./DELEGATION_POLICY.md) | נועה מנתבת, לא מבצעת |
| [`FOUNDER.md`](./FOUNDER.md) | מי ציון |
| [`CORE_CONTEXT.md`](./CORE_CONTEXT.md) | מוח משותף — כל סוכן חי קורא לפני עבודה |
| `ops/config/factory.json` | מצב + WIP |
| [`../AGENTS.md`](../AGENTS.md) | הוראות לכל סוכן Cursor |

## בית הישויות (לא שיחת Cursor)

הריצה = Cursor Cloud (או נדב על ה-PC).  
הבית = תיקייה ב-GitHub HQ: `agents/{id}/memory/learning-log.md`.

כל משימה: HQ מזריק את היומן לפרומפט → בסוף נכתב לקח לקובץ. בלי זה אין ישות, יש כובע.  
נועה בלי `DELEGATE:` למשימת מייל/דיסק/שרת — HQ מפעיל את המומחה בכל זאת. «רות בדקה» בלי האצלה נחתך.
