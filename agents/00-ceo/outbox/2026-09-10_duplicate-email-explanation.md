# 2026-09-10 — תשובה לציון: «למה זה נשלח פעמיים»

**Trigger:** «למה זה נשלח פעמיים» (אחרי שליחת מיפוי גיטהאב למייל)
**Role:** 00-ceo (נועה) — triage + founder reply. No specialist execution.

## Root cause (verified from thread timeline)

Two distinct duplicate patterns possible; founder message immediately followed Noa's «שלחתי למייל את מיפוי הגיטהאב מאתמול» — primary issue is **parallel send**:

1. **GitHub mapping — double send (bug):**
   - Founder asked to resend yesterday's GitHub repo mapping by email (RTL Hebrew).
   - Ruth delegated to Cloud (`bc-0d3ae0c9`) to locate artifact, format, send.
   - While Ruth still RUNNING, Noa also sent the same content from Keshet's existing 2026-09-09 artifact (message ref `628da7e8-5575-8a7f-7a66-ffdebc72cc4c@gmail.com`) to shorten wait.
   - Result: same deliverable, two senders — founder inbox shows duplicate.

2. **Yesterday company summary — two emails by design (not a bug):**
   - Separate founder asks: (a) «סיכום מתומצת» then (b) «מייל מעוצב יפה» — Ruth sent two different emails per two explicit requests.
   - Mention only if founder meant those, not the GitHub mapping.

## Fix going forward

- For «send again / find yesterday's result»: check artifact exists → **one** send path only (either fast resend OR Ruth, never both).
- Cancel or do not launch Ruth if Noa/desk already sent from archive.
- Record standing lesson: `ops/company-lessons.md#2026-09-10_parallel_email_send`.

## Status

- No re-delegate. No second email. Explanation only.
- Ruth run `bc-0d3ae0c9` may have completed a third send if still running — founder should ignore duplicates; no further action unless he asks.
