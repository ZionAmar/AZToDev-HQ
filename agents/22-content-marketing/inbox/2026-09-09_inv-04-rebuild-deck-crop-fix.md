# INV-04 — Rakza deck v2: build from the corrected brief (crop fix included)

**Board:** `ops/intake/inventory-deck-board.json` → `INV-04` (status: `ready`)
**Owner:** you (`22-content-marketing`)
**Priority:** P0
**From:** 32-delivery-lead (קשת)

## Read both files before building, in this order

1. `agents/32-delivery-lead/outbox/2026-09-09_inventory-deck-v2-revision-brief.md` — the slide plan
   (11 slides: title + dashboard, orders, order detail, products, product form, warehouse map,
   warehouse row, team, agent sale, picking, driver). This is the content/order — build from this.
2. `agents/32-delivery-lead/outbox/2026-09-09_inv-04-screenshot-badge-correction.md` — **a correction to
   that brief's QA claim.** The first brief only excluded `screenshots/60-sa-companies.png` as containing
   the old name "איציק סיטונאות". That is not the only contaminated file — the same name is baked into the
   persistent right-hand sidebar shown on every admin/agent/warehouse-manager screenshot, which is 10 of
   the 11 screen slides in the plan (only the driver screenshot is clean).

## Mandatory step before inserting any screenshot into a slide

Crop every screenshot except the driver one to remove the sidebar, using the measured pixel boundary
(not a guess): `crop((0, 0, 1217, 900))` on the original 1440×900 PNGs — keeps the full main content pane,
drops the 223px navy sidebar (icons + tenant badge) on the right.

Applies to: `10-admin-dashboard.png, 11-admin-orders.png, 12-admin-order-detail.png,
13-admin-products.png, 14-admin-product-edit.png, 17-admin-warehouse-map.png,
18-admin-warehouse-row.png, 20-admin-users.png, 30-agent-sales.png, 40-warehouse-pick-list.png,
41-warehouse-order-pick.png`.

Does **not** apply to `50-driver-deliveries.png` — no sidebar present, use as captured.

## Definition of done (unchanged from board, restated)

- New PPTX, RTL, Hebrew, title "ניהול מלאי" (or the product-demo title from the brief — no client/company
  name in the filename or on any slide).
- 11 slides per the brief's order.
- Zero visible instance of "איציק" / "itzik" anywhere — screenshot corners, filename, slide text, speaker
  notes if any.
- Small callouts only on the 5 slides the brief marks — not on every slide.
- Output to `ops/outbox-founder/` (gitignored, as usual) — do not commit the binary PPTX to git.

## Not your blocker, just so you know what happens after you're done

- `34-pc-ops` (Nadav) will pick up the finished PPTX to place it on ציון's desktop and retire the old v1
  there — that's queued for after you finish, not something you need to do.
- Sending the deck by email needs founder PIN — do not send email yourself without it.

## When done

Write your result to `agents/22-content-marketing/outbox/` (dated file) with the PPTX path, slide count,
and confirmation you applied the crop to all 10 flagged screenshots — then update `INV-04` status to
`done` on the board (or note in your outbox for 32-delivery-lead to update it).
