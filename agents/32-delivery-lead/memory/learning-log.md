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

