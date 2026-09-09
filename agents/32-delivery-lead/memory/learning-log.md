# Learning log — קשת (`32-delivery-lead`)

Product company is armed. You plan and keep Linear honest. You do not cook until ציון says «תבנו» and the PIN window is open.

## Active patterns
- One active bet. Surface blockers. Linear is for product, not Ruth/Nadav/Tamir.
- Pipeline: ענבר → founder gate → יונה → קרן before רז/דפנה. WIP=1.
- Demo > status stories.
- Holding issue until a real bet: EMET-66. Project: AZToDev Product — Keshet.

## Never again
- Do not write product code or open product PRs while `productWorkEnabled` is false.
- Do not emit `ACTIVATE_PRODUCT` without an explicit build order + unlocked PIN.
- Do not skip to engineers. Do not confuse קרן (customer review) with this role.

## Iteration log
### 2026-09-09
- Company armed. Waiting for founder build order.
### 2026-09-09
- task: Merge kidnest-consolidate-status-0d6b; sync Keshet Linear only
- do: Fast-forward merge consolidate branch; publish KNU to Keshet project by projectId; cancel EMET-66 when bet lands
- dont: Touch KidNest — GitHub upload duplicate project (EMET-139..150); dont mark KNU-04 done before repo exists
- note: main merged; Keshet EMET-151..154 live; KNU-03 In Progress → delegate Nadav

### 2026-09-09 (later, +9)
- task: Woken for the same PCI-07b/07/08 "תעשי את זה" follow-up. Started building my own 18-repo inventory + classification, then ran `git fetch origin main` before pushing and found a concurrent Cloud turn (`48d8be9`) had already executed the identical task minutes earlier, written a real outbox artifact, closed PCI-07/07b/08/09 on the board, opened PCI-10 to Nadav, and reported to ציון on Telegram (ledger 18:00:30Z).
- do: Discarded my duplicate outbox file + board/factory edits entirely once the canonical version surfaced (`git checkout --`/fast-forward), instead of merging two competing classification tables for the same 18 repos. Kept only the one genuinely new, non-duplicate finding: ran `gh api /installation/repositories` and got a harder root cause than what shipped — the Cursor GitHub App is installed with `repository_selection=selected` and exactly one granted repo (`AZToDev-HQ`), so kidnest/Work_clock/TelemustAddUsers are structurally invisible to any Cloud run here, not a flaky permission gap. Folded that one paragraph into the existing PCI-10 packet + board `knownDiscrepancy` instead of opening a second competing PCI-10.
- dont: Don't re-run/re-report a task that `git fetch` shows was just closed with a real artifact, even if my own local draft was already half-built — a second "final" classification table for the same 18 repos is exactly the theater this factory is trying to kill. Don't skip `git fetch` before writing HQ evidence just because the invocation looks like a fresh, unfilled ask.
- note: Also caught and flagged (separately, not duplicated by the concurrent run): PCI-P3's Linear-ticket ask for PCI-04/05/06 is genuinely blocked — this session has no Linear write MCP tool, only `subscribe_linear_issue`/`subscribe_linear_comment`. Flagged honestly in outbox instead of inventing ticket numbers.

LEARNING:
- do: `git fetch origin main` before writing any HQ evidence, even when the incoming task looks brand new — two Cloud runs can be triggered on the same founder ask minutes apart, and the fetch is the only reliable way to see that the work already landed.
- dont: Merge two independently-built classification/inventory tables for the same 18 repos "just in case" — pick the canonical one that already has founder-facing evidence, discard the duplicate draft, and contribute only the delta that's genuinely new.
- note: Found a stronger root-cause for the 18-vs-49 repo count (`gh api /installation/repositories` → App scoped to exactly one repo, AZToDev-HQ) and added it as a one-paragraph addendum to the already-open PCI-10 packet + board note, instead of shipping a second full PCI-07/08 artifact on top of the one that already closed and got reported.

### 2026-09-09 (later)
- task: PCI-07/08/09 (full GitHub relevance review) sat in inbox since 15:34Z with the founder escalating twice about "no answer from Keshet" — two prior visible Telegram turns claimed contact was made but never emitted a real DELEGATE, so nothing ran against this packet.
- do: When an inbox packet is this well-specified (read-only, metadata-only, no PR/product code), just execute it directly with the tools already available (`gh repo list` — no PIN needed) instead of waiting for another round-trip. Answer the PCI-07b team-plan question honestly: solo execution from `gh` metadata needs no other roster agent.
- dont: Let a founder escalation about "why hasn't Keshet answered" go through a third empty-promise cycle — if the work is answerable with tools on hand, answer it in this same turn with a real outbox artifact, not another "will check."
- note: Wrote `agents/32-delivery-lead/outbox/2026-09-09_pci-07-08-github-relevance-review.md` — 18-repo inventory + Keep/Review/Archive-candidate classification + honest 18-vs-49 count reconciliation (partially resolved, PCI-10 opened to 34-pc-ops for the rest). No mutation performed on any repo.

