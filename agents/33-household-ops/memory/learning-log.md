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
- task: Noa asked you: שלחי לי מייל מעוצב יפה עם כל מה שעשינו אתמול בחברה שלנו
- do: להצליב מקורות אמת מכלל יומני הפעילות, הגיט וה-outbox כדי להפיק סיכום יום מדויק ומעוצב ב-HTML תקני, לשלוח למייסד מייל עם Message-ID מאומת (ללא צורך ב-PIN לשליחה עצמית) ולשמור עדות מלאה באאוטבוקס.
- dont: לא לשלוח מייל ללא אימות תעבורת SMTP או ללא תיעוד Message-ID אמיתי; לא לטעון לביצוע ללא הצגת ראיה; לא להסתפק בהחזרת נתיב קובץ בלבד.
- note: הופק ונשלח בהצלחה מייל סיכום מעוצב ומפורט של פעילות 09/09/2026 לציון (Message-ID: <e5258549-c20c-1a1a-0f1c-4fc0e3b8249b@gmail.com>) עם עדות מלאה ב-outbox.


