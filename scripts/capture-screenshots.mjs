import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const URL = 'http://localhost:8080/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const shots = [
  { name: 'hero-desktop', width: 1440, height: 900, scrollTo: 0, fullPage: false },
  { name: 'experience', width: 1440, height: 900, scrollTo: '#experience', fullPage: false },
  { name: 'menu', width: 1440, height: 900, scrollTo: '#menu', fullPage: false },
  { name: 'about', width: 1440, height: 900, scrollTo: '#about', fullPage: false },
  { name: 'hero-mobile', width: 390, height: 844, scrollTo: 0, fullPage: false },
];

async function preparePage(page) {
  await page.evaluate(() => {
    document.body.classList.add('is-loaded');
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
      el.classList.add('visible');
    });
    document.querySelectorAll('.reveal-line').forEach((el) => {
      el.classList.add('is-visible');
    });
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const suffix = el.dataset.suffix || '';
      el.textContent = `${el.dataset.counter}${suffix}`;
      el.classList.add('is-counted');
    });
  });
}

async function scrollTo(page, target) {
  if (!target || target === 0) {
    await page.evaluate(() => window.scrollTo(0, 0));
    return;
  }
  await page.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ block: 'start' });
  }, target);
}

await mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const page = await browser.newPage();

for (const shot of shots) {
  await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForSelector('.hero-title', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 800));
  await preparePage(page);
  await scrollTo(page, shot.scrollTo);
  await new Promise((r) => setTimeout(r, 400));

  await page.screenshot({
    path: path.join(OUT_DIR, `${shot.name}.png`),
    fullPage: shot.fullPage,
    type: 'png',
  });

  console.log(`Saved ${shot.name}.png`);
}

await browser.close();
console.log('Done.');
