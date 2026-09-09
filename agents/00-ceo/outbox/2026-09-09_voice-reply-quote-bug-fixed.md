# Voice-reply-quote loop — root cause fixed

**At:** 2026-09-09
**File changed:** `runtime/lib/telegram-media.mjs`
**Branch:** `cursor/fix-voice-reply-quote-bug-b715` — pushed to origin this turn.
**PR status:** a PR request against `main` was submitted via the PR tool but this environment's settings do **not** auto-create PRs — it is registered for the founder/HQ to create manually from that branch on GitHub, not yet an actual open PR. (Recording this precisely because a prior turn's "PR opened" claim on a different branch turned out to be false when checked live — not repeating that mistake here.)

## The symptom (why founder kept re-sending the same voice note)

Every time ציון replied to one of his own earlier voice messages and said
"תעשי את זה" / "תעשי את מה שאמרתי בהקלטה", the normalized Telegram text that
reached Noa/Keshet looked like:

```
[מגיב להודעה קודמת]: «[הודעה קולית שענית עליה]»
תעשי את מה שאמרתי פה בהקלטה
```

No agent — Noa, Keshet, or anyone reading the ledger — could ever see what he
actually asked for in the quoted recording. That produced the loop documented
in `agents/32-delivery-lead/outbox/2026-09-09_status-recheck-2-voice-task-still-done.md`
and the `closed_task_repeated_relay` / company-lessons entries: founder thinks
he gave a new instruction, agents can only see an empty placeholder, so they
either re-ask or re-relay an already-closed task (the GitHub repo review,
already delivered in
`agents/32-delivery-lead/outbox/2026-09-09_pci-07-08-github-relevance-review.md`).

## Root cause

`replyContext()` in `runtime/lib/telegram-media.mjs` only transcribed the
**current** message's own voice note (via Whisper). For a **replied-to**
voice note it just pushed the literal string `"[הודעה קולית שענית עליה]"` —
a static placeholder, never replaced with real content. This was a design
gap (missing `downloadFile` + `transcribeVoice` call on `reply_to_message.voice`),
not a template-substitution failure.

## Fix

`replyContext()` is now `async` and, when the replied-to message carries a
voice/audio note, downloads it (`reply-voice.ogg` in the same per-message
inbox dir) and runs it through the existing Whisper transcription path —
identical handling to the current-message voice case. The normalized text
now contains `[תמלול ההקלטה שענית עליה]: <real transcript>` instead of the
placeholder. Falls back to an explicit "transcription failed, type it out"
message only if Whisper actually fails (missing key / API error), never
silently.

Verified with a standalone smoke test mocking Telegram `getFile`/file
download and the OpenAI transcription endpoint — confirmed the real
transcript text now flows into `normalizeFounderTelegramMessage()`'s output
and the old placeholder is gone. `node --check` passes.

## What this does NOT do

- Does not restart or redeploy the ChemiCloud desk process (`aztodev-desk`) —
  that is a deploy action and stays gated on founder approval per
  `_company/DELEGATION_POLICY.md` (ChemiCloud desk is thin, no unsanctioned
  restarts). The desk will pick this up on its normal `git pull` +
  redeploy cycle.
- Does not touch the already-closed GitHub repo review deliverable.
- No product code, no PIN-gated mutation, no spend.
- Does not merge itself to `main` — code fix sits on `cursor/fix-voice-reply-quote-bug-b715` pending a real PR + merge, so it does not silently self-approve a change to the desk's own message pipeline. The desk only picks this fix up once that branch is merged to `main` and it next pulls.
