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
