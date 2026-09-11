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

  const html = await page.content();
  const bundleMatch = html.match(/assets\/index-[A-Za-z0-9_-]+\.js/);
  const bundleHash = bundleMatch ? bundleMatch[0] : 'unknown';

  let questionsAnswered = 0;
  let reachedResults = false;
  let crashAt = null;
  let error = null;

  // Quiz starts immediately — wait for first question
  await page.waitForSelector('.question-text', { timeout: 10000 });

  for (let q = 1; q <= 10; q++) {
    const questionEl = page.locator('.question-text');
    const qText = await questionEl.textContent().catch(() => '');
    if (!qText || !qText.includes('=')) {
      crashAt = q;
      error = `Expected question ${q}, got: ${qText?.trim() || ''}`;
      break;
    }

    const options = page.locator('.answer-btn');
    if ((await options.count()) < 1) {
      crashAt = q;
      error = `No answer options at Q${q}`;
      break;
    }
    await options.first().click();
    await page.waitForTimeout(300);

    const nextBtn = page.locator('.next-btn');
    if (await nextBtn.count()) {
      await nextBtn.click();
      await page.waitForTimeout(400);
    }
    questionsAnswered++;

    if (await page.locator('#results-screen').count()) {
      reachedResults = true;
      break;
    }
  }

  if (!reachedResults && questionsAnswered < 10) {
    await page.screenshot({ path: path.join(OUT, `fail-run${runId}.png`), fullPage: true });
  }

  return { runId, questionsAnswered, reachedResults, crashAt, error, pageErrors, bundleHash };
}

async function checkStatic(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  const html = await page.content();
  const rtl = html.includes('dir="rtl"');
  const langHe = html.includes('lang="he"');
  const title = html.includes('שאלון') || html.includes('מתמטיקה');

  const viewports = [
    { name: 'mobile', width: 320, height: 640 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 },
  ];
  const responsive = {};
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(URL, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 5);
    responsive[`responsive_${vp.name}`] = !overflow;
    await page.screenshot({ path: path.join(OUT, `viewport-${vp.name}.png`), fullPage: false });
  }

  const network404s = [];
  page.on('response', (r) => {
    if (r.status() === 404) network404s.push(r.url());
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  const favicon = (await page.evaluate(async () => {
    const r = await fetch('./favicon.svg');
    return r.ok;
  }).catch(() => false));

  return { rtl, langHe, title, ...responsive, no404s: network404s.length === 0, favicon, network404s };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'he-IL' });
  const page = await context.newPage();

  const checklist = await checkStatic(page);
  const runs = [];
  for (let i = 1; i <= 3; i++) {
    const p = await context.newPage();
    runs.push(await runGameplay(p, i));
    await p.close();
  }

  const bundleHash = runs[0]?.bundleHash || 'unknown';
  const oldHash = 'assets/index-mKCXMWMT.js';
  const hashChanged = bundleHash !== oldHash;

  const allPageErrors = runs.flatMap((r) => r.pageErrors);
  const reachedResults = runs.some((r) => r.reachedResults);
  const overall = hashChanged && reachedResults ? 'PASS' : 'FAIL';

  const results = {
    url: URL,
    timestamp: new Date().toISOString(),
    bundleHash,
    oldBundleHash: oldHash,
    hashChanged,
    runs,
    checklist,
    pageErrors: [...new Set(allPageErrors)],
    overall,
    summary: hashChanged
      ? reachedResults
        ? 'PASS: new bundle + results reached'
        : `FAIL: new bundle but ${runs.filter((r) => !r.reachedResults).length}/3 runs did not reach results`
      : `BLOCKED: republish not detected — still serving ${oldHash}`,
  };

  await writeFile(path.join(OUT, 'qa-results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
