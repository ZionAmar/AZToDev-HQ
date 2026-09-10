# Founder reply — false «ריצה כפולה» + fake Cloud links

## Telegram (לציון)

ציון, אתה צודק לגמרי.

**מה קרה:** כשביקשת «שוב ועכשיו» על חדשות AI — לא הייתה שום ריצה. הודעת «לא פתחתי ריצה כפולה» הייתה **שגויה**. הבקשה בכלל לא הגיעה לרות (מסנן ישן שחיפש רק «מייל», לא «חדשות»), ואז יצאה תשובה אוטומטית שלא התאימה למצב.

**מה תיקנתי עכשיו:**
• בקשות חדשות / AI / «שוב ועכשיו» — עוברות ישר לרות, בלי הודעת כפילות מזויפת
• אסור יותר לומר «ריצה כפולה» כשאף אחד לא רץ
• קישור למומחה — רק כתובת אמיתית של הסשן (bc-…), לא דף הבית של cursor.com
• כשמומחה מסיים — הקישור האמיתי נשלח אוטומטית מהמערכת

**עכשיו:** רק אני רץ (השיחה הזו).
**קישור לסשן שלי:** https://cursor.com/agents/bc-e3a17d05-44d1-46d0-8d95-f1e488d732b0

**הלאה:** מחכים ל«אשר» שלך על בדיקת הרשאות גיטהאב — כשתרצה. אם תרצה שוב חדשות AI — כתוב «חדשות AI» ורות תרוץ עם קישור אמיתי.

## Evidence

- `runtime/lib/work-intent.mjs` — news/AI keywords → Ruth
- `runtime/lib/agent-memory.mjs` — inferRequiredDelegate news route
- `runtime/lib/front-desk.mjs` — news/retry shortcut (no false duplicate)
- `runtime/lib/agent-links.mjs` — strip fake cursor.com + duplicate boilerplate
- `runtime/lib/background-delegate.mjs` — real bc- link on specialist finish
- `ops/company-lessons.md` — false_duplicate_run_reply

LEARNING:
- do: Verify live WIP before any duplicate/stale claim; news → Ruth with bc- URL only from runtime
- dont: Say «ריצה כפולה» when background-jobs show nobody running
- note: Founder caught third false duplicate reply; code fix + real Noa session link bc-e3a17d05
