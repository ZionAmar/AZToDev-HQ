# Specialist session link fix — founder reply

**Run:** https://cursor.com/agents/bc-36ac7cd2-a69f-46a0-999e-3084c24af3e8  
**Date:** 2026-09-10

## Founder ask
Fix Ruth's link — was bare `cursor.com/` instead of real Cloud session URL. From now on always real bc-… link per specialist run.

## Root cause
Noa relayed Ruth's AI news inline and appended a placeholder homepage URL. Background completion path (`formatNoaUpdate`) also omitted the bc- id even when the job had one.

## Fix (HQ runtime)
- `live-runs.mjs`: `isValidCloudSessionUrl`, `specialistSessionLine`, `latestSpecialistSessionUrl`
- `noa-triage.mjs`: `formatNoaUpdate` accepts `cloudAgentId` + includes full preview on done
- `background-delegate.mjs`: passes real `cloudAgentId` on finish + error
- `agent-sessions.mjs` `sanitizeForTelegram`: strips bare cursor.com homepage links
- `runtime-facts.mjs`: guard rule for specialists
- `ops/company-lessons.md`: incident logged

## Ruth AI news — correct link for today's run
https://cursor.com/agents/bc-da1b1d36-44f2-5fbc-b37c-f13a27ea7170

## Telegram reply (founder-facing)

ציון, צודק לגמרי — הקישור שהבאתי לרות היה שגוי.

**מה היה:** במקום הקישור האמיתי לסשן שלה, יצא קישור כללי לדף הבית — זה לא מוביל לעבודה שלה.

**מה תיקנתי:**
• מעכשיו, כשמומחה מסיים — נשלח רק קישור אמיתי לסשן שלו (עם מזהה bc-…)
• אם אין עדיין סשן חי — לא נשלח קישור בכלל, במקום קישור מזויף
• הקישור הכללי נחסם אוטומטית בדesk

**הקישור האמיתי של רות לחדשות AI מהיום:**
https://cursor.com/agents/bc-da1b1d36-44f2-5fbc-b37c-f13a27ea7170

מחכים ל«אשר» שלך על בדיקת הרשאות גיטהאב — כשתרצה.

LEARNING:
- do: Append specialist session link only from background-jobs bc- id via specialistSessionLine; give founder the real bc- URL when correcting a bad link
- dont: Use https://cursor.com/ homepage as specialist attribution — founder will catch it every time
- note: Ruth news bc-da1b1d36; runtime guard + sanitize + formatNoaUpdate fix on branch cursor/fix-specialist-session-link-f3e8
