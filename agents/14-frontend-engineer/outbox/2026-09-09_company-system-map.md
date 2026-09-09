# מפת מערכת AZToDev — דפנה · 2026-09-09

## נתיב
`ops/reports/aztodev-company-system.html`

## מה נמסר
דף HTML עצמאי (Hebrew-first, RTL) שמסביר לציון איך החברה עובדת — בלי React, בלי ChemiCloud deploy. Evidence לביצוע Cloud.

## החלטות עיצוב
- **Brand:** טokens מ-`brand/aztodev/style.css` — זהב `#c9a227`, רקע `#060606`, פונטים Assistant + Heebo.
- **Hero:** מוטו דו-לשוני + pills (נועה, WIP=1, Cloud, ChemiCloud desk).
- **שלוש שכבות:** stack ויזואלי — desk → נועה → מומחים, עם runtime badges.
- **TTS split:** שני עמודים — דק (API→MP3→Telegram) מול מוח (Cloud Agents). Keyboard: focus-visible על TOC links.
- **Telegram lanes:** consult / execute / status + תיבת WIP + remembered-asks (`factory.json`, `waiting-founder.json`).
- **קבצים:** טבלה — inbox/outbox, product repos, Linear, learning-log.
- **רוסטר:** שתי עמודות — ליבה (coreAgents) מול ספסל; באנר קשת + קישור Linear Keshet.
- **תרשים:** ASCII flow ב-`<pre>` — קריא במובייל עם scroll אופקי.

## מצבים
- Standalone — אין JS, אין fetch. נפתח מקומית או מ-GitHub raw.
- Mobile: grid מתקפל לעמודה אחת; layer stack responsive.
- Empty state: N/A — דף תיעוד סטטי.

## מה לא נכלל (בכוונה)
- אין product PR, אין deploy ל-ChemiCloud.
- אין secrets / credentials ב-HTML.
- אין dashboard live data — זה מפת מערכת, לא דשבורד runtime.

## Parse at the boundary
מקורות: `_company/FACTORY.md`, `ROSTER.md`, `COMPANY_LOOP.md`, `DELEGATION_POLICY.md`, `runtime/lib/models.mjs`, `live-status.mjs`, `factory.json`.

## Keyboard works?
כן — TOC links, focus ring זהב, semantic headings, `lang="he" dir="rtl"`.