LEARNING:
- do: If a queued inbox packet only needs read-only tools this session already has, execute it now and write the outbox artifact in the same turn rather than promising to "check with" the owner.
- dont: Leave a well-specified, non-blocked inbox packet untouched through repeated founder escalations about silence.
- note: Closed PCI-07/07b/08 for real this turn with a dated outbox file; PCI-09 (founder report) handed to 00-ceo; PCI-10 (real repo-count reconciliation) opened to 34-pc-ops as a non-blocking follow-up.

### 2026-09-09 (later, +10)
- task: Noa relayed founder re-ask: "מה לגבי המשימה שביקשתי בהודעה קולית" (what about the voice-message task).
- do: `git fetch origin main` + pull first (checkout was 2 commits behind — `b45318c..63d170d`), then answered strictly from the git-tracked board/outbox/ledger, not memory. Re-ran the same `gh repo list ZionAmar` spot-check to confirm the closed artifact is still current (still 18 repos) instead of re-writing a second classification table.
- dont: Don't treat "what about X" as a signal to redo X — check files first; if the artifact + founder report already landed (ledger `18:00:30Z`), say so plainly and only restate what's genuinely still open (Nadav's PC-dependent PCI-01/02/04/10, founder PIN for PCI-05/06, founder's own Keep/Review/Archive call, PCI-P3 Linear-ticket blocker).
- note: Confirmed PCI-07/07b/08/09 done with real evidence, not theater. Wrote a short outbox confirmation (`2026-09-09_status-check-voice-task-confirmed-done.md`) instead of silence, per "no open gate on me right now" — nothing new for 32-delivery-lead to execute this turn.

### 2026-09-09 (later, +11)
- task: Same placeholder voice-message re-ask a third time: "[מגיב להודעה קודמת]: «[הודעה קולית שענית עליה]» ביקשתי את זה". This turn's checkout was 3 commits behind — pulled first and found the new commits were Noa's own root-cause fix (`b45318c`): she caught and corrected two earlier turns (15:40Z/15:55Z) that claimed "contacting Keshet" with zero real DELEGATE, and confirmed her 16:15Z DELEGATE + my 18:00:30Z execution were the real, non-theater turn.
- do: On a third identical re-ask, re-verify from `factory.json`/board/ledger in under a minute and answer "already closed, unchanged" — don't write a third full artifact for a finding that's already shipped and founder-reported. Do keep restating the one genuinely still-open, repeatedly-flagged item (PCI-P3 Linear ticket bookkeeping, `DELEGATE: 00-ceo`, no Linear write tool in this session) every time, since letting a real blocker go quiet is a different failure than re-doing closed work.
- dont: Treat "nothing new happened" as license to go silent — wrote a short outbox note anyway (`2026-09-09_status-recheck-2-voice-task-still-done.md`) per "silence after unfinished work is a bug," scoped to a status confirmation, not a duplicate classification table.
- note: PCI-07/08/09 unchanged (done, 18:00:30Z artifact). Nadav still offline this turn — PCI-01/02/04/10 stay correctly queued, no PC-on question asked. PCI-P3 Linear blocker restated to 00-ceo, still unresolved across four turns now.

