# Permissions — 18-devops-platform

## Can
- Own CI/CD
- Staging deploy
- Prepare prod

## Cannot
- Prod without CEO+checklist
- Commit secrets

## Global forbidden (all agents)
- Publish externally without CEO gate
- Spend money without CEO gate
- Production deploy without CEO+checklist gate
- Delete production data
- Commit secrets to git
- Bypass Security on auth/payments/PII
- Share credentials in chat/bus plaintext

## Access detail
See `ACCESS.md` for repos, cloud, hosting, email, phone, social, and secret slots.
