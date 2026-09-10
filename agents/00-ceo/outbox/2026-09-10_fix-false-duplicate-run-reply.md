# Fix false «ריצה כפולה» / news routing — 2026-09-10

## Founder ask (Telegram)
«פתרת את כל הבעיות, שלא יקרה מצב שתגידו לי עוד פעם יש ריצה כפולה… בדקת מה הייתה הבעיה וסידרת את זה»

## Root cause (verified in code)
1. **News never routed to Ruth.** `filterJobsForFounderAsk` only allowed `33-household-ops` when `isExplicitMailAsk` matched. «תבדקי חדשות… AI» did not — delegation was **silently dropped**.
2. **Noa then guessed.** Without a live run in LIVE FLOW, prior turns said «יש תוצאה טרייה» / «ריצה כפולה» — theater, not runtime truth.
3. **«שוב ועכשיו» had no desk path.** Queue dedupe + missing force-retry meant the second ask also failed quietly.

## Fix (PR branch `cursor/fix-news-routing-contradiction-d350`)
| File | Change |
|------|--------|
| `runtime/lib/work-intent.mjs` | `isExplicitNewsAsk`, `isExplicitHouseholdAsk`, `isForceRetryAsk`, `lastFounderActionFromThread` |
| `runtime/lib/agent-memory.mjs` | `inferRequiredDelegate` routes news/AI to Ruth |
| `runtime/lib/work-queue.mjs` | `forceRetry` bypasses dedupe |
| `runtime/lib/front-desk.mjs` | Desk handles «שוב ועכשיו» → re-delegate from prior founder line |
| `runtime/lib/models.mjs` | Force-retry → execute lane |
| `runtime/lib/runtime-facts.mjs` | Prompt: never claim duplicate without LIVE FLOW proof |
| `ops/company-lessons.md` | `news_routing_false_duplicate_run` |

## Telegram reply (founder-facing)
ציון, צודק — ותיקנתי.

**מה היה:** ביקשת חדשות על בינה מלאכותית. המערכת לא העבירה את זה לרות (מסנן ישן — רק «מייל», לא «חדשות»). בלי ריצה אמיתית, יצאו הודעות סותרות — «יש תוצאה» כשאף אחד לא רץ.

**מה תיקנתי:**
• בקשות חדשות/AI עוברות לרות כמו שצריך
• «שוב ועכשיו» מפעיל מחדש את הבקשה האחרונה — בלי לטעון «כפול»
• אסור יותר לומר «ריצה כפולה» בלי לראות שמישהו באמת רץ

**עכשיו:** אף אחד לא רץ. מחכים ל«אשר» שלך על בדיקת הרשאות גיטהאב.

אם תרצה שוב את חדשות ה-AI — כתוב «חדשות AI» ורות תרוץ מיד.

LEARNING:
- do: Verify LIVE FLOW before any duplicate/fresh-result claim; news keywords in household filter
- dont: Block «שוב ועכשיו» without checking whether the first delegate was silently dropped
- note: Code fix pushed; founder asked for permanent fix not re-run news this turn
