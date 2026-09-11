# IDEA-2026-09-11-shana-tova — Shana Tova one-page greeting (founder voice)

## Source
Telegram via Noa — founder request 2026-09-11 ~09:0xZ; publish commitment reaffirmed same thread (~09:1xZ)

## One sentence
דף one-page «שנה טובה» — תמונות מתגלגלות, ברכה חמה בעברית, למטה רק EaseToDev, קישור חי לנייד.

## Full message (founder)
«טוב, אחרי שאתם שמים את זה, לקחו פרויקט חדש, תעשו לי דף, one page כזה, של שנה טובה, עם תמונות יפות, מבחינתי תמונות מגללות אוטומטי, ברכה יפה, לא צריך חסות למטה, אפשר לשים רק את ה-ease to dev, זה הכל, ושיהיה ברכה יפה, שנה של בריאות, הצלחה, וכל הדברים.»

Follow-up: «כמובן שהאתר הזה יפורסם והכל ותיתנו לי לינק חי שעובד»

## Who is it for?
Founder + recipients he shares the link with (family/friends/clients)

## Problem / outcome
Warm, polished Rosh Hashanah greeting page with zero friction — open on phone, feel personal, subtle AZToDev/EaseToDev credit only.

## Constraints
- One page only (no multi-page site)
- Hebrew RTL, mobile-first
- Auto-rotating / carousel images (beautiful stock or curated)
- No sponsor footer — **EaseToDev** branding only at bottom
- Same delivery path as cake-recipe-demo / kids-math-quiz: build → GitHub Pages → live URL
- WIP=1: starts **after** kids-math-quiz EMET-167 QA closes (or explicit founder override)

## Success signal
Founder opens `https://zionamar.github.io/<repo>/` on phone — loads fast, carousel works, blessing reads well, EaseToDev footer present.

## Non-goals
- No login, no backend, no ads, no heavy JS framework unless needed for carousel
- Not mixed into kids-math or cake repos

## Status
**queued** — intake 2026-09-11; founder confirmed live publish expectation 2026-09-11

## Owners (planned)
- 32-delivery-lead — Linear bet + pipeline kickoff
- 14-frontend-engineer — static one-pager + carousel
- 18-devops-platform — GitHub Pages publish (desk bridge, no PC)
- 20-qa-sdet — live QA before Noa sends «מוכן» to founder

## Gate
`new_product` — request action PIN at Keshet kickoff if unlock window not open (productWorkEnabled scope today is cake-recipe-demo only per factory.json note).
