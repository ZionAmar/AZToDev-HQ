# Company lessons

Failures that must not repeat. Injected into every live agent run.

### 2026-09-11 · publish_ready_not_live_nadav_wrong_route
- do: GitHub Pages publish = desk token («גיטהאב מהשרת»), never Nadav. Before any founder «מוכן/סגור» claim, curl the live JS bundle hash and compare to the fix branch. After founder «יאללה»+PIN on a bet, kick engineers immediately — never reply «מחכים ל-PIN» while HQ ACTION PIN is UNLOCKED.
- dont: Route static site publish to 34-pc-ops; say «התיקון מוכן» when live URL still serves the pre-fix bundle; hold EMET-168 after founder already sent PIN for Shana Tova specifically.
- note: Founder asked «פעם הבאה לא תקרה?» after kids-math Q10 took 3 fix cycles + wrong Nadav routing before 18-devops-platform desk republish landed index-ZmMTvbPf.js; Keshet then held Shana Tova on PIN already received.

### 2026-09-11 · dispatcher_parallel_branch_fragmentation
- do: One bet = one branch. Before starting any fix/status/intake work, `git fetch --all` and check `git branch -r --sort=-committerdate` for an existing in-flight branch on the same bet; continue that branch (or merge it first) instead of opening a new one. When multiple branches already exist for the same bug, pick the most complete one and close/delete the rest — don't add a 4th.
- dont: Let the dispatcher spin up a fresh Cloud run (new branch) for every founder message/status-check on an already-open bet — this produced 24 unmerged `cursor/*` branches in ~4h (05:27Z-09:13Z) for what was really 2 bets (cake-recipe-demo status, kids-math-quiz Q10 bug), including 3 separate branches independently "fixing" the identical Q10 crash and 2 separate branches independently doing the identical Shana Tova intake — none visible to `main`, none aware of each other.
- note: Found live 2026-09-11T09:2xZ by 32-delivery-lead while checking the Shana Tova gate: EMET-167 (kids-math-quiz) QA failed twice (Q10 crash) and a plausible fix exists on branch `cursor/kids-math-quiz-q10-fix-afab` but was never republished (repo `pushed_at` unchanged, live site still serves the crashing build) — main had zero record of any of this. Also found the Shana Tova intake itself (IDEA file + CEO write-up) duplicated across `cursor/shana-tova-intake-60f1` and `cursor/shana-tova-publish-commitment-9ffa`, neither merged. Consolidated the true state onto `main` this run (`ops/config/factory.json`, this file) without attempting a full 24-branch merge (out of scope for a gate-check task; flagging for a dedicated reconciliation pass instead of rushing one and risking new conflicts).

### 2026-09-10 · readability_wrong_batch_direction
- do: When founder approves a single-repo visibility test, reply with one sentence (what / who / when result) — no batch counts, no API jargon; live-check before stating direction (private vs public)
- dont: Conflate a new «make public» test with an old «8 repos private» batch in the same reply — founder said «נורא קורא» when messages mixed wrong count + wrong direction
- note: PIN received for expo-app → public; prior Noa said «8 repos private»; all 9 actually private at 08:44Z; PCI-13 filed

### 2026-09-09 · queued_pc_wip_freeze
- do: Expire queued_pc older than 45m; clear Nadav finish into background-jobs + onWorkFinished
- dont: Leave KNU/Nadav jobs in queued_pc after the real work already finished elsewhere
- note: ~22 stale queued_pc jobs froze WIP=1 so Noa looked stuck

### 2026-09-09 · noa_cloud_timeout
- do: Short/chat/status/compare asks → fast desk LLM; Cloud Noa only for real execute work
- dont: Start a full Cursor Cloud agent for every Telegram line
- note: Founder hit timeout again; learning must be written on timeout, not only on success

