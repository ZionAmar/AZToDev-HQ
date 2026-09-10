# Outbox — 2026-09-10 · fix contradictory news reply

**From:** נועה (`00-ceo`)  
**To:** ציון (via desk)  
**Trigger:** «נו, יש לך בעיות, תסדרי את זה… למה את אומרת שיש ריצה?»

## What went wrong

1. Founder asked for AI news twice («תבדקי חדשות AI» → «שוב ועכשיו»).
2. Noa replied «יש כבר תוצאה טרייה / ריצה כפולה» — **wrong**. Ruth never ran; no specialist was active.
3. Root cause (code): `runtime/lib/work-intent.mjs` dropped Ruth delegation because «חדשות» / «AI» were not in the household-ops allowlist (only mail keywords matched). `inferRequiredDelegate` in `agent-memory.mjs` had the same gap.

## What I fixed

- Added `isExplicitNewsAsk()` to `work-intent.mjs` — Ruth no longer blocked on news/AI asks.
- Added news/AI routing to `inferRequiredDelegate` in `agent-memory.mjs`.
- Created Ruth inbox packet for fresh AI news run.

## Founder-facing reply (Telegram)

See run output — Hebrew only.

## Runtime truth (this turn)

- **Now:** Noa Cloud run `bc-6c9c7237-14f9-4eed-b8d7-7485bf6fca82`
- **Next:** Ruth starting AI news summary
- **Waiting:** «אשר» on GitHub Cursor permissions plan (unchanged — separate thread)
- **Nadav:** PC online, no open PC task

## Internal

DELEGATE: 33-household-ops | Fresh AI-only news summary for founder — web search + relevant Gmail digests; Hebrew phone-friendly; outbox with timestamp; this replaces the failed prior attempt that never ran

LEARNING:
- do: On «שוב ועכשיו» for news — verify Ruth actually ran (inbox/outbox/Cloud ID) before claiming duplicate; fix routing if delegate was silently dropped
- dont: Say «יש תוצאה טרייה» or «ריצה כפולה» when work-queue and background jobs show zero Ruth runs for that ask
- note: Founder caught contradiction after prior Noa said no run then blocked re-run; patched news routing in work-intent + agent-memory
