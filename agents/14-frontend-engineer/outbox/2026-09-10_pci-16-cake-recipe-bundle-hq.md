# PCI-16 — cake-recipe-demo bundle on HQ disk

**Agent:** דפנה (`14-frontend-engineer`)  
**Date:** 2026-09-10  
**Context:** PC lane blocked (Cursor shell 0xC0000142). Nadav OFFLINE — bundle committed to HQ so `git pull` works when PC is up.

## Exact paths (HQ repo)

```
agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/index.html
agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/styles.css
agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/README.md
```

**Branch:** `cursor/cake-recipe-demo-bundle-pci16-d25c` (PR to `main`)

**Source:** Recovered from prior Cloud run branch `cursor/cake-recipe-demo-rtl-58ef` — not yet on `main` at run start.

## PC fallback — write locally without git

If `git pull` is blocked, create these three files with the contents below.

---

### FILE: `index.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="מתכון לעוגת שוקולד רכה — דמו סטטי RTL מ-AZToDev"
    />
    <title>עוגת שוקולד רכה — מתכון</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <a class="skip-link" href="#main">דלג לתוכן</a>

    <header class="site-header">
      <div class="container">
        <p class="eyebrow">מתכון ביתי · AZToDev Demo</p>
        <h1>עוגת שוקולד רכה</h1>
        <p class="lead">
          עוגה עשירה ולחה — מושלמת לקפה של שישי בבוקר או לאירוח קטן.
        </p>
        <dl class="meta" aria-label="פרטי המתכון">
          <div>
            <dt>זמן הכנה</dt>
            <dd>20 דק׳</dd>
          </div>
          <div>
            <dt>זמן אפייה</dt>
            <dd>35 דק׳</dd>
          </div>
          <div>
            <dt>מנות</dt>
            <dd>10 פרוסות</dd>
          </div>
          <div>
            <dt>רמת קושי</dt>
            <dd>קל</dd>
          </div>
        </dl>
      </div>
    </header>

    <main id="main" class="container recipe-grid">
      <section class="card" aria-labelledby="ingredients-heading">
        <h2 id="ingredients-heading">מצרכים</h2>
        <ul class="ingredients">
          <li><span class="amount">200 ג׳</span> קמח</li>
          <li><span class="amount">50 ג׳</span> אבקת קקאו</li>
          <li><span class="amount">200 ג׳</span> סוכר</li>
          <li><span class="amount">2</span> ביצים</li>
          <li><span class="amount">120 מ״ל</span> שמן</li>
          <li><span class="amount">240 מ״ל</span> חלב</li>
          <li><span class="amount">1 כפית</span> אבקת אפייה</li>
          <li><span class="amount">1/2 כפית</span> מלח</li>
          <li><span class="amount">1 כפית</span> תמצית וניל</li>
          <li><span class="amount">100 ג׳</span> שוקולד מריר (אופציונלי, לפירור)</li>
        </ul>
      </section>

      <section class="card" aria-labelledby="steps-heading">
        <h2 id="steps-heading">אופן ההכנה</h2>
        <ol class="steps">
          <li>
            <strong>חימום תנור:</strong> מחממים תנור ל־180°C. משמנים תבנית 24 ס״מ
            ומרפדים בנייר אפייה.
          </li>
          <li>
            <strong>ערבוב יבש:</strong> מערבבים בקערה קמח, קקאו, אבקת אפייה
            ומלח.
          </li>
          <li>
            <strong>ערבוב רטוב:</strong> בקערה נפרדת מקציפים ביצים וסוכר עד
            תערובת בהירה. מוסיפים שמן, חלב ווניל.
          </li>
          <li>
            <strong>שילוב:</strong> מערבבים את היבש לרטוב בעדינות — בלי
            להעמיס. אם רוצים, מוסיפים פירורי שוקולד.
          </li>
          <li>
            <strong>אפייה:</strong> יוצקים לתבנית ואופים 30–35 דק׳. שיניים
            נקיות יוצאות יבשות מהמרכז.
          </li>
          <li>
            <strong>מנוחה:</strong> מצננים 15 דק׳ בתבנית, מעבירים לרשת, ומגישים
            פושרת או בטמפרטורת החדר.
          </li>
        </ol>
      </section>

      <aside class="card tip" aria-labelledby="tip-heading">
        <h2 id="tip-heading">טיפ של דפנה</h2>
        <p>
          לעוגה עוד יותר לחה — החליפו חצי מכמות החלב ביוגורט טבעי. לפני
          ההגשה, פזרו אבקת סוכר או ציפו בגנאch שוקולד.
        </p>
      </aside>
    </main>

    <footer class="site-footer">
      <div class="container">
        <p>דמו סטטי RTL · AZToDev · Frontend Engineer (דפנה)</p>
      </div>
    </footer>
  </body>
</html>
```

---

### FILE: `styles.css`

```css
/* Cake Recipe Demo — RTL static page */

