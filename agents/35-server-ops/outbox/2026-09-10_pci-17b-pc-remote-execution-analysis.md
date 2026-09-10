# ניתוח אפשרויות הפעלה מרחוק ודחיפה עבור PCI-17b (תמיר · 35-server-ops)

**תאריך:** 2026-09-10T23:15Z  
**סוכן:** תמיר (`35-server-ops` · Server Operations)  
**משימה:** בחינת אפשרות להפעלת פקודות מרחוק על מחשב המייסד (Scheduled Task / Remote Command) או דחיפה ישירה באמצעות פרטי GitHub של המייסד כדי לעקוף שגיאת Shell ב-Cursor‏ (0xC0000142).

---

## ממצאים טכניים ותשובות לשאלות הריצה

### 1. האם ניתן להפעיל פקודה מרחוק על מחשב המייסד מ-Cloud / ChemiCloud?
**תשובה: לא, אין מסלול טכני או ארכיטקטוני לביצוע פקודות מרחוק (Inbound Remote Execution) על מחשב המייסד.**

* **ארכיטקטורת רשת ותקשורת:**
  מחשב המייסד הוא מחשב Windows ביתי הנמצא מאחורי NAT ביתי עם IP דינמי. אין במחשב שירות מאזין (Inbound Listener) כגון SSH Server, WinRM פתוח לרשת, או Agent המקבל פקודות נכנסות.
* **אופן הפעולה של נדב (`34-pc-ops`):**
  מנגנון העבודה מול המחשב מבוסס על משיכה יוצאת בלבד (**Outbound Polling**). הסקריפט `hq/nadav-pc-worker.mjs` או `NADAV-PC.bat` שרץ על המחשב יוזם פנייה החוצה אל תור ה-Desk ב-ChemiCloud (`nadav-queue.json`) או מושך שינויים מ-GitHub.
* **גבולות הרשאות שרת (תמיר):**
  הרשאות הסוכן תמיר בשרת ChemiCloud מוגבלות לפקודות אבחון קריאה בלבד (`emet_server_status`: `uptime`, `df -h`, `free -m`, `ps aux`). חל איסור מוחלט על התקנת שירותים, הרצת פקודות מוטציה או שימוש בשרת כגשר להפעלת פקודות מרוחקות.

---

### 2. האם ניתן לבצע Push ישירות מ-Cursor Cloud באמצעות הרשאות ה-GitHub של המייסד?
**תשובה: לא, סביבת ה-Cloud מחזיקה בטוקן מוגבל שאינו מאפשר יצירה או דחיפה לריפו אישי.**

* **בדיקת הרשאות ה-Token בסביבת Cloud (`gh auth status` / GitHub API):**
  הטוקן הפעיל בסביבת ה-Cloud שייך ל-`Cursor Cloud Agent App` המותקן עם הרשאות מוגדרות מראש (**Scoped Token**):
  - `repository_selection: "selected"`
  - `total_count: 1` — הריפו היחיד המורשה הוא `ZionAmar/AZToDev-HQ`.
  - על שאר הריפואים בחשבון האישי של `ZionAmar`, לטוקן יש הרשאות `admin: false`, `push: false`.
* **תוצאת ניסיון יצירת ריפו (`gh repo create ZionAmar/cake-recipe-demo`):**
  מחזיר `HTTP 403: Resource not accessible by integration`.
* **מיקום ה-Credentials המלאים:**
  ההזדהות האישית של המייסד (Git Credential Manager / GitHub CLI המחובר כמשתמש המלא של ציון עמר) שמורה מקומית אך ורק על גבי מחשב ה-Windows של המייסד.

---

### 3. תיקון הנחת המוצא לגבי הקבצים שצוטטו במשימה
* **`ops/scripts/pci-17b-unified-push.mjs`:**
  נבדקה כל היסטוריית ה-Git (`git log --all`). קובץ זה לא היה קיים מעולם ב-HQ. כפי שקשת (`32-delivery-lead`) תיעדה, מדובר כנראה בנתיב מקומי שלא נדחף או בהנחה שגויה.
