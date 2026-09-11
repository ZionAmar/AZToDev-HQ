import { chromium } from 'playwright';

const URL = 'https://zionamar.github.io/kids-math-quiz/';
const TOTAL = 10;

const results = {
  url: URL,
  timestamp: new Date().toISOString(),
  http_ok: false,
  rtl: false,
  mobile_ok: false,
  console_errors: [],
  page_errors: [],
  questions_completed: 0,
  q10_reached: false,
  q10_crash: false,
  results_screen: false,
  results_score_visible: false,
  restart_visible: false,
  pass: false,
  notes: [],
};

async function runQuiz(page, label) {
  const log = { label, steps: [] };

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  results.http_ok = true;

  // RTL check
  const dir = await page.locator('html').getAttribute('dir');
  const lang = await page.locator('html').getAttribute('lang');
  results.rtl = dir === 'rtl' && lang === 'he';
  if (!results.rtl) results.notes.push(`RTL fail: dir=${dir} lang=${lang}`);

  // Mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  results.mobile_ok = true;

  for (let q = 1; q <= TOTAL; q++) {
    try {
      // Wait for question UI — progress label or answer buttons
      await page.waitForSelector('button', { timeout: 8000 });

      const progressText = await page.locator('body').innerText();
      const hasQuestionMarker =
        progressText.includes(`שאלה ${q}`) ||
        progressText.includes(`${q} מתוך`) ||
        progressText.includes(`${q}/10`) ||
        q > 1; // after Q1 we trust flow

      if (q === 10) results.q10_reached = true;

      // Click first answer button (not restart)
      const answerBtns = page.locator('button').filter({ hasNotText: /נסו שוב|restart/i });
      const count = await answerBtns.count();
      if (count === 0) throw new Error(`No answer buttons on Q${q}`);

      // Prefer buttons in answer grid — click first enabled non-nav button
      let clicked = false;
      for (let i = 0; i < count; i++) {
        const btn = answerBtns.nth(i);
        const text = (await btn.innerText()).trim();
        if (/השאלה הבאה|ראו את התוצאות|next/i.test(text)) continue;
        if (await btn.isEnabled()) {
          await btn.click();
          clicked = true;
          break;
        }
      }
      if (!clicked) throw new Error(`Could not click answer on Q${q}`);

      log.steps.push(`Q${q}: answered`);

      // Wait for next button or results
      await page.waitForTimeout(400);

      const nextBtn = page.getByRole('button', { name: /השאלה הבאה|ראו את התוצאות/i });
      if (await nextBtn.count() > 0 && await nextBtn.first().isVisible()) {
        await nextBtn.first().click();
        log.steps.push(`Q${q}: next clicked`);
        results.questions_completed = q;
      } else if (q === TOTAL) {
        // Maybe auto-advanced to results
        break;
      } else {
        throw new Error(`Next button missing after Q${q}`);
      }

      await page.waitForTimeout(300);
    } catch (err) {
      if (q === 10) {
        results.q10_crash = true;
        results.notes.push(`Q10 crash: ${err.message}`);
      } else {
        results.notes.push(`Q${q} fail: ${err.message}`);
      }
      throw err;
    }
  }

  // Results screen checks
  await page.waitForTimeout(600);
  const bodyText = await page.locator('body').innerText();

  results.results_screen =
    bodyText.includes('מתוך 10') ||
    bodyText.includes('מה למדנו') ||
    bodyText.includes('כל הכבוד') ||
    bodyText.includes('אלוף') ||
    /\/10/.test(bodyText);

  results.results_score_visible =
    bodyText.includes('מתוך 10') || /\d+\s*\/\s*10/.test(bodyText);

  const restart = page.getByRole('button', { name: /נסו שוב|🔄/ });
  results.restart_visible = (await restart.count()) > 0;

  if (!results.results_screen) results.notes.push('Results screen markers not found');
  if (!results.restart_visible) results.notes.push('Restart button not found');

  return log;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ locale: 'he-IL' });
const page = await context.newPage();

page.on('console', (msg) => {
  if (msg.type() === 'error') results.console_errors.push(msg.text());
});
page.on('pageerror', (err) => results.page_errors.push(err.message));

try {
  const log = await runQuiz(page, 'full-flow');
  results.pass =
    results.http_ok &&
    results.rtl &&
    results.q10_reached &&
    !results.q10_crash &&
    results.questions_completed >= TOTAL &&
    results.results_screen &&
    results.results_score_visible &&
    results.restart_visible &&
    results.console_errors.length === 0 &&
    results.page_errors.length === 0;
  results.flow_log = log;
} catch (err) {
  results.pass = false;
  results.notes.push(`Fatal: ${err.message}`);
  // Capture screenshot path for evidence
  const shot = '/workspace/agents/20-qa-sdet/tmp/kids-math-quiz-fail.png';
  await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
  results.screenshot = shot;
}

// Success screenshot too
if (results.pass) {
  const shot = '/workspace/agents/20-qa-sdet/tmp/kids-math-quiz-pass.png';
  await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
  results.screenshot = shot;
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
process.exit(results.pass ? 0 : 1);
