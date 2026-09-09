# EMET internal name — Linear project rename

**Date:** 2026-09-09  
**Owner:** קשת (`32-delivery-lead`)  
**Founder decision:** EMET = internal product dev arm (not public brand)

## What changed

| Layer | Before | After |
|-------|--------|-------|
| Public brand | AZToDev | AZToDev (unchanged) |
| Delivery lead persona | קשת (Keshet) | קשת (unchanged) |
| Linear project display | AZToDev Product — Keshet | **AZToDev Product — EMET** |
| Linear team | EMET | EMET (unchanged) |

## Linear API confirmation

```json
{
  "data": {
    "projectUpdate": {
      "success": true,
      "project": {
        "id": "045497c9-38c3-4683-896b-bc648d693193",
        "name": "AZToDev Product — EMET",
        "slugId": "938f19d950dd",
        "url": "https://linear.app/my-company1460/project/aztodev-product-emet-938f19d950dd"
      }
    }
  }
}
```

**Project URL (phone):** https://linear.app/my-company1460/project/aztodev-product-emet-938f19d950dd  
**Holding issue:** https://linear.app/my-company1460/issue/EMET-66/armed-wait-for-founder-build-order

## HQ files updated

- `ops/config/factory.json` — `linearProductProject`, `linearProductProjectUrl`
- `_company/FACTORY.md`
- `_company/CORE_CONTEXT.md`
- `_company/PRODUCT_PIPELINE.md`
- `_company/IDENTITY.md` — three-layer naming table
- `agents/32-delivery-lead/SYSTEM_PROMPT.md`
- `agents/00-ceo/SYSTEM_PROMPT.md`
- `hq/lib/cloud-work.mjs`

## Screenshot

Browser without OAuth shows Linear login at project URL (expected). Founder phone (same OAuth account) shows project name **AZToDev Product — EMET**.

![Linear login at project URL](/opt/cursor/artifacts/screenshots/linear-project-emet-rename.png)

## Verify on phone

Open Linear → Projects → **AZToDev Product — EMET**. Issues unchanged (EMET-66 + KSH pipeline).
