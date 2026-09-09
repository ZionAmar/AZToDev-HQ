# INV-04 correction — the "safe" screenshots are not actually clean

**Task:** Noa asked (32-delivery-lead / קשת) — same ask as the concurrent turn that wrote
`2026-09-09_inventory-deck-v2-revision-brief.md` (commit `c52e2bc`, ~4 min before this turn started).
I pulled that commit, read the brief + updated `ops/intake/inventory-deck-board.json` (INV-04), and verified
it before treating it as done. **This file is a correction, not a duplicate brief** — the 11-slide plan,
slide order, and DELEGATE structure in the prior brief are good and stay as-is. One specific factual claim
in it is wrong, and it would have shipped a still-contaminated v2 deck if not caught now.

## What the prior brief got right (verified, not redone)

- All 27 `INV-01` screenshots still exist in git — no new capture round needed.
- Slide order matches ציון's exact list (dashboard → orders → order detail → products → product form →
  warehouse map → warehouse row → team → agent sale → picking → driver).
- `screenshots/60-sa-companies.png` correctly flagged as showing "איציק סיטונאות" and correctly excluded
  (also not on ציון's requested list anyway).

## The error — verified by actually opening the image files, not just the text catalog

The prior brief's own QA checklist says: *"לא מצאתי אזכור נוסף של 'איציק' בשום screenshot חוץ מ-60, אבל
שווה שה-QA יסתכל שוב"* — i.e. it flagged uncertainty but shipped the DELEGATE anyway with only
`screenshots/60-sa-companies.png` in `excludeAssets`.

I opened the actual PNG files (not just `screen-catalog.md`'s text descriptions) for the screens selected
for v2, plus a full pixel scan with Pillow across all 24 logged-in-role screenshots. Result: **the tenant
badge "איציק סיטונאות" is baked into the persistent right-hand navy sidebar shown on every admin/agent/
warehouse-manager screen** — not just screenshot `60`. Confirmed visually on `10, 11, 12, 13, 17, 20, 30,
40, 41, 43` (opened directly) and confirmed by pixel measurement on all remaining admin/agent/warehouse
screens (`14, 15, 16, 18, 19, 21, 31, 32, 33, 42` — same fixed sidebar geometry, same component, so same
badge). The public landing page (`00-public-landing.png`) also shows it, embedded inside the hero
dashboard-mockup graphic (not the sidebar) — not used in the v2 plan, noted here only so no one adds it
back later without the same fix.

**10 of the 11 non-title slides in the approved v2 plan (`10,11,12,13,14,17,18,20,30,40,41`) would have
shipped ציון's exact complaint again** — this is exactly the "לא אהבתי, לא שם של איציק" feedback that
opened this ticket, and it would have reappeared in the "fixed" version on nearly every slide.

**Not contaminated (verified):** `50-driver-deliveries.png` — the driver view has no sidebar at all.
Pixel scan confirms zero navy pixels at the sidebar's usual x-position. This is the one screen the prior
brief can use exactly as-is.

## Exact, mechanical fix (measured, not guessed)

Used Pillow to find the left edge of the navy sidebar per screenshot (scanned for the dark navy RGB block
touching the right image edge, at multiple y-rows per file):

| Screen group | Image width | Sidebar starts at x= | Sidebar width | Crop to keep |
|---|---|---|---|---|
| admin / agent / warehouse-manager (`10-21`, `30-33`, `40-43`) | 1440px | 1217 | 223px | `x: 0–1217, y: 0–900` (full height) |
| super-admin (`60-63`) | 1440px | 1243 | 197px | not needed — excluded from v2 entirely |
| driver (`50`) | 1440px | — (no sidebar) | 0 | no crop needed, use as-is |

This is a one-line crop per image (`im.crop((0, 0, 1217, 900))` in Pillow) before pasting into the slide —
removes the entire nav chrome column (icons + tenant badge), not just the name text. No new screenshots,
no PC/localhost access, no PIN — pure image post-processing on files already in this repo. Also a better
result for the deck itself: the repeated nav chrome added no information across 10 slides anyway.

## What I did with this finding

- Updated `ops/intake/inventory-deck-board.json` → `INV-04.cropRequiredAssets` with the exact crop spec,
  affected/unaffected screen lists, and a pointer to this file — so the machine-readable DoD reflects the
  real requirement, not just prose in one outbox file.
- Did **not** rewrite the v2 brief itself (slide order/content stays as the prior turn wrote it — no need
  to duplicate correct work).
- Did **not** build the PPTX or edit the images myself — image processing + deck assembly is
  `22-content-marketing`'s craft, not Delivery Lead's. My job here is catching the gap in the DoD before
  it ships, not doing the specialist's work for them.

**DELEGATE: 22-content-marketing | Before building INV-04, read
`agents/32-delivery-lead/outbox/2026-09-09_inv-04-screenshot-badge-correction.md` (this file) in addition
to the original brief. Crop every admin/agent/warehouse-manager screenshot you use (`10,11,12,13,14,17,18,
20,30,40,41`) to `x:0–1217` before inserting into a slide — this removes the "איציק סיטונאות" badge that
is otherwise present on all of them. `50-driver-deliveries.png` needs no crop. Re-check the final PPTX
visually (zoom on the top-right corner of every screenshot slide) before marking INV-04 done — this is
the second round on this exact complaint, don't ship a third.**

## Not my lane (unchanged from prior brief)

Same three items the prior brief already correctly routed — still true, not re-litigating:
1. PPTX build — `22-content-marketing`.
2. Placing the final file on ציון's desktop + retiring the old v1 there — `34-pc-ops`, after the build.
3. Emailing the new deck (if wanted) — needs PIN, not sent this turn.

## WIP note

Not a new WIP slot. Same initiative (`IDEA-2026-09-07-inventory-deck`), same board, same `INV-04` task —
this file only corrects that task's DoD before handoff. `activeWork` (`pc-production-inventory`) is
untouched and still genuinely waiting on Nadav/ציון, unrelated to this thread.

## Answer for Noa → ציון (short Hebrew, for Telegram)

המשימה כבר בתנועה — בריף למצגת חדשה (11 שקפים, לפי הרשימה המדויקת שלך: דשבורד, הזמנות, מוצרים, מחסן,
צוות, סוכן, ליקוט, נהג) נכתב ונשלח ל-22-content-marketing לבנייה. לפני שהיא מתחילה לבנות, מצאתי ותיקנתי
בעיה אמיתית: הבדיקה הקודמת חשבה שרק מסך אחד (super-admin) מציג את השם "איציק סיטונאות" — בפועל, כשפתחתי
בעצמי את קבצי התמונה, גיליתי שהשם מופיע בפינה של **כל** מסך admin/סוכן/מחסן שביקשת (דשבורד, הזמנות, מוצרים,
מחסן, צוות, סוכן, ליקוט) — בתפריט הצד הקבוע, לא רק במסך שכבר סימנו. נתתי הוראת חיתוך תמונה מדויקת (קואורדינטות
פיקסלים, לא הערכה) שמסירה את התפריט הזה מכל השקפים לפני שהם נכנסים למצגת. מסך הנהג היחיד שכן היה נקי מראש.
זה לא חוסם כלום — רק תיקון לפני בנייה, כדי שלא תקבל שוב מצגת עם השם הישן על המסך.

LEARNING:
- do: When a prior/concurrent turn's brief says "checked, didn't find X, but worth a second look" — take
  that second look yourself with the actual tool (open the image files, run a pixel scan) before trusting
  the claim and letting the DELEGATE go out as-is. A text catalog description (`screen-catalog.md`) does
  not mention persistent UI chrome like a sidebar tenant badge — only opening the real PNGs found it.
- dont: Don't treat "I didn't find more instances, but QA should double-check" as equivalent to "verified
  clean" when passing a DoD to the next owner — that phrasing is itself a flag to verify now, not later,
  especially on a task that already failed once on this exact complaint (branding leak).
- note: Found via direct image inspection (10 screenshots opened) + Pillow pixel-boundary scan (24
  screenshots measured) that 10 of 11 planned v2 screenshot slides still carry "איציק סיטונאות" in a
  persistent sidebar the text catalog never mentioned. Gave 22-content-marketing an exact crop spec
  (`x:0–1217` of 1440px width) instead of a vague "check again" — same DELEGATE target as the prior brief,
  corrected DoD, no new board/Linear item, no rework of the already-correct slide plan.
