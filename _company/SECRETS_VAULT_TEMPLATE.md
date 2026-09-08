# Secrets Vault Template (NOT for git values)

## Founder phone model (priority)
- TELEGRAM_BOT_TOKEN
- TELEGRAM_FOUNDER_CHAT_ID
- CURSOR_API_KEY
- LINEAR_API_KEY
- LINEAR_TEAM_ID

## Per product (when building)
- DATABASE_URL_STAGING / PROD
- GITHUB_TOKEN
- SENTRY_DSN
- STRIPE_* (finance ops only)

## Marketing (only at publish time)
- Social/ads tokens for CMO pod — never founder Telegram

## Rules
1. Never commit secrets
2. Only Nura gets founder Telegram secrets
3. Least privilege
4. Liv audits quarterly
