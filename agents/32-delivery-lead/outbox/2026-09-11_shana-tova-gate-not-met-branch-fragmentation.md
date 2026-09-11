# Shana Tova one-pager — gate check: NOT met, bet held. Found + fixed a bigger problem: 24 unmerged branches

**Date:** 2026-09-11T09:2xZ · **Owner:** קשת (32-delivery-lead) · **Task this turn (from Noa/00-ceo):**
"When EMET-167 QA passes and founder sends «יאללה»+PIN: kick off Shana Tova one-page bet per
`IDEA-2026-09-11-shana-tova-greeting-page.md` — Linear single project, 14-frontend-engineer build,
18-devops-platform Pages publish, 20-qa-sdet live QA."

## Bottom line

**Did not kick off the Shana Tova bet.** Both trigger conditions are unmet, live-verified — not
assumed from the task phrasing. Checked every source of truth myself before touching anything:
`git fetch --all`, Linear GraphQL (`LINEAR_API_KEY`, not cache), `gh api` + `curl` on the live site,
and the full `ops/founder-channel/ledger.jsonl` history (main + every relevant branch).

## Condition 1 — "EMET-167 QA passes": **FALSE**

- Live Linear check (GraphQL, not the cached `ops/linear-issues.json`): `EMET-167` state = **"In
  Progress"**, `updatedAt` 08:27Z. Not Done.
- What actually happened since that last comment, all sitting on **unmerged branches** invisible to
  `main` and to this ticket until now:
  1. QA ran (`20-qa-sdet`) → **FAIL**: Q10 crashes with `undefined.answer` — `buildQuestions()`
     builds only 9 questions from a 9-template pool, but the UI promises 10.
  2. QA re-ran after a claimed fix → **FAIL AGAIN**, identical crash — the first "fix" never shipped.
  3. A newer fix exists (`quizEngine.buildQuestions()` rewritten to guarantee 10 items) but is
     **still not live**. I checked myself, right now: `gh api repos/ZionAmar/kids-math-quiz` →
     `pushed_at` unchanged at `2026-09-11T08:17:29Z`; `curl -I
     https://zionamar.github.io/kids-math-quiz/` → `last-modified` unchanged at `08:20:39Z`. The
     site the founder would open **right now still crashes on Q10**.
- Posted a correcting comment on `EMET-167` in Linear with this full trail (comment
  `a97a6a7f`) so the ticket isn't stale anymore.

## Condition 2 — "founder sends «יאללה»+PIN" (for the Shana Tova bet specifically): **FALSE**

- Searched the entire `ops/founder-channel/ledger.jsonl` (every entry, main + all branches that
  touch it) for any mention of Shana Tova / greeting page / ראש השנה: **zero matches** of an
  explicit build-go for this bet.
- The founder did give the **spec** (verbatim, in the intake file): a one-page carousel + Hebrew
  blessing + EaseToDev-only footer, and later a **quality reaffirmation** — "כמובן שהאתר הזה יפורסם
  והכל ותיתנו לי לינק חי שעובד" (of course it'll be published with a working live link). That is
  scope and quality expectation, not an explicit «יאללה»/«תבנו» + action PIN authorizing a **new**
  product bet.
- Even Noa's own two intake write-ups (see below) agree: *"Founder gates still needed before build:
  Explicit «יאללה»/«תבנו»... Action PIN (new product scope beyond prior cake/math unlock)."*
- No Linear issue exists for this bet yet (live GraphQL search for "shana" → 0 results) — correct,
  per WIP=1, per Noa's own intake note ("no engineer kick while WIP=1").

**Both conditions false → correctly held. No Linear project opened, no specialist delegated to
build.**

## The bigger finding: 24 unmerged branches, 3x duplicate fix attempts, 2x duplicate intake

While checking the above I found the task's own source — Noa's DELEGATE line — only existed on an
**unmerged branch** (`cursor/shana-tova-intake-60f1`), not on `main`. Pulling that thread open:

- **24 `cursor/*` branches** created in ~4 hours (05:27Z–09:13Z), none merged to `main`, covering
  what is really 2 bets: the cake-recipe-demo status saga and the kids-math-quiz Q10 bug.
- **3 separate branches** independently "fixed" the identical Q10 crash
  (`kids-math-quiz-q10-fix-6c5f` 08:43Z, `fix-kids-math-q10-cb45` 09:04Z,
  `kids-math-quiz-q10-fix-afab` 09:13Z) — parallel Cloud runs unaware of each other, none of it
  live.
- **2 separate branches** independently wrote the identical Shana Tova intake
  (`shana-tova-intake-60f1` 09:08Z, `shana-tova-publish-commitment-9ffa` 09:11Z) — same IDEA file,
  same decision, never reconciled.
- Net effect: `main` (and this ticket) looked stale/wrong until this run cross-checked branches
  directly — exactly the "בלאגן" pattern the founder has already called out twice this week.

**What I did about it (in-lane, not a full rescue):**
- Consolidated the *true* state onto `main`/this ticket now: `ops/config/factory.json`
  (`pendingWork.kids-math-quiz` corrected with QA-fail history + branch list;
  `pendingWork.shana-tova-greeting-page` added, one clean entry, gate explicitly marked unmet),
  Linear comment on `EMET-167`.