:root {
  --color-bg: #faf6f1;
  --color-surface: #ffffff;
  --color-text: #2c1810;
  --color-muted: #6b5344;
  --color-accent: #8b4513;
  --color-accent-soft: #d4a574;
  --color-chocolate: #3d2314;
  --color-tip-bg: #fff8e7;
  --color-tip-border: #e8c547;
  --font-body: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  --font-display: Georgia, "Times New Roman", serif;
  --radius: 12px;
  --shadow: 0 4px 24px rgba(44, 24, 16, 0.08);
  --max-width: 960px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--color-text);
  background: linear-gradient(180deg, var(--color-bg) 0%, #f0e6dc 100%);
  min-height: 100vh;
}

.skip-link {
  position: absolute;
  inset-inline-start: 1rem;
  top: -100%;
  padding: 0.5rem 1rem;
  background: var(--color-accent);
  color: #fff;
  text-decoration: none;
  border-radius: var(--radius);
  z-index: 100;
}

.skip-link:focus {
  top: 1rem;
}

.container {
  width: min(100% - 2rem, var(--max-width));
  margin-inline: auto;
}

.site-header {
  background: linear-gradient(135deg, var(--color-chocolate) 0%, var(--color-accent) 100%);
  color: #fff;
  padding: 3rem 0 2.5rem;
  text-align: center;
}

.eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.site-header h1 {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
}

.lead {
  margin: 0 auto 1.75rem;
  max-width: 36ch;
  font-size: 1.1rem;
  opacity: 0.92;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem 2rem;
  margin: 0;
}

.meta div {
  text-align: center;
}

.meta dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.75;
  margin-bottom: 0.15rem;
}

.meta dd {
  margin: 0;
  font-weight: 600;
  font-size: 1.05rem;
}

.recipe-grid {
  display: grid;
  gap: 1.5rem;
  padding: 2rem 0 3rem;
}

@media (min-width: 720px) {
  .recipe-grid {
    grid-template-columns: 1fr 1.4fr;
    align-items: start;
  }

  .tip {
    grid-column: 1 / -1;
  }
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.75rem;
}

.card h2 {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--color-accent);
  border-bottom: 2px solid var(--color-accent-soft);
  padding-bottom: 0.5rem;
}

.ingredients {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ingredients li {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.45rem 0;
  border-bottom: 1px solid #eee;
}

.ingredients li:last-child {
  border-bottom: none;
}

.amount {
  flex-shrink: 0;
  min-width: 5.5rem;
  font-weight: 600;
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
}

.steps {
  margin: 0;
  padding-inline-start: 1.25rem;
}

.steps li {
  margin-bottom: 1rem;
  padding-inline-start: 0.25rem;
}

.steps li:last-child {
  margin-bottom: 0;
}

.steps strong {
  color: var(--color-chocolate);
}

.tip {
  background: var(--color-tip-bg);
  border: 1px solid var(--color-tip-border);
}

.tip h2 {
  color: var(--color-chocolate);
  border-bottom-color: var(--color-tip-border);
}

.tip p {
  margin: 0;
}

.site-footer {
  padding: 1.5rem 0 2rem;
  text-align: center;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.site-footer p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

---

### FILE: `README.md`

    # cake-recipe-demo

    Static RTL Hebrew cake recipe page — AZToDev frontend demo slice.

    ## Contents

    - `index.html` — semantic HTML, `lang="he"` + `dir="rtl"`
    - `styles.css` — responsive layout, accessible focus/skip link

    ## Local preview

    Open `index.html` in a browser, or:

        python3 -m http.server 8080

    Then visit http://localhost:8080

    ## Deploy

    Hand off to **18-devops-platform** for Docker + GitHub Pages.

---

HANDOFF:
- done: Committed full cake-recipe-demo static bundle (3 files) to HQ on branch `cursor/cake-recipe-demo-bundle-pci16-d25c`; outbox includes raw contents for PC Write fallback.
- next: Nadav pulls branch (or writes from outbox), continues PCI-14/16 — create `ZionAmar/cake-recipe-demo` repo and push bundle when PC Cursor shell is fixed.
- files: agents/14-frontend-engineer/outbox/cake-recipe-demo-bundle/{index.html,styles.css,README.md}, agents/14-frontend-engineer/outbox/2026-09-10_pci-16-cake-recipe-bundle-hq.md

DELEGATE: 34-pc-ops | PCI-16: `git pull` branch `cursor/cake-recipe-demo-bundle-pci16-d25c` (or merge PR), copy bundle from HQ paths above into local workspace; if git blocked use raw contents in this outbox. Then continue PCI-14 repo create + push.

LEARNING:
- do: When PC lane is blocked, duplicate Cloud artifacts onto HQ main-track branch + paste raw file bodies in outbox so Nadav can Write without checkout.
- dont: Assume prior feature branch is on main — always verify with glob/git before claiming paths exist on disk.
- note: Bundle recovered from `cursor/cake-recipe-demo-rtl-58ef`, committed fresh for PCI-16 HQ handoff.