### 2026-09-09 · stale_snapshot_status_contradiction
- do: Before any status/live-flow answer, `git fetch/pull origin main` (or otherwise confirm the checkout is current) so activeWork/board reflects the latest committed state, not a baked environment snapshot from before the task was opened.
- dont: Answer "no open tasks" / "nobody is running" from a Cloud run's local checkout without reconciling against the latest git-tracked `ops/config/factory.json` — a stale pre-built snapshot can be hours behind and silently contradict a task another run already opened.
- note: Noa told founder "אין משימות פתוחות" while `activeWork.status` was genuinely `in_progress` (pc-production-inventory, PCI-01/02, waiting on Nadav since 13:40Z) in the git-tracked ledger. Root cause traced to a Cloud run whose checkout likely predated commit `189c70e` that opened the task. Founder read this as "the whole system is dead" — same symptom as the desk↔GitHub gap already logged in PROB-2026-09-09-1788961533370, but a distinct cause (Cloud-side staleness, not desk-side).

### 2026-09-09 · delegate_claim_without_delegate_line
- do: Only say "sending to X / X will answer / I'm following up" in a founder-facing reply when a real `DELEGATE: agentId | task` line is emitted in that exact same reply (or already exists unresolved in the agent's inbox with a fresh nudge). Otherwise say plainly "not yet started" and either send the real DELEGATE now or say what is blocking it.
- dont: Reuse a soothing "I'm on it" phrase across turns while zero DELEGATE lines are emitted — the specialist's inbox packet just sits there and the founder correctly notices nothing moved.
- note: Two consecutive Telegram turns (15:40Z, 15:55Z) told the founder Keshet was being contacted about the GitHub relevance review; no DELEGATE ran either time, so the PCI-07b packet sat untouched in `agents/32-delivery-lead/inbox/` for 40+ minutes. Founder named it directly: "משהו נראה מאוד מבולבל... אני מרגיש לא בטוח."

### 2026-09-09 · concurrent_cloud_ledger_conflict
- do: `git fetch` + `git merge origin/main` (not just push) before committing HQ state files, since two Cloud runs can be triggered minutes apart on the same repeated founder ask. When both edit `factory.json`/ledger, hand-resolve by chronological order and keep both runs' real evidence (don't silently drop one side).
- dont: Force-push or blindly take "ours"/"theirs" on `ops/config/factory.json` or `ops/founder-channel/ledger.jsonl` conflicts — both sides usually contain real, distinct evidence (different nudge timestamps, different transcribed founder lines) that must be merged, not discarded.
- note: Founder repeated the same in_production/Baytor/Worklock/KidNest ask twice ~6 minutes apart; a parallel Cloud run had already re-verified + re-nudged Nadav at 14:50Z and pushed to main before this run's push landed, causing a 3-file merge conflict (factory.json activeWork, ledger.jsonl, learning-log.md). Resolved by interleaving both timelines and keeping one canonical copy of the founder's complaint line (was duplicated with different paraphrasing across the two runs).

### 2026-09-09 · promise_without_artifact_execute_instead
- do: If a DELEGATE line was emitted N turns ago and the owner's outbox is still empty on the next check, and the packet is read-only / tool-doable in this session (no PIN needed) — execute it directly this turn instead of re-promising. Evidence beats a fifth "sending now."
- dont: Keep re-emitting the same DELEGATE line turn after turn while the founder watches the outbox stay empty — that is indistinguishable from the theater it's supposed to fix.
- note: PCI-07/07b/08 had a real DELEGATE recorded at 16:15Z but the outbox was still README-only when the founder said "תעשי את זה" ~1h45m later. Executed directly with `gh repo list ZionAmar` (already available, read-only) and wrote the artifact in the same turn instead of sending a sixth promise.

### 2026-09-09 · closed_task_repeated_relay
- do: Before queuing any specialist Cloud run with a "start X" framing, check that task's own board file (`ops/intake/*-board.json`) and `ops/founder-channel/ledger.jsonl` for an existing `status: done` + sent-to-founder record first. If found, answer from the existing artifact at the dispatcher/Noa layer directly — do not spend a Cloud run + WIP slot re-confirming closed work.
- dont: Relay the founder's original phrasing of a task as if it were new just because he repeated it in a fresh message — a founder re-saying the same sentence does not mean the task reopened; check `status` before dispatching.
- note: The GitHub-repo relevance review (PCI-07/07b/08/09) was closed with a real artifact + founder Telegram report at 18:00:30Z. It was then relayed back to `32-delivery-lead` as a "new" task 8 more times across one session-chain (6 outbox re-confirmations + 2 direct DELEGATEs to `00-ceo` about the relay pattern itself), none of which stopped a further relay. Recorded here as a standing lesson because per-run outbox notes alone were not enough to fix it.

