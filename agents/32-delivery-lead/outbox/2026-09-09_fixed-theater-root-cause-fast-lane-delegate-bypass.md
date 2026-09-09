# Root-caused + fixed the "בלאגן" complaint — code bug, not another lesson

**Asked by:** Noa (00-ceo), relaying founder: "ההודעות לא מסודרות... היא קופצת לדברים שכבר נגמרו...
כלום לא עובד כמו שביקשתי... משימות לא נסגרות כמו שצריך... תסדרו את החברה כמו שביקשתי כבר כמה פעמים."

**Owner:** 32-delivery-lead (קשת), this turn. WIP=1 — this was the only bet worked this turn.

## Why prose lessons kept failing

`ops/company-lessons.md` already has four entries for this exact symptom today
(`delegate_claim_without_delegate_line`, `promise_without_artifact_execute_instead`,
`stale_snapshot_status_contradiction`, `company_salad_zombie_wip`). Writing a fifth lesson would not
have fixed anything — the founder was right that "arranging it" hadn't actually happened yet. So this
turn went to the code instead of the prompt.

## Root cause (found in `runtime/lib/front-desk.mjs`)

Two lanes exist for a founder Telegram message: `execute` → full Cloud Noa turn, `chat` → `fastNoaReply`
(cheap LLM call for status/chat, so short messages don't eat a 5-7 min Cloud timeout).

- The **Cloud** path (`hq/lib/cloud-ceo.mjs`) already piped its reply through
  `executeDelegateRelay(...)` — real `DELEGATE:` lines become real background jobs, and if the LLM
  forgot to emit one, `inferRequiredDelegate(founderText)` is a forced safety net.
- The **fast/chat** path (`fastNoaReply`) never did either. It only *told* the LLM in its system prompt
  not to claim contacting someone without a `DELEGATE:` line — a prompt-level ask with zero code
  enforcement — then sent whatever text came back straight to the founder.

That is exactly how the 15:40Z/15:55Z incidents happened: the founder's short follow-ups (status-shaped,
so routed to the fast lane) got LLM prose like "שולחת כעת הודעה לקשת. אעקוב על התקדמות." with **no**
`DELEGATE:` line, and even if there had been one, the fast lane would have discarded it — nothing was
ever queued. Ownership was correct (קשת); the pipe from "Noa's reply" to "a real job" simply didn't
exist on that lane. Multiple learning-log entries already diagnosed the *symptom* (theater) — this is
the mechanical *cause*.

## Fix (code, `runtime` + `agents/32-delivery-lead` are HQ ops tooling, not gated product work)

1. `runtime/lib/front-desk.mjs` — `fastNoaReply` now routes its reply through the same
   `executeDelegateRelay` + `founderFacingText` choke point the Cloud path uses. Real `DELEGATE:` lines
   from the fast lane now start real background jobs; a bare mention with no formatted line
   (e.g. "תפני לקשת, תדברי איתו") now also triggers the same `inferRequiredDelegate` fallback the
   execute lane already relies on.
2. `runtime/lib/agent-memory.mjs` (`stripFakeSpecialistClaims`) — broadened the false-claim guard to
   catch "שולחת/פונה ... ל<agent>" phrasing (the literal sentence that triggered the founder's anger),
   not just the narrower "X בדקה/מצאה" pattern it already caught. Also fixed a latent bug: the regexes
   used a trailing `\b`, which never matches after Hebrew letters in JS (`\b` is ASCII-`\w`-only) — every
   claim ending at punctuation was silently un-stripped. Replaced with a Hebrew-aware boundary
   (`(?![א-ת])`).
3. `runtime/lib/agent-memory.mjs` (`inferRequiredDelegate`) — the קשת-name detector only matched a
   *standalone* word (`(?:^|\s)קשת(?:\s|$|[.,!?])`), so it missed the founder's own real sentence
   ("תפני **לקשת**") because Hebrew attaches "to/for" (ל) directly with no space. Broadened to accept the
   standard single-letter Hebrew prefixes (ל/ו/ש/כ/ב/מ/ה) glued onto קשת.

## New: a real quality gate, so the next regression doesn't sit invisible

Found while investigating: `runtime/scripts/test-live-status.mjs` was **already red on `main`**
(`unfinishedActiveWork()` hard-asserted `null`, but a real bet has been open since 13:40Z) — and nothing
ever ran it, because there was no `npm test` and no CI wiring any of the six `runtime/scripts/test-*.mjs`
files together. That is a second, structural instance of the same complaint: work that looks done
(passing tests, presumably) was never actually checked.

- Added `runtime/scripts/run-tests.mjs` — runs every `test-*.mjs` and prints a pass/fail summary.
- Wired `npm test` to it in `package.json`.
- Fixed `test-live-status.mjs` to assert the function's real contract (mirror live
  `factory.activeWork` truthfully) instead of assuming the company is always idle.
