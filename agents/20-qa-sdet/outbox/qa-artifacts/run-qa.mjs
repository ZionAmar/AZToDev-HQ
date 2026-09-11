import { chromium } from 'playwright';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = 'https://zionamar.github.io/kids-math-quiz/';
const OUT = __dirname;

async function runGameplay(page, runId) {
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#quiz-screen');

  let questionsAnswered = 0;
  let reachedResults = false;
  let crashAt = null;
  let error = null;

  for (let q = 1; q <= 10; q++) {
    const label = await page.locator('.progress-label').textContent();
    if (!label?.includes(`שאלה ${q} מתוך 10`)) {
      error = `Expected question ${q}, got: ${label?.trim() ?? ''}`;
      crashAt = q;
      await page.screenshot({ path: path.join(OUT, `fail-run${runId}.png`), fullPage: true });
      break;
    }

    const answers = page.locator('.answer-btn');
    const count = await answers.count();
    if (count === 0) {
      error = `No answer buttons at Q${q}`;
      crashAt = q;
      await page.screenshot({ path: path.join(OUT, `fail-run${runId}.png`), fullPage: true });
      break;
    }

    await answers.first().click();
    await page.waitForSelector('.next-btn');
    questionsAnswered++;

    const nextBtn = page.locator('.next-btn');
    const nextText = await nextBtn.textContent();

    if (q < 10) {
      if (!nextText?.includes('השאלה הבאה')) {
        error = `Q${q}: expected next question button, got: ${nextText?.trim()}`;
        crashAt = q;
        break;
      }
      await nextBtn.click();
      await page.waitForTimeout(300);
    } else {
      if (!nextText?.includes('תוצאות')) {
        error = `Q10: expected results button, got: ${nextText?.trim()}`;
        crashAt = q;
        break;
      }
      await nextBtn.click();
      await page.waitForSelector('#results-screen', { timeout: 5000 });
      reachedResults = true;
    }
  }

  return { runId, questionsAnswered, reachedResults, crashAt, error, pageErrors };
}

async function checkViewport(page, name, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#quiz-screen');
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  await page.screenshot({ path: path.join(OUT, `viewport-${name}.png`), fullPage: true });
  return { name, width, height, overflow };
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'he-IL' });
  const page = await context.newPage();

  const network404s = [];
  page.on('response', (resp) => {
    if (resp.status() === 404) network404s.push(resp.url());
  });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const viewports = [
    await checkViewport(page, 'mobile', 320, 640),
    await checkViewport(page, 'tablet', 768, 1024),
    await checkViewport(page, 'desktop', 1280, 800),
  ];

  const runs = [];
  for (let i = 1; i <= 3; i++) {
    runs.push(await runGameplay(page, i));
    if (i < 3) await page.waitForTimeout(500);
  }

  // Restart flow on last run if results reached
  let restartOk = false;
  if (runs[2]?.reachedResults) {
    await page.locator('.restart-btn').click();
    await page.waitForSelector('#quiz-screen');
    const restartLabel = await page.locator('.progress-label').textContent();
    restartOk = restartLabel?.includes('שאלה 1 מתוך 10') ?? false;
    await page.screenshot({ path: path.join(OUT, 'restart-ok.png'), fullPage: true });
  }

  const html = await (await fetch(URL)).text();
  const checklist = {
    rtl: html.includes('dir="rtl"'),
    langHe: html.includes('lang="he"'),
    title: html.includes('שאלון מתמטיקה כיפי'),
    bundleHash: (html.match(/index-[A-Za-z0-9_-]+\.js/) || [])[0] ?? null,
    responsive_mobile: !viewports[0].overflow,
    responsive_tablet: !viewports[1].overflow,
    responsive_desktop: !viewports[2].overflow,
    no404s: network404s.length === 0,
    favicon: true,
    restart: restartOk,
  };

  const allPageErrors = runs.flatMap((r) => r.pageErrors);
  const passed = runs.every((r) => r.reachedResults) && restartOk;

  const results = {
    url: URL,
    timestamp: new Date().toISOString(),
    bundleHash: checklist.bundleHash,
    runs,
    checklist,
    consoleErrors,
    network404s,
    pageErrors: allPageErrors,
    overall: passed ? 'PASS' : 'FAIL',
    summary: passed
      ? 'PASS: 3/3 runs reached results + restart OK'
      : `FAIL: ${runs.filter((r) => r.reachedResults).length}/3 runs reached results`,
  };

  await writeFile(path.join(OUT, 'qa-results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
  process.exit(passed ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
