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
### 2026-09-09
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

- task: Founder — «יש הרבה הנתקות/טיימאוט, תרשמו בבעיות שלכם, תלמדו, יש לכם מנגנונים — תשתמשו בהם» + «מי יותר טוב, אנחנו או תום?» + next task: scan desktop for projects not on GitHub.
- do: Turn a founder complaint into a real file same turn — PROB entry + concrete rule appended to `failure-handling.md`/`COMPANY_LOOP.md` (persist-before-turn-ends, read-before-ask, 3-strikes on loop-backs), not just a verbal apology. Answer comparison questions honestly with no fabricated numbers when no real benchmark exists. Execute a founder ORDER (PC scan) immediately without waiting for a separate «אשר» — the order itself is the confirmation.
- dont: Let a mechanism (ledger/board) exist in git but sit unused while the same loop repeats; don't invent a comparison verdict against "תום" with no data.
- note: PROB-2026-09-09-1788961972584 written; failure-handling.md + COMPANY_LOOP.md updated with anti-loop rule; activeWork moved to pc-repo-inventory-scan; DELEGATE 34-pc-ops (PRI-01/02) opened; ledger appended through 13:51.

### 2026-09-08
- He asked for standing person URLs. Cursor Cloud does not provide them. Don’t promise a permanent `cursor.com/agents` room per name.
- He correctly suspected one model wearing hats. Treat DELEGATE as the only proof of a second run.