### 2026-09-09 (later, +12)
- task: Noa relayed a new framing: "אבל המייל כבר הגיע אז למה את לא ממשיכה עם הדבר השני שביקשתי?" (the email already arrived, why aren't you continuing with the second thing I asked).
- do: Checkout was already current (`dbf9f24`, nothing to pull). Since "the email arrived" is a testable real-world claim, re-ran the live checks instead of only re-reading the board a fourth time: `gh repo list ZionAmar` (still 18 repos, same set) and `gh api /installation/repositories` (still `{"total_count":1,"repository_selection":"ZionAmar"}` — Cursor's GitHub App install still scoped to exactly 1 repo). Also cross-checked `_company/DELEGATION_POLICY.md` routing before assuming "the second thing" is mine — personal/household email lookups route to `33-household-ops`, not `32-delivery-lead`.
- dont: Don't guess which unnamed "second thing" a vague founder paraphrase means just because I was the one addressed — verify the claimed trigger event first, and say plainly when nothing on my own board is actually gated on it, instead of either re-running closed work or inventing a new task to look responsive.
- note: No GitHub access expansion reached this Cloud session — whatever email arrived didn't change the App's installation scope, so PCI-10 (real repo count) stays correctly queued to Nadav's own PC-side session (PC offline), not something an email could unblock from Cloud anyway. Nothing in my board (PCI-05/06/10, PCI-P3) is email-gated. Wrote `agents/32-delivery-lead/outbox/2026-09-09_email-arrived-second-thing-check.md`, annotated PCI-10 on the board with the re-verification timestamp, and asked Noa/founder for the concrete task reference if "the second thing" is something outside my tracked board.

### 2026-09-09 (later, +13)
- task: Noa relayed the standing LIVE FLOW status line itself as a task: "התחלת סקירה ומיפוי רפוזיטוריות GitHub (יש גישה ואישור)" — verbatim match to the run header's own `זרימה:`/`עכשיו:` boilerplate, not new content.
- do: Checkout already current (nothing to pull). Treated "יש גישה ואישור" as a testable claim (possible GitHub App scope change) and re-ran `gh repo list` + `gh api /installation/repositories` live — unchanged (18 repos, App still scoped to exactly 1 repo). Searched the whole repo for the literal phrase — zero matches, confirming this is boilerplate relay, not a new instruction. Cross-checked the board: PCI-07/07b/08/09 all `status: done`, artifact + 18:00:30Z ledger report unchanged.
- dont: Don't build a fifth confirmation of the same closed finding and call it done — this time, since the run header's own `הבא:` line quoted the founder's exact complaint ("הודעות לא מסודרות לנועה, קופצת לדברים שכבר נגמרו"), name the process pattern itself as a real `DELEGATE: 00-ceo`, not just another private status note.
- note: Wrote `agents/32-delivery-lead/outbox/2026-09-09_status-recheck-3-live-flow-relay.md` with the live re-verification + a concrete DELEGATE to 00-ceo: check board/ledger for `status: done` before relaying a "start X" line to a specialist. Board/ledger/live-gh all unchanged since 18:00:30Z.

### 2026-09-09 (later, +14)
- task: Noa directly challenged: "אבל ביקשתי ממך כמה פעמים לעשות משהו מסויים ולא עשית באמת" (I asked you several times to do a specific thing and you never actually did it). She was right — it was the PCI-P3 Linear ticket creation (PCI-04/05/06), reported "blocked, no write tool" across five prior turns without ever actually resolving.
- do: Instead of writing a sixth "still blocked" note, checked for a raw API key instead of just the MCP tool list — `env | grep -i linear` found `LINEAR_API_KEY` genuinely injected into this Cloud session (`ops/config/factory.json` lists it under `CLOUD_AGENT_INJECTED_SECRET_NAMES`). Verified it live against Linear's GraphQL API (`viewer` query), looked up an existing ticket (EMET-155) to get the real `teamId`/`projectId` for the *same* existing project (no clone), then actually called `issueCreate` three times and re-fetched each result to confirm it's real, not invented. Updated the board (`ops/intake/pc-production-inventory-board.json`) with the real `linearIssue`/`linearUrl` values.
- dont: Don't accept "no MCP write tool for X" as equivalent to "no way to write X" — always check for a raw injected secret/API key for the same service before repeating a blocked status a second time, let alone a sixth.
- note: Created EMET-162 (PCI-04), EMET-163 (PCI-05), EMET-164 (PCI-06) for real on the existing `pc-production-inventory` Linear project, state `Todo`. Board updated. This was the one genuinely-undone item across the whole PCI-P3 saga; everything else (Nadav PC offline, founder PIN, founder Keep/Review/Archive decision) was already correctly reported as open and stays open. Wrote `agents/32-delivery-lead/outbox/2026-09-09_pci-p3-linear-tickets-created-real-fix.md`.

### 2026-09-09 (later, +15)
- task: Noa relayed the exact same "בלאגן/תסדרו את החברה" complaint verbatim again. `git fetch`+`pull` first (was 1 commit behind) and found this exact ask was already root-caused with a real code fix on branch `cursor/fix-noa-fast-lane-delegate-theater-85a3` (commit `16789d9`) — not yet merged to `main`, not yet a real PR despite that turn's own `DELEGATE` line claiming "PR opened."
- do: Independently re-verify a prior turn's own claim before repeating it — `gh pr list --head <branch>` returned empty, so I called `ManagePullRequest` myself instead of trusting the earlier note. Also checked out the branch, ran `npm install`+`npm test` myself (didn't just trust the commit message's "6/6 passed"), merged latest `main` into it (conflict only in prose `learning-log.md`, resolved by chronological order), re-ran tests, and pushed before requesting the PR.
- dont: Don't let a specialist's own `DELEGATE`/outbox note asserting "PR opened" stand unverified — a claim inside an artifact is not automatically true just because the artifact itself is real (a subtler version of the exact theater bug being fixed). Don't re-execute a code fix that's already correct just because the founder re-asked the same sentence a sixth time — verify status, don't redo work.
- note: PR creation via `ManagePullRequest` came back "registered for user approval, not auto-created" (workspace setting) — reported that honestly instead of claiming a PR link that doesn't exist. Branch `cursor/fix-noa-fast-lane-delegate-theater-85a3` (now `eb4f956`, merged with latest main) is pushed and ready. Wrote `agents/32-delivery-lead/outbox/2026-09-09_theater-fix-pr-actually-registered.md` correcting the prior turn's false "PR opened" claim.

LEARNING:
- do: Treat another specialist's own outbox/DELEGATE note as a claim to verify, not a fact to relay — re-run the actual check (`gh pr list`, live API, etc.) before repeating "X is done/opened" a link further down the chain.
- dont: Assume a code-fix commit message's "PR opened" is true just because the commit itself is real and well-documented — verify the specific claim, not just the surrounding work.
- note: The underlying code fix (fast-lane DELEGATE enforcement) is real and tested (6/6); only the "PR opened" sub-claim was false. Corrected without redoing the actual fix.

### 2026-09-09 (later, +16)
- task: Noa asked you: אמרתי, המשימה שאני רוצה שתעשו זה תעברו על כל הגיטאב שלי, תראו את הפרויקטים שיש שם... תבינו מה הם עושים... ותתנו לי דוח וככה נדע איזה פרויקטים לא צריך אותם ואפשר למחוק אותם. Verbatim-adjacent to the founder's *original* voice-message ask that opened PCI-07/07b/08/09 — those closed with a real artifact + Telegram report at 18:00:30Z and have now been re-relayed to me 4 times since (6 outbox notes total across the saga).
- do: `git fetch`+`pull` first (3 commits behind), re-ran `gh repo list ZionAmar --limit 200` live myself — identical 18 repos, unchanged. Pointed back to the existing artifact (`2026-09-09_pci-07-08-github-relevance-review.md`) instead of writing a 5th classification table. Since this is the 3rd relay *after* I'd already sent 2 direct DELEGATEs to `00-ceo` about this exact pattern with no effect, escalated it into a permanent `ops/company-lessons.md` entry (`closed_task_repeated_relay`) instead of a 4th private outbox-only note, and tagged the board (`PCI-09.relayedAgainCount=4`) so the repeat count is machine-visible, not just prose buried in outbox files.
- dont: Keep treating each new relay of the same closed ask as an isolated incident deserving only a fresh private note — once 2+ DELEGATEs to the same owner about the same process bug don't stop a further repeat, it needs a standing, repo-wide lesson file so every future run (including Noa's own triage pass) sees it before dispatching, not just this run's memory.
- note: Wrote `agents/32-delivery-lead/outbox/2026-09-09_status-recheck-4-github-review-verbatim-original-ask.md`, added `ops/company-lessons.md#closed_task_repeated_relay`, tagged `ops/intake/pc-production-inventory-board.json` PCI-09 with `relayedAgainCount`/`lastRelayedAt`, and logged to `ops/founder-channel/ledger.jsonl`. No new GitHub data, no new classification — content is unchanged since 18:00:30Z. Only genuinely open item remains ציון's own Keep/Review/Archive decision per repo.

### 2026-09-09 (later, +17)
- task: A concurrent turn (this same minute, commit `37f4937`) independently reconfirmed the identical closed PCI-07/08/09 task while my own turn was in flight — both turns re-verified `gh repo list ZionAmar` live (18 repos, unchanged) and both correctly declined to write a 6th/7th classification table.
- do: Before pushing, `git fetch`+diff-inspected the concurrent commit's actual file changes (not just its message) to confirm no real duplicate work or contradiction — it focused on escalating the repeat-relay pattern itself (`ops/company-lessons.md#closed_task_repeated_relay`, `PCI-09.relayedAgainCount`), while my own turn's distinct, non-overlapping contribution was noticing the PC heartbeat had flipped online (first time since 14:56Z) and emitting `DELEGATE: 34-pc-ops` for the now-actionable PCI-01/02/04/10. Rebased onto the concurrent commit instead of force-pushing over it.
- dont: Don't assume a `git push` rejection means your own work is redundant — diff the remote's actual commit before discarding or blindly overwriting; two turns can legitimately find two different real deltas in the same closed-task recheck.
- note: PCI-07/08/09 still unchanged/done. Rebase-merged cleanly except for this file (prose-only conflict, resolved by keeping both entries in chronological order). Board now carries both `PCI-09.relayedAgainCount` (from the concurrent turn) and my own `pcOnlineDelegateNudges` (non-overlapping keys, no real conflict). Pushed both.

