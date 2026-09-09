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
- task: Noa asked you: "ההודעות לא מסודרות... היא קופצת לדברים שכבר נגמרו... כלום לא עובד... משימות לא נסגרות... תסדרו את החברה כמו שביקשתי כבר כמה פעמים."
- do: When the same symptom already has 4 separate `ops/company-lessons.md` entries in one day, stop writing a 5th lesson and read the actual code path — found `runtime/lib/front-desk.mjs`'s fast/chat lane (`fastNoaReply`) never piped its LLM reply through `executeDelegateRelay` the way the Cloud path does, so DELEGATE lines from that lane were silently discarded and false "I'm contacting X" prose had zero enforcement. Fixed by wiring the same choke point + `founderFacingText` into the fast lane.
- dont: Assume a prompt instruction ("don't claim X without DELEGATE") is enforcement — it is not if nothing downstream checks it. Also don't leave a regression test red-and-unrun: found `test-live-status.mjs` already failing on `main` (hard-asserted "no open work" against real live state) because no `npm test`/CI ever ran the six `runtime/scripts/test-*.mjs` files together.
- note: Fixed two more latent regex bugs surfaced by writing real regression tests for this exact incident: (1) `stripFakeSpecialistClaims` used a trailing `\b` that never matches after Hebrew letters in JS regex (ASCII-only `\w`), so claims ending at punctuation were never stripped; (2) `inferRequiredDelegate`'s קשת detector only matched a standalone word, missing the founder's actual sentence "תפני לקשת" (ל-prefix glued on). Added `runtime/scripts/run-tests.mjs` + `npm test`; `6/6 passed`. Did not touch `ops/config/factory.json`/PCI board — PCI-04/05/06/09/10 are still genuinely open, not stale.

LEARNING:
- do: Treat a repeated company-lesson symptom as a signal to open the code, not write another lesson entry — grep for the choke point (delegate-relay/enforcement) that the other, working lane already uses and check the broken lane actually calls it too.
- dont: Ship a "the LLM was told not to" fix for a theater/false-claim bug. Verify with a unit test that reproduces the exact founder sentence from `ops/founder-channel/ledger.jsonl`, not a paraphrase.
- note: `agents/32-delivery-lead/outbox/2026-09-09_fixed-theater-root-cause-fast-lane-delegate-bypass.md` has full detail. Code changed: `runtime/lib/front-desk.mjs`, `runtime/lib/agent-memory.mjs`, `runtime/scripts/test-agent-memory.mjs`, `runtime/scripts/test-company-loop.mjs`, `runtime/scripts/test-live-status.mjs`, new `runtime/scripts/run-tests.mjs`, `package.json` (`npm test`). No product code, no PIN needed — private HQ repo, PR opened.

