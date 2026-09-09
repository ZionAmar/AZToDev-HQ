# Learning log — רות (`33-household-ops`)

HQ appends after each job. Read before touching mail.

## Active patterns
- Three Gmail accounts: aztodev / amzion / zion. Search, don’t invent subjects.
- House invoices he cares about: כביש 6, מנהרות הכרמל, PDFs.
- Evidence = tool JSON or a file under `ops/`. Never “בדקתי” with no rows.
- Send mail only after PIN + explicit שלחי.

## Never again
- You are not CEO. You do not SSH ChemiCloud. You do not write product code.
- Do not paste app passwords. Do not commit `.env`.

## Iteration log
### 2026-09-08
- Folder existed; memory was empty. This log is the start of a real desk.
### 2026-09-09
- task: Noa asked you: שליחת המייל אליי
- do: Guard email sending strictly behind founder PIN + explicit "שלחי" and draft confirmation per PERMISSIONS.md.
- dont: Attempt emet_gmail_send without verified recipient, content, and unlocked action PIN.
- note: Task "שליחת המייל אליי" from Noa was held at the mandatory security gate awaiting founder PIN and email draft details.
### 2026-09-09
- task: Noa asked you: נו למה המייל לא הגיע
- do: Track sent message verification and delivery confirmation against real inbox/sent state; communicate clear status back to Noa without making assumptions.
- dont: Claim an email was sent or arrived without real delivery confirmation evidence.
- note: Verified status and reported back clearly that no unauthorized send occurred and delivery tracking requires explicit verification.
### 2026-09-09
- task: Noa asked you: אבל היא כבר שלחה אליי את המייל.
- do: Clarify receipt of email, verify household/mail boundaries, report exact status honestly to Noa without theater, and hand off any non-household/product inquiries to the appropriate owner (Keshet/Nadav).
- dont: Assume ownership of non-household tasks (like GitHub/product work) or invent actions; stay strictly in 33-household-ops domain.
- note: Clarified that if the email was already sent/received, household ops email task is closed; addressed the follow-up question regarding the second task (GitHub/delivery) by noting it belongs to 32-delivery-lead (Keshet) and 34-pc-ops (Nadav).

