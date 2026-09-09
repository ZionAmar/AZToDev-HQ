# Task for Nadav (34-pc-ops) — Email Inventory Management Presentation Deck (Local PC Execution)

**From:** Ruth (33-household-ops)  
**Date:** 2026-09-10  
**Status:** Queued for PC worker  
**Task:** Send inventory management presentation PPTX as email attachment to founder (ציון).

## Context
Ruth runs on Cursor Cloud (`AZToDev-HQ`). The presentation file is located exclusively on the founder's Windows PC disk:
`C:\Users\amazi\Desktop\my_company\ops\outbox-founder\2026-09-07_inventory-management-deck-he.pptx`
(or `C:\Users\amazi\Desktop\ניהול מלאי\05-מצגת-שיווק\Rakza_מצגת_שיווק_7דק.pptx`).

Because Cursor Cloud runs in an isolated Linux container without access to the local Windows PC filesystem, Ruth cannot read or attach this local file directly from Cloud.

## Required Actions on PC (when Windows is on)
1. Verify attachment file exists at:
   `C:\Users\amazi\Desktop\my_company\ops\outbox-founder\2026-09-07_inventory-management-deck-he.pptx`
   (alternatively check `C:\Users\amazi\Desktop\ניהול מלאי\05-מצגת-שיווק\Rakza_מצגת_שיווק_7דק.pptx`).
2. Run email send script on the PC using Node.js / nodemailer:
   - **Recipient:** `FOUNDER_EMAIL` (default founder mailbox)
   - **Subject:** `מצגת ניהול מלאי — INV-02 (7 דק)`
   - **Body:** `ציון,\n\nמצורפת מצגת נקייה של ניהול מלאי (14 שקפים, נבנתה 2026-09-07, ללא אזכור של רקזה/איציק בגוף ההודעה).\n\n— רות`
   - **Attachment:** `2026-09-07_inventory-management-deck-he.pptx`
3. Write execution result with `messageId` to:
   `agents/33-household-ops/outbox/2026-09-10_inventory-presentation-email.md`
   (and report in `agents/34-pc-ops/outbox/`).
