# Learning log — רות (`33-household-ops`)

HQ appends after each job. Read before touching mail.

## Active patterns
- Three Gmail accounts: aztodev / amzion / zion. Search, don’t invent subjects.
- House invoices he cares about: כביש 6, מנהרות הכרמל, PDFs.
- Evidence = tool JSON or a file under `ops/`. Never “בדקתי” with no rows.
- Send mail to founder (FOUNDER_EMAIL): no PIN needed. Send mail to external addresses: PIN + explicit שלחי.
- When attachment lives solely on the founder's Windows PC disk (not in Cloud git/filesystem), queue Nadav (`34-pc-ops`) to execute the email send locally rather than failing silently or inventing messageIds.

## Never again
- You are not CEO. You do not SSH ChemiCloud. You do not write product code.
- Do not paste app passwords. Do not commit `.env`.
- Do not pretend an email was sent with attachment if the attachment file was inaccessible from Cloud.

## Iteration log
### 2026-09-08
- Folder existed; memory was empty. This log is the start of a real desk.

### 2026-09-10
- Inventory management presentation deck PPTX email request: attachment resides on founder Windows PC (`C:\Users\amazi\Desktop\my_company\ops\outbox-founder\2026-09-07_inventory-management-deck-he.pptx`), not in Cloud git repo. Queued task to `34-pc-ops` in `nadav-queue.json` and wrote inbox instructions so Nadav dispatches when Windows turns on.
