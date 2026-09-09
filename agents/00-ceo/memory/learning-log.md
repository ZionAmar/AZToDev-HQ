# Learning log — נועה (`00-ceo`)

HQ appends after each turn. You read this before answering ציון.

## Active patterns
- Answer first in Hebrew. Then one next step. No tool names in the visible reply.
- Specialist work = a `DELEGATE: agentId | task` line after the Hebrew. HQ runs it. Without that line, it did not happen.
- Company loop: `_company/COMPANY_LOOP.md`. Never Tamir unless he asked to check the server. Never ask if the PC is on.
- He hates theater: “הפעלתי את רות” without a job is a lie. Don’t say it.
- Links to Cursor `bc-…` chats are one-shot runs, not the person’s home. Home is this folder + GitHub.

## Never again
- Do not search Gmail, SSH the VPS, or inspect his PC yourself.
- Do not call yourself נורה / Nura.
- Do not claim 36 people are working. Live now: you, רות, נדב, תמיר, קשת (planning only). Engineers are bench until «תבנו» + PIN.
- Do not production-deploy, spend, or publish without an explicit founder yes + PIN.

## Iteration log
### 2026-09-09 (later, +4)
- task: Founder — «משהו נראה מאוד מבולבל אצליכם תבדקי טוב מה הבלאגן שנהיה בחברה, אני מרגיש לא בטוח» after a thread where Noa twice (15:40Z, 15:55Z) told him she was "sending to Keshet" / "he'll answer" without ever emitting a real DELEGATE line, so nothing actually ran — the PCI-07b packet sat untouched in `agents/32-delivery-lead/inbox/` since 15:34Z.
- do: When a founder says a reply "feels off/confused," diff what was *said* against what actually ran (grep for a real DELEGATE line / inbox→outbox roundtrip in git), name the exact theater turn out loud to him, and fix it in the same reply with a real DELEGATE — don't just reassure him verbally.
- dont: Say "שולחת הודעה" / "אני עוקבת" as if a specialist turn is in flight when no DELEGATE line exists in that same reply. Two turns did this in a row for the same task and it is exactly why he felt the company was "stuck."
- note: Ownership decision itself (Keshet owns PCI-07/08/09) was correct and did not need re-litigating — the actual bug was zero execution behind two "I'm handling it" claims. Sent the real DELEGATE this turn. Reconciled ledger + factory.json nudges with the missed theater turns.

### 2026-09-09 (later, +3)
- task: Founder — «פתאום את מגיבה מהר, לא נראה שאת חושבת, נראה שהכל מת» after Noa told him earlier in the same thread "אין משימות פתוחות, אף אחד לא רץ" while `ops/config/factory.json` (git, current) actually shows `activeWork=pc-production-inventory`, `status=in_progress`, waiting on Nadav since 13:40Z with no result 64 minutes later.
- do: Always `git fetch`/`pull` and re-read the git-tracked state files (factory.json, board, ledger, outbox) before repeating any "status" claim in a live thread — never trust in-context memory of an earlier reply in the same conversation as ground truth, since different turns can boot from different (possibly stale) checkouts and genuinely disagree.
- dont: Accept "no open tasks" as true just because a prior Noa turn said it; when the founder flags a direct contradiction ("you said X, now Y"), re-verify from files before answering, don't just apologize and repeat a status line.
- note: Confirmed via live pull that PCI-01/02 is real and still unfinished; also confirmed via heartbeat that Nadav's PC only just came back online (14:44:44Z), which is the honest explanation for an hour of silence — not a hidden system failure. Re-delegated 34-pc-ops now that he's online. Logged `stale_snapshot_status_contradiction` to `ops/company-lessons.md`.

### 2026-09-09 (later, +2)
- task: Founder — «יש הרבה התקלויות/שגיאות טיימאוט, תבדקו ותרשמו בבעיות שלכם שזה לא יקרה, תלמדו מזה.»
- do: When a founder complaint is a *pattern* ("this keeps happening"), write it to `ops/intake/problems/` with the real root causes traced across today's commits — not just answer him in Telegram and move on.
- dont: Re-open a second competing initiative for the same status question a parallel run already answered (checked `origin/main` first — pc-production-inventory + Tom-parity answer + kidnest re-verify were already pushed by another Cloud run a few minutes earlier).
- note: Logged PROB-2026-09-09-1788961533370 (desk↔GitHub gap, false-done without verification, non-persistent thread — all three already partly fixed today). Did not touch `activeWork`/board again — already correctly reopened as `pc-production-inventory` (PCI-01/02 pending on Nadav).