- **Did not** attempt a full 24-branch merge this turn — that is a distinct, real cleanup task, not
  something to rush inside a gate-check without risking new conflicts on top of existing ones
  (`ops/config/factory.json`, `ops/founder-channel/ledger.jsonl` are hot files across several of
  these branches).
- Logged `ops/company-lessons.md#dispatcher_parallel_branch_fragmentation` so the dispatcher pattern
  (new branch per message on an already-open bet) gets fixed at the root, not patched per-incident
  again.

## Say to ציון (Hebrew, for Noa to forward)

**דף שנה טובה — עדיין לא מתחיל, ובצדק.** שני התנאים שקבעת לא התקיימו: (1) ה-QA של משחק המתמטיקה
(EMET-167) **נכשל פעמיים** על שאלה 10 (קריסה) — יש תיקון סביר בכתובים אבל הוא **עדיין לא באוויר**,
בדקתי הרגע והלינק החי עדיין קורס על שאלה 10; (2) לא מצאתי בשום מקום הודעה מפורשת שלך של «יאללה»/
«תבנו»+פין ספציפית לדף השנה טובה — רק את הבקשה המקורית (התוכן: גלריה, ברכה, EaseToDev) ואישור שאתה
מצפה ללינק חי, לא אישור בנייה בפועל.

**גילוי נוסף, לא קטן:** מצאתי 24 branches נפרדים בגיטהאב מהארבע שעות האחרונות, כולל 3 ניסיונות תיקון
כפולים במקביל לאותו באג (שאלה 10) ו-2 ניסיונות כפולים לרשום את בקשת השנה טובה — שום דבר מזה לא היה
ב-main, וזה בדיוק סוג הבלאגן שהתלוננת עליו קודם. תיקנתי את התמונה האמיתית עכשיו (Linear + קובץ מצב),
ורשמתי לקח קבוע כדי שזה לא יקרה ככה שוב ברמה הזו.

**הבא בתור:** מישהו (ממליצה על ההנדסן שכתב את התיקון האחרון) מפרסם בפועל את התיקון לשאלה 10, אורי
מריצה QA נקי, וסוגרים את EMET-167 באמת. רק אז — ואחרי «יאללה»+פין מפורש שלך לדף השנה טובה — קשת פותח
טיקט Linear אחד ומפעיל דפנה→פז→אורי על ההימור הזה.

## Files touched this run

- `ops/config/factory.json` — `pendingWork.kids-math-quiz` corrected, `pendingWork.shana-tova-greeting-page` added
- `ops/company-lessons.md` — new entry `dispatcher_parallel_branch_fragmentation`
- Linear `EMET-167` — comment `a97a6a7f` (status correction)
- This file

---

LEARNING:
- do: When a DELEGATE task references a source file/branch you can't find locally, `git fetch --all` and check ALL remote branches (not just `origin/main`) before concluding it's fabricated — this turn the "missing" IDEA file and the DELEGATE line itself were real, just stuck on an unmerged branch. Also: before evaluating any gate condition, live-check it against the primary system (Linear GraphQL, `gh api`, `curl`) rather than trusting cached JSON or a specialist's claim.
- dont: Don't try to fix a 24-branch fragmentation problem by merging all of them inside an unrelated gate-check task — that risks compounding the mess. Flag it (company-lessons + factory.json) and let a dedicated pass handle the merge.
- note: Shana Tova bet correctly held — both conditions false. Root cause traced: EMET-167 QA failed twice (Q10 crash), a real fix exists but is unpublished, and 24 unmerged parallel branches (including 3 duplicate Q10 fix attempts and 2 duplicate Shana Tova intakes) hid all of this from `main`. Corrected the record on `main` without attempting the full branch reconciliation.

HANDOFF:
- done: Live-verified both Shana Tova gate conditions are false (EMET-167 QA failed twice and its fix is unpublished; no founder יאללה+PIN exists for this bet anywhere). Corrected `EMET-167` on Linear with the real fail history. Corrected `ops/config/factory.json` (kids-math-quiz real status + branch list, shana-tova-greeting-page clean entry with explicit unmet gate). Logged the 24-branch fragmentation as a company lesson.
- next: (1) Someone republishes the most complete Q10 fix (`cursor/kids-math-quiz-q10-fix-afab` looks most complete — rewrites `buildQuestions()` to guarantee 10 items) and 20-qa-sdet re-runs QA clean → then `32-delivery-lead` closes `EMET-167` for real. (2) Only after that AND an explicit founder «יאללה»+PIN for the Shana Tova bet specifically → `32-delivery-lead` opens one Linear issue and runs the pipeline (14-frontend-engineer → 18-devops-platform → 20-qa-sdet). (3) Separately, someone should do a dedicated pass reconciling/closing the 24 unmerged branches from today — not urgent-blocking, but growing.
- files: `ops/config/factory.json`, `ops/company-lessons.md`, this outbox file, Linear `EMET-167` comment `a97a6a7f`

DELEGATE: 00-ceo | Shana Tova bet stays held (both gates false, live-verified). Please also route the real open item back to 14-frontend-engineer/18-devops-platform: republish the Q10 fix on `cursor/kids-math-quiz-q10-fix-afab` (or whichever fix branch you pick as canonical) and have 20-qa-sdet re-run QA clean before EMET-167 closes — and please stop spawning a new branch per status message on an already-open bet (see `ops/company-lessons.md#dispatcher_parallel_branch_fragmentation`, 24 unmerged branches found this run).
