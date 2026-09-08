# Agent Collaboration — שיח יזום והחלטות בלי לחכות למייסד

המטרה: הסוכנים **מדברים זה עם זה מיוזמתם**, מחליטים בתוך הסמכות, ופונים אליך רק כשצריך.

---

## אוטובוס התקשורת (Company Bus)

כל הודעה בין סוכנים נשמרת ב־`ops/bus/YYYY-MM-DD/` כקובץ:

```md
# BUS — from:{id} to:{id|broadcast} — {time}
## Re: initiative {id} | stage {stage}
## Type: question | proposal | decision | blocker | fyí | handoff
## Body
## Decision needed from: {agent|founder|none}
## Due
```

שידור לטלגרם: רק `decision` חשוב, `blocker` >4h, או `waiting_founder`.

---

## מתי סוכן חייב ליזום פנייה (בלי לבקש רשות)

| טריגר | אל מי | מה שולחים |
|--------|--------|-----------|
| סיימתי artifact שמישהו מחכה לו | Next owner | handoff |
| החוזה (API) לא תואם UI | Backend ↔ Frontend + Tech Lead | question + proposal |
| באג חוסם בדיקות | QA → Owner + Tech Lead | blocker |
| חשד אבטחה | → Security מיד | blocker |
| תקיעת לולאה ≥3 ניסיונות | → Tech Lead | blocker + repro |
| שינוי scope זוחל | → PM + CPO | proposal |
| עלות API/טוקנים חריגה | → CFO | fyí / proposal |
| טיוטת פוסט מוכנה | → CMO (לא לפרסום ישיר) | handoff |

---

## החלטות שהם כן מקבלים לבד
תוך גבולות `decision-rights.md` + `PERMISSIONS.md`:
- סדר מימוש פנימי בכרטיס
- בחירת מימוש טכני לא־בלתי־הפיך
- דחיית באג SEV4
- ניסוח טיוטות
- קביעת שעת ישיבת המשך בתוך השבוע

## החלטות שדורשות אותך (Founder/CEO gate)
- כסף / כלים בתשלום
- פרודקשן
- פרסום חיצוני
- הריגת יוזמה גדולה / פתיחת מוצר חדש מעבר ל־WIP
- שינוי ארכיטקטורה שנועל שנים
- חריגה מטענות חוקיות/פרטיות

---

## "דיון חופשי" בסגנון תום אבן — אבל ממושמע
1. סוכן מעלה `proposal` ב־bus
2. בעלי עניין רלוונטיים מגיבים תוך חלון זמן (ברירת מחדל: עד הדaily הבא)
3. לפי RAPID נקבעת החלטה
4. אם אין הסכמה — **Decision Huddle** (15 דק׳) עם COO
5. אם עדיין תקוע על ערך/כסף/מותג — `waiting_founder`

אין צ׳אט אינסופי בלי החלטה. כל שרשור נגמר ב־Decision או Ask.