### 2026-09-09 · empty_template_placeholder_relay
- do: When a relayed task quote contains literal unfilled template placeholders (e.g. `[מגיב להודעה קודמת]`, `[הודעה קולית שענית עליה]`) instead of real substituted text, treat it as a distinct dispatcher/template-engine bug — verify all open board items live, state plainly the packet carried zero content, and send a specific substitution-failure `DELEGATE: 00-ceo` instead of guessing which prior task it might mean.
- dont: Don't fold "empty template, no content" into `closed_task_repeated_relay` above — that lesson covers re-sending a *closed* task with real (repeated) founder text. This is a different root cause: the relay carries *no* text at all, which no board/ledger lookup can resolve because there is nothing to match against.
- note: Relay arrived as `[מגיב להודעה קודמת]: «[הודעה קולית שענית עליה]» תעשי את זה` with both bracket fields unfilled. Live re-check (git pull, `gh repo list ZionAmar`, board, activeWork) confirmed nothing changed since the prior turn — no guessed task was executed. Also surfaced that Nadav's PC has been reported ONLINE continuously for ~68 minutes (19:17Z→20:25Z) with zero PCI-01/02/04/10 output; re-nudged `34-pc-ops`. See `agents/32-delivery-lead/outbox/2026-09-09_status-recheck-5-empty-template-relay.md`.

### 2026-09-09 · quoted_cloud_link_check_lessons_first
- do: When the founder quotes a real `cursor.com/agents/bc-...` link as evidence a specialist is/was running, check `ops/company-lessons.md` and the ledger for a matching incident before replying "no such agent exists" — some of these links are real past runs, not hallucinations.
- dont: Imply a founder-provided Cloud link is fake/unverifiable without first searching this repo's own incident log for that exact id.
- note: `bc-f695b210-891e-44ac-b3c9-fe98fa797fbf` (Dafna/frontend, HTML system map) is the same id already logged under `cloud_dispose_killed_dafna` above — a real run that got disposed mid-work, not a live task now. Three replies in a row treated it as unexplained before this was caught.

### 2026-09-10 · parallel_email_send
- do: Before sending email from an archived artifact, check whether a specialist Cloud run for the same deliverable is already RUNNING — pick one path: wait for Ruth, OR send once from archive and do not delegate.
- dont: Launch Ruth to format/send and simultaneously send the same content from the desk/fast path because the founder asked "why is it slow" — that produces duplicate inbox messages.
- note: Founder asked to resend GitHub mapping; Ruth bc-0d3ae0c9 was RUNNING while Noa also sent from Keshet's 2026-09-09 artifact (628da7e8…). Two emails, same content.

### 2026-09-09 · reply_to_voice_was_never_transcribed
- do: When the exact same literal, unfilled template string (e.g. a bracketed placeholder) repeats identically across 3+ founder turns, treat it as a code bug and go read the generating source before drafting another reply — grep `runtime/lib/` for the literal placeholder text.
- dont: Keep answering a broken quoted-voice message ("[מגיב להודעה קודמת]: «[הודעה קולית שענית עליה]»") as if it were a real, readable founder instruction each time, or re-delegate an already-closed task because the visible content is unreadable.
- note: Root cause was `replyContext()` in `runtime/lib/telegram-media.mjs` — it only transcribed the *current* message's own voice via Whisper, but for a *replied-to* voice note it just pushed the static string `[הודעה קולית שענית עליה]`, so no agent could ever see what the founder actually said. Fixed to download+transcribe the replied-to voice the same way; this was feeding the `closed_task_repeated_relay` loop above (repeated GitHub-review relays were largely founder re-quoting an unreadable voice reply, not a fresh ask). Fulfills the `empty_template_placeholder_relay` DELEGATE above from `32-delivery-lead` — same symptom, this is the actual code-level root-cause fix (branch `cursor/fix-voice-reply-quote-bug-b715`, PR request registered, not yet merged).