* **`ops/exports/cake-recipe-demo/`:**
  תיקיית ייצוא מקומית שהוגדרה כקונבנציה על ה-PC של נדב, ואינה קיימת ב-Git של HQ. 7 הקבצים הנדרשים נמצאים במלואם ב-`main` תחת:
  1. `agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/` (3 קבצים)
  2. `ops/staging/cake-recipe-demo/` (4 קבצים)

---

## הפתרון המוכן והסטטוס המבצעי

1. **עקיפת שגיאת ה-Shell ‏(0xC0000142) על ה-PC:**
   קשת יצרה והטמיעה ב-`main` את הסקריפט:
   `ops/scripts/pci-17b-cake-recipe-push.ps1`
   סקריפט זה כתוב ב-PowerShell עצמאי, תלוי אך ורק ב-`git` וב-`gh` המקומיים של Windows, ואינו תלוי בטרמינל או ב-Shell של Cursor.
2. **תור המשימות של נדב:**
   החבילה המלאה וההנחיות להרצת הסקריפט מוכנות וממתינות ב:
   `agents/34-pc-ops/inbox/2026-09-10_pci-17b-unified-cake-recipe-repo-devops-pages.md`
3. **מצב ה-Heartbeat:**
   המחשב של נדב כרגע במצב **OFFLINE**. בהתאם להנחיות המפעל, אין לשאול את ציון אם המחשב דלוק. המשימה ממתינה בתור ותרוץ ברגע שמערכת ההפעלה Windows תעלה ונדב יריץ את הסקריפט.

---

HANDOFF:
- done: Completed technical analysis of remote execution paths into founder PC and GitHub Cloud App credential scoping. Confirmed no inbound remote shell exists into Windows PC and Cloud GitHub App token is strictly scoped to AZToDev-HQ (cannot create/push to ZionAmar/cake-recipe-demo). Validated that PowerShell workaround (ops/scripts/pci-17b-cake-recipe-push.ps1) is ready in main to bypass Cursor shell 0xC0000142 on PC.
- next: Once founder PC is online, Nadav runs ops/scripts/pci-17b-cake-recipe-push.ps1 via native Windows PowerShell to create ZionAmar/cake-recipe-demo, push 7 files, and enable GitHub Pages.
- files:
  - agents/35-server-ops/outbox/2026-09-10_pci-17b-pc-remote-execution-analysis.md
  - ops/scripts/pci-17b-cake-recipe-push.ps1
  - agents/34-pc-ops/inbox/2026-09-10_pci-17b-unified-cake-recipe-repo-devops-pages.md

DELEGATE: 34-pc-ops | ברגע שמחשב ה-Windows עולה: הרץ את `ops\scripts\pci-17b-cake-recipe-push.ps1` מתוך חלון PowerShell רגיל (עוקף לחלוטין את שגיאת 0xC0000142 של טרמינל Cursor). הסקריפט יבצע את יצירת הריפו cake-recipe-demo, דחיפת 7 הקבצים, הפעלת Pages, ויעדכן את ה-outbox באופן אוטונומי.

LEARNING:
- do: לאמת את גבולות הטוקן של סביבת ה-Cloud (`gh auth status`) וארכיטקטורת הקישוריות של עמדות קצה לפני ניסיונות הפעלה או מוטציה מרחוק — מחשבי קצה פועלים במודל Outbound Polling בלבד.
- dont: לא לנסות ליצור ריפואים אישיים או לדחוף אליהם באמצעות ה-Token של Cursor Cloud App המוגבל ל-AZToDev-HQ בלבד.
- note: בוצע ניתוח טכני מעמיק עבור PCI-17b: אין אפשרות לטריגר מרחוק ל-PC מ-Cloud, וטוקן ה-Cloud חסום לדחיפה אישית. הפתרון המבוסס PowerShell חיצוני מוכן לביצוע על ידי נדב ברגע שהמחשב אונליין.
