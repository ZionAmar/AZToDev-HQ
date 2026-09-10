# Learning log — רות (`33-household-ops`)

HQ appends after each job. Read before touching mail.

## Active patterns
- Three Gmail accounts: aztodev / amzion / zion. Search, don’t invent subjects.
- House invoices he cares about: כביש 6, מנהרות הכרמל, PDFs.
- Evidence = tool JSON or a file under `ops/`. Never “בדקתי” with no rows.
- Send mail only after PIN + explicit שלחי.

## Never again
- You are not CEO. You do not SSH ChemiCloud. You do not write product code.
- Do not paste app passwords. Do not commit `.env`.

## Iteration log
### 2026-09-08
- Folder existed; memory was empty. This log is the start of a real desk.
### 2026-09-09
- task: Nadav asked you: Send the inventory management presentation PPTX as email attachment to ציון (founder at FOUNDER_EMAIL). Attachment (exact path on founder PC): C:\Users\amazi\Desktop\my_company\ops\outbox-founder\2026-09
- do: לבדוק הימצאות קבצים מצורפים בריפו בענן לפני ניסיון שליחה, ולהעביר לתור של 34-pc-ops כאשר הקובץ שמור בלעדית על דיסק המחשב האישי.
- dont: לא לשאול את המייסד האם המחשב דולק כשה-heartbeat מצביע על offline; להכניס לתור של נדב ולדווח שהעבודה ממתינה בתור.
- note: משימת שליחת המצגת נרשמה לתור המחשב (job-1788992285942-l5zfw) עבור נדב לביצוע עם עליית הווינדוס.
### 2026-09-09
- task: Noa asked you: תסכמי לי בבקשה את חדשות היום
- do: לבדוק את ops/config/household.json עבור ערוצים מוגדרים, לקרוא נתונים אמיתיים מ-3 חשבונות Gmail המחוברים (aztodev, amzion, zion), לדווח בבירור שרשימת ערוצי החדשות ריקה ב-household.json, ולספק סיכום מסודר של כל העדכונים וההודעות שהגיעו היום לחשבונות.
- dont: לא להמציא חדשות או מבזקים שלא הגיעו בערוצים המוגדרים או במייל; לא להחזיר רק נתיב קובץ אלא תוצר מפורט בעברית לציון ונועה.
- note: בוצעה בדיקה של household.json (newsChannels ריק) ונסרקו 3 חשבונות המייל ל-09/09/2026. הופק דוח מלא ונשמר ב-outbox.
### 2026-09-10
- task: Noa asked you: תנסי למצוא מה הייתה התוצאה אתמול, אמרתי לך למפות את הריפוזיטורי שלי בגיטאב תנסי למצוא מה הייתה התוצאה ולשלוח לי אותה שוב למייל בצורה מסודרת ונעימה ותמיד שאת שולחת לי למייל דברים בעברית שיהיה מיושר לימין
- do: לאתר תוצרי אמת מאומתים מפעילות אתמול (18 ריפואים בסקירת קשת), לעצב מייל HTML נקי ומקצועי עם יישור לימין מלא (dir="rtl") וטבלת סיווג מלאה, לשלוח למייסד ולאמת Message-ID וסטטוס תעבורה, ולתעד באאוטבוקס.
- dont: לא לשלוח מייל ללא כיווניות RTL מפורשת בטקסט ו-HTML; לא לטעון לשליחה ללא Message-ID מאומת; לא למחוק או לארכב ריפואים ללא אישור ו-PIN מהמייסד.
- note: אותר דוח המיפוי המלא של 18 הריפואים מאתמול, עוצב ונשלח בהצלחה למייל המייסד בעיצוב RTL מוקפד עם Message-ID מאומת, ועדות מלאה נשמרה באאוטבוקס.

