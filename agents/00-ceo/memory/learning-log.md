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
