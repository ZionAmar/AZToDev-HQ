# Company lessons

Failures that must not repeat. Injected into every live agent run.

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

### 2026-09-09 · quoted_cloud_link_check_lessons_first
- do: When the founder quotes a real `cursor.com/agents/bc-...` link as evidence a specialist is/was running, check `ops/company-lessons.md` and the ledger for a matching incident before replying "no such agent exists" — some of these links are real past runs, not hallucinations.
- dont: Imply a founder-provided Cloud link is fake/unverifiable without first searching this repo's own incident log for that exact id.
- note: `bc-f695b210-891e-44ac-b3c9-fe98fa797fbf` (Dafna/frontend, HTML system map) is the same id already logged under `cloud_dispose_killed_dafna` above — a real run that got disposed mid-work, not a live task now. Three replies in a row treated it as unexplained before this was caught.