- Added regression tests for the two regex bugs above (`test-agent-memory.mjs`, `test-company-loop.mjs`)
  using the exact founder sentences from `ops/founder-channel/ledger.jsonl` so this specific incident
  can't silently regress.

**Verified:** `npm test` → `6/6 passed` (was un-runnable as a single command before this turn; one test
was red once dependencies were installed and would have stayed invisible).

## What I deliberately did NOT touch

`ops/config/factory.json` / `ops/intake/pc-production-inventory-board.json` — the current
`activeWork.waitingFor` bundle (Nadav PCI-04/10, founder PIN for PCI-05/06, founder Keep/Review/Archive
decision for PCI-09) is still genuinely accurate, not stale. Marking any of it "done" without a real PIN
or a real Nadav report would be the exact false-closure bug this turn just fixed — not going to introduce
a new instance of it to look tidy.

## For ציון (short Hebrew, Telegram)

מצאתי את הבאג האמיתי מאחורי "הבלאגן": בערוץ הצ'אט המהיר של נועה (לשאלות סטטוס קצרות), תשובה יכלה לטעון
שהיא פונה למישהו בלי שבאמת נשלחה משימה — לא רק פעם אחת, זה קרה כי הערוץ הזה מעולם לא היה מחובר בקוד
למנגנון שבאמת מפעיל DELEGATE. תיקנתי את זה בקוד (לא רק כתבתי עוד לקח), הוספתי `npm test` כדי שבאג כזה
לא יישאר אדום בלי שמישהו שם לב, ומצאתי + תיקנתי גם באג נלווה: הזיהוי של "קשת" בטקסט לא תפס את הצורה
"לקשת" (עם ל') — בדיוק המשפט שלך מהערוץ. ה-PCI-04/05/06/09/10 שנשארו פתוחים — אמיתיים, לא נגעתי בהם בלי
פין/דיווח נדב אמיתי.

LEARNING:
- do: When the same failure symptom gets a 4th/5th company-lesson entry in one day, stop writing lessons and go read the actual code path that produces the symptom — a prompt instruction ("don't claim X without DELEGATE") is not enforcement if the code never checks it.
- dont: Trust that "the LLM was told not to lie" is a fix. `fastNoaReply` had exactly that instruction in its system prompt for this whole session and the theater happened anyway, because nothing downstream verified or enforced it.
- note: Root cause was structural (fast lane bypassed `executeDelegateRelay` entirely) not a one-off prompt mistake. Fixed in `runtime/lib/front-desk.mjs` + `runtime/lib/agent-memory.mjs`, added `npm test` (`runtime/scripts/run-tests.mjs`) since a real regression (`test-live-status.mjs`) was already red and invisible before this turn. All 6 tests pass now.

DELEGATE: 00-ceo | Tell ציון in Hebrew (short): found + fixed the real code bug behind "הבלאגן" (fast-lane Telegram replies could claim contacting a specialist with zero real DELEGATE — now wired through the same enforcement the Cloud path already had), fixed a matching bug where "לקשת" (with the ל prefix) wasn't recognized, and added `npm test` so this kind of regression can't sit invisible again. PCI-04/05/06/09/10 are unchanged — still genuinely waiting on Nadav / founder PIN / founder's Keep-Review-Archive call, not touched. PR opened on GitHub HQ repo for the code change.