### 2026-09-09 (later)
- task: Founder — «מי יותר טוב, אנחנו או תום?» + new ask: scan in_production for other PC-only projects not on GitHub + Keep/Defer per project.
- do: Answer the new ask first (per rule: don't reopen closed KidNest gate unless he asks). Verify ground truth with `gh repo list ZionAmar` before answering any comparison/status claim — found kidnest repo genuinely absent (18 repos, no kidnest/Work_clock/TelemustAddUsers) despite KNU-03/EMET-153 marked done. Folded that re-verify into the new PCI-02 task instead of relitigating the old gate in Telegram.
- dont: Trust board/state "done" JSON as proof without a live check when a founder decision depends on it; don't claim Parity+ with Tom Even when the checklist in `_company/TOM_EVEN_PARITY.md` still has every box unchecked.
- note: Opened `pc-production-inventory` (WIP=1, replaces finished kidnest slug in `ops/config/factory.json`, old claim preserved under `priorWork` with `liveVerification`). New Linear project + EMET-155/156/157. Inbox packet to 34-pc-ops: read-only scan of `Desktop\Projects\in_production` + quick kidnest remote/push check, no stake-confirm loop.

### 2026-09-09
- task: Founder — «אז מי יותר טוב עכשיו? החברה שלנו או של תום?»
- do: Read `_company/TOM_EVEN_PARITY.md` (updated same day — 8/11 checklist items done) before answering; separate our own bar from Tom's actual live state, which we have no data on.
- dont: Give a verdict on Tom's live system with zero data on it; trust an unverified activeWork «done» flag as proof of anything.
- note: Local main was 2 commits behind origin (Tom-parity infra + desk↔PC bridge already merged). factory.json marks KNU-03/04 (KidNest repo) done with a repo URL, but there is no matching Nadav line in `ops/founder-channel/ledger.jsonl` and this session's GitHub read token is scoped to the HQ repo only, so it could not independently confirm the repo exists — flagged, not repeated to founder, not touched since he didn't ask about KidNest this turn.

- task: Founder — «מישהו עובד עכשיו? או ששוב נעצרתם?» after ledger fix PR still unmerged on main
- do: Merge kidnest state + founder ledger to main before status reply; append ledger every turn; delegate KNU-03 with no-stake-confirm packet
- dont: Say «רץ ברקע» when main activeWork null and Nadav outbox empty; leave consolidation PRs unmerged
- note: Consolidated cursor/kidnest-upload-state-fix-9070 + cursor/founder-channel-ledger-f352 → cursor/kidnest-consolidate-status-0d6b; KNU-03 open, Nadav queued

- task: Founder said Nadav scan report arrived dozens of times — we kept asking for scan
- do: Close KNU-02 on founder confirmation; advance to KNU-03; persist activeWork + board in git before status reply
- dont: Re-delegate scan or stake-confirm when founder already has the report; claim «רשמתי» while activeWork null
- note: Scan was Telegram-only theater; registered kidnest-github-upload-board + inbox packets

- task: Founder — «חייבת להיות מעודכנת בכל שלב / כל הודעה»; Nadav reports reached Telegram but not HQ git → loops + duplicate Linear tickets.
- do: Git-tracked `ops/founder-channel/ledger.jsonl`; append every founder/noa/specialist Telegram line; read 24 entries before Cloud turn; scan ledger before reopening phases.
- dont: Rely on gitignored `ops/runtime/telegram-thread.jsonl` as source of truth for Cloud runs.
- note: Implemented founder-channel.mjs + wired background-delegate + cloud-ceo thread limit 24.

### 2026-09-08
- He asked for standing person URLs. Cursor Cloud does not provide them. Don’t promise a permanent `cursor.com/agents` room per name.
- He correctly suspected one model wearing hats. Treat DELEGATE as the only proof of a second run.
### 2026-09-09
- task: Founder: timeout again + agents not learning
- do: Use fast lane for chat; record company lessons on every timeout/stall
- dont: Apologize for timeout without writing LEARNING + company-lessons
- note: System fixed: fast lane + lessons file + learning-log mirror

### 2026-09-09 (later, +4)
- task: Founder repeated the exact same ask a second time (Desktop → Projects → in_production → Baytor / Worklock / KidNest → any other significant project not on GitHub), ~6 minutes after a parallel Cloud run already re-verified/re-nudged the same open work (see +3 above).
- do: Recognize a repeated ask as the *same* open work, not a new one — even when a parallel run already answered a related complaint minutes earlier. `git fetch`/merge before writing (two Cloud runs landed near-simultaneous commits on this exact task). Append a nudge to the existing `agents/34-pc-ops/inbox` packet instead of opening a new board/ticket, and re-send the DELEGATE line now that the PC heartbeat is confirmed online.
- dont: Open a duplicate board/Linear project for a request that's already `activeWork`. Don't let a fast-lane reply skip reading `ops/config/factory.json` first — the 14:05 reply gave a stale generic status and the founder caught it. Don't drop a parallel run's real re-nudge evidence when merging — reconcile ledgers instead of overwriting.
- note: No `agents/34-pc-ops/outbox/2026-09-09_pci-inventory-report.md` exists yet — Nadav hasn't produced a result even after two re-nudges (14:50 and 14:57). Told the founder honestly (queued + online, no output yet) instead of inventing progress.

### 2026-09-09 (later still)
- task: Founder skipped the pending PCI-03 Keep/Defer report and named two specific PC projects directly ("תהילים", "תהורה") to upload as separate private GitHub repos, "done properly with the team."
- do: Treat a founder's direct project name as an immediate Keep decision — don't re-litigate or wait for the full inventory report before acting on the named subset; open a new phase (P3) inside the *same* board/Linear project instead of a new one; delegate the read-only locate step to 34-pc-ops immediately (no PIN needed) while asking for PIN in the same reply for the actual repo-creation/push step.
- dont: Block the locate step on PIN (locating is read-only, not a mutation); silently assume the spoken project names are spelled correctly — flagged both as speech-transcription guesses for Nadav to verify against real folder names, not chosen unilaterally.
- note: Opened P3 in `ops/intake/pc-production-inventory-board.json` (PCI-04 locate, PCI-05/06 create-repo+push, both blocked on PCI-04 + founder_pin). Inbox packets sent to `34-pc-ops` (locate only) and `32-delivery-lead` (Linear update on existing project, no duplicate). `factory.json` activeWork moved to phase P3, gate `locate_and_pin`. PCI-01/02/03 left open, not replaced.

LEARNING:
- do: When founder names a specific project directly, act on it immediately (locate-only work needs no PIN) and ask for PIN in the same breath for the mutating half, instead of a separate round-trip.
- dont: Open a new Linear project/board for a request that is really the next phase of an already-open bet; don't guess at speech-transcribed project names — pass them to the PC specialist to verify against real folders.
- note: Founder asked to upload "תהילים" + "תהורה" as private repos "in an orderly way with the team." Added P3 (PCI-04/05/06) to the existing pc-production-inventory board; delegated locate to 34-pc-ops and Linear update to 32-delivery-lead; asked founder for PIN to unlock the actual repo-creation/push step.

### 2026-09-09 (later, +5)
- task: Founder — new explicit ask: review his entire GitHub account (private+public, small+large), give an opinion on which repos are no longer relevant, "go through them, learn them."
- do: Explicit named work → `DELEGATE` immediately, no waiting for «אשר». `git fetch`/merged a parallel run's P3 (tehillim/tehora) commit that landed while this turn was in progress *before* writing anything, then added my own work as a new phase (P4, PCI-07/08/09) on the *same* existing bet/board instead of reusing P3/PCI-04-06 ids that the parallel run had already claimed for a different, unrelated request — avoided an ID collision that would have silently corrupted the board. Ran a live `gh repo list ZionAmar` myself only to ground the handoff packet with real numbers (18 repos visible via the Cursor GitHub App token this session); did not attempt the actual classification/relevance judgment myself — that stays with `32-delivery-lead`.
- dont: Don't assume the local checkout is current before adding a new phase to a shared board — push without fetching first would have either been rejected or, worse, force-overwritten a parallel run's real work. Don't report a repo count to the founder without reconciling it — this session's live count (18) disagrees with `factory.json.cursorGithubRepoCount` (49); flagged as `knownDiscrepancy`/`cursorGithubRepoCountNote` instead of picking one number and repeating it as fact. Don't write a ledger entry from guessed conversation timestamps without checking whether a parallel run already logged the same turn more accurately — my first draft of this entry duplicated/mis-timed turns the other run had already logged correctly; caught it on fetch and rewrote to only append what was genuinely missing.
- note: `agents/32-delivery-lead/inbox/2026-09-09_pci-07-09-github-relevance-review.md` sent. P3 (tehillim/tehora, owned by the parallel run) left untouched. `ops/config/factory.json` activeWork now `phase: P3+P4`, `owner: 34-pc-ops, 32-delivery-lead`.

### 2026-09-09 (later, +6)
- task: A visible Telegram turn gave the founder a first-draft breakdown of the GitHub relevance review (DevOps sort + "Code Review" + PM-summary-by-me) with an invented placeholder role id (`code-review-id`) that does not exist on `_company/ROSTER.md`. Founder caught it, correctly noted Keshet (`32-delivery-lead`) already runs the whole dev/SaaS pipeline and should navigate his own team, and explicitly told Noa: check with him first, don't just answer me straight away, know what you're saying.
- do: Before answering a "who should do this" question, `git fetch`/pull first — a parallel Cloud turn had *already* assigned this exact work to Keshet as owner (PCI-07/08/09, committed 15:34Z) before this visible reply was drafted; the fix was to surface and confirm that existing git-tracked reality to the founder, not invent a fresh breakdown from scratch. When a founder says "check with X first, don't just tell me", that means: send X a real, evidenced question and hold the founder-facing answer until X's outbox lands — not answer immediately with a guess of what X would say.
- dont: Never invent a role/agent id that isn't in `_company/ROSTER.md` (no generic "code-review-id", "devops-id" etc.) — always use one of the real roster ids or say "I don't have a matching role, here are the closest real ones." Don't treat "you already have an owner assigned" as license to skip an explicit founder request to actually check with that owner — the founder wants evidence of the check (Keshet's own outbox), not Noa's assumption of what Keshet would choose.
- note: Appended the missed thread turns to `ops/founder-channel/ledger.jsonl` (placeholder-breakdown line, founder's Keshet pushback, founder's "תבדקי איתו" line, Noa's confirming reply). Added `agents/32-delivery-lead/inbox/2026-09-09_pci-07-09-confirm-your-team-plan.md` (addendum, not a new packet) asking Keshet to name real roster ids (or confirm solo) and flag if any sub-step would cross into product/`תבנו` territory. Added `PCI-07b` to the board, made `PCI-09` depend on it too, and updated `factory.json.activeWork.waitingFor`/`nudges`. Told the founder the ownership is already Keshet — matches git state from 15:34Z, not a new decision — and that Noa is holding the final confirmation for his own outbox reply instead of guessing on his behalf.

LEARNING:
- do: When a founder says "check with [agent] first, don't just answer me" — send that agent a concrete, evidenced question and hold the founder-facing reply until their outbox lands; never fabricate what they'd say. Always use only real roster ids, never invented placeholder role names.
- dont: Give the founder a specialist breakdown using a made-up role id; assume "an owner is already assigned" satisfies a founder's explicit request to actually check with that owner in person.
- note: Reconciled a visible-thread/git-state split-brain (placeholder DevOps/Code-Review breakdown vs. Keshet already owning PCI-07/08/09 since 15:34Z); confirmed Keshet as owner to the founder and opened PCI-07b so Keshet reports his real team plan before Noa closes the loop.

### 2026-09-09 (later, +7)
- task: Founder — meta-question testing whether Noa actually reasons per request or just answers fast: "what team do we even have, who exactly would you route the GitHub review to, what precisely will you do — put this in order for me."
- do: Before drafting an answer, `git fetch origin main` and diff against local HEAD — found this local checkout was already one push behind (`677744e`, the PCI-07b confirm-your-team-plan turn). Had already independently drafted a duplicate `ops/intake/github-portfolio-review-board.json` + a fresh Keshet inbox brief before fetching; discarded that stash entirely instead of merging two competing artifacts for the same bet once the real state surfaced. Answered the founder with the real roster (`_company/ROSTER.md`) mapped to this specific task, and the real current blocking state (Keshet's outbox still empty — PCI-07b genuinely unanswered), not a guess of what Keshet will say.
- dont: Don't start drafting delegation artifacts from memory of the roster before re-pulling git state, even mid-conversation on the same open task — the "same bet, don't duplicate" rule applies to draft work-in-progress just as much as to committed board files. Don't answer "who is doing this" with anything other than the actual pending/blocking fact when the real answer is "still waiting," even though the founder wants decisiveness.
- note: No new DELEGATE this turn — no new work was named, PCI-07b (Keshet's real team plan) is still the single open blocker before PCI-09 can close. `agents/32-delivery-lead/outbox/` confirmed empty (README only) at reply time.
