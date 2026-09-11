import { chromium } from 'playwright';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = 'https://zionamar.github.io/shana-tova-greeting/';
const OUT = path.join(__dirname, 'shana-tova');

const EXPECTED_SVGS = [
  'assets/pomegranate.svg',
  'assets/honey-apple.svg',
  'assets/shofar.svg',
  'assets/honeycomb.svg',
  'assets/wheat-sheaf.svg',
  'assets/candles.svg',
];

const BLESSING_KEYWORDS = ['בריאות', 'הצלחה', 'שגשוג', 'שלווה'];

async function checkStatic(page) {
  const network404s = [];
  const consoleErrors = [];
  page.on('response', (r) => {
    if (r.status() === 404) network404s.push(r.url());
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  await page.goto(URL, { waitUntil: 'networkidle' });

  const html = await page.content();
  const rtl = html.includes('dir="rtl"');
  const langHe = html.includes('lang="he"');
  const titleOk = html.includes('שנה טובה');
  const footerText = await page.locator('.site-footer').textContent();
  const footerEaseToDevOnly =
    footerText?.includes('EaseToDev') &&
    !footerText?.match(/sponsor|חסות|AZToDev/i);
  const blessingText = await page.locator('.hero-blessing').textContent();
  const blessingKeywords = BLESSING_KEYWORDS.every((kw) =>
    blessingText?.includes(kw)
  );

  const slideCount = await page.locator('.carousel-track .slide').count();
  const carouselExists = (await page.locator('#carousel').count()) > 0;

  const viewports = [
    { name: 'mobile', width: 320, height: 640 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 },
  ];
  const responsive = {};
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(URL, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 5
    );
    responsive[`responsive_${vp.name}`] = !overflow;
    await page.screenshot({
      path: path.join(OUT, `viewport-${vp.name}.png`),
      fullPage: false,
    });
  }

  return {
    rtl,
    langHe,
    titleOk,
    footerEaseToDevOnly,
    blessingKeywords,
    slideCount,
    carouselExists,
    ...responsive,
    no404s: network404s.length === 0,
    network404s,
    consoleErrors,
  };
}

async function checkCarouselMotion(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#carouselTrack');

  const before = await page.evaluate(() => {
    const track = document.getElementById('carouselTrack');
    return track ? getComputedStyle(track).transform : 'none';
  });

  await page.waitForTimeout(2000);

  const after = await page.evaluate(() => {
    const track = document.getElementById('carouselTrack');
    return track ? getComputedStyle(track).transform : 'none';
  });

  const autoScrolls = before !== after && after !== 'none';

  const toggle = page.locator('#carouselToggle');
  const toggleExists = (await toggle.count()) > 0;
  let pauseWorks = false;
  if (toggleExists) {
    const beforePause = await page.evaluate(() => {
      const track = document.getElementById('carouselTrack');
      return track ? getComputedStyle(track).animationPlayState : '';
    });
    await toggle.click();
    await page.waitForTimeout(500);
    const afterPause = await page.evaluate(() => {
      const track = document.getElementById('carouselTrack');
      return track ? getComputedStyle(track).animationPlayState : '';
    });
    pauseWorks =
      beforePause !== afterPause ||
      (await toggle.getAttribute('aria-pressed')) === 'true';
  }

  await page.screenshot({
    path: path.join(OUT, 'carousel-motion.png'),
    fullPage: true,
  });

  return { autoScrolls, toggleExists, pauseWorks, transformBefore: before, transformAfter: after };
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const assetChecks = {};
  for (const asset of EXPECTED_SVGS) {
    const resp = await fetch(`${URL}${asset}`);
    assetChecks[asset] = resp.status;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'he-IL' });
  const page = await context.newPage();

  const checklist = await checkStatic(page);
  const carousel = await checkCarouselMotion(page);

  const svgAll200 = Object.values(assetChecks).every((s) => s === 200);
  const slidesOk = checklist.slideCount >= 6;
  const critical =
    checklist.rtl &&
    checklist.langHe &&
    checklist.titleOk &&
    checklist.footerEaseToDevOnly &&
    checklist.blessingKeywords &&
    checklist.no404s &&
    svgAll200 &&
    slidesOk &&
    checklist.carouselExists &&
    carousel.autoScrolls &&
    carousel.toggleExists &&
    checklist.responsive_mobile &&
    checklist.responsive_desktop;

  const overall = critical && checklist.consoleErrors.length === 0 ? 'PASS' : 'FAIL';

  const results = {
    url: URL,
    timestamp: new Date().toISOString(),
    repo: 'ZionAmar/shana-tova-greeting',
    commitSha: 'cdf6759',
    pushedAt: '2026-09-11T13:41:15Z',
    assetChecks,
    checklist,
    carousel,
    overall,
    summary: overall === 'PASS'
      ? 'PASS: live Shana Tova page — RTL, blessing, carousel, EaseToDev footer, all assets 200'
      : `FAIL: see checklist/carousel/assetChecks for details`,
  };

  await writeFile(
    path.join(OUT, 'qa-results.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
  process.exit(overall === 'PASS' ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
