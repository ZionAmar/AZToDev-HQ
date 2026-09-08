# EMET Power Switch — הדלקה / כיבוי / המשך מנקודה

החברה רצה על המחשב שלך. יש מתג ברור:

| פעולה | איך |
|--------|-----|
| **הדלקה (ON)** | דאבל־קליק `EMET-ON.bat` או `node runtime/emet.mjs on` |
| **כיבוי (OFF)** | דאבל־קליק `EMET-OFF.bat` או `node runtime/emet.mjs off` |
| **סטטוס** | `EMET-STATUS.bat` או `node runtime/emet.mjs status` |
| **דשבורד** | http://localhost:8787 (כש־ON) |

## מה קורה בכיבוי
1. נשמר **checkpoint** מלא ב־`ops/runtime/checkpoint.json`
2. כולל: `state.json`, יוזמות/שלבים, מה סוכנים עשו, קורסור קבצי intake שכבר טופלו, המתנות למייסד
3. סוכנים פעילים מסומנים `paused`
4. התהליך נעצר

## מה קורה בהדלקה
1. נטען ה־checkpoint האחרון
2. המצב חוזר **בדיוק** לנקודת העצירה
3. סוכנים שסומנו paused חוזרים לפעילות שלהם
4. קבצי IDEA/PROBLEM שכבר עובדו **לא** מעובדים מחדש (cursor)
5. הדשבורד עולה שוב

## קבצים חשובים
- `ops/runtime/status.json` — power on/off + pid
- `ops/runtime/checkpoint.json` — נקודת חזרה
- `ops/runtime/journal/` — יומן איאילןם
- `ops/state.json` — תצוגת דשבורד חיה

## חשוב
כבה תמיד דרך `EMET-OFF` / כפתור בדשבורד — לא רק לסגור חלון באמצע — כדי שהcheckpoint יישמר נקי.
(גם Ctrl+C ב־`fg` שומר checkpoint.)
