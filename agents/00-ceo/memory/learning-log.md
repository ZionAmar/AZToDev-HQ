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
- task: Founder — «בוא נראה משימה הבאה... איזה עוד פרויקטים משמעותיים קיימים רק על המחשב ולא בגיטאב»
- do: Verify KidNest closure in git/factory.json before replying (it was already done — KNU-01..04, repo pushed); answer new ask on its own terms instead of reopening KidNest; register new job as `proposed` + wait for אשר before delegating (company loop order: plan → אשר → Keshet/Linear → Nadav)
- dont: Re-litigate a closed gate when founder pivots to a new ask; delegate execution before he confirms; invent a comparison to "Tom's company" with no data
- note: KidNest done (https://github.com/ZionAmar/kidnest); new proposed board ops/intake/pc-projects-inventory-board.json (PPI-01/PPI-02) — read-only PC scan for projects not yet on GitHub, gated on founder confirm

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
