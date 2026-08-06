import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import path from 'path';

const url = pathToFileURL(path.resolve('proto.html')).href;
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: CHROME });

// Full-page passes run at DPR 1: a tall page at DPR 2 blows past
// Chromium's 16384px capture limit and stitches in blank regions.
const runs = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
  { name: 'mobile',  width: 390,  height: 844, dsf: 1 },
];

for (const r of runs) {
  const ctx = await browser.newContext({
    viewport: { width: r.width, height: r.height },
    deviceScaleFactor: r.dsf,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(r.name, 'docHeight', h);
  await page.screenshot({ path: `out/${r.name}-full.png`, fullPage: true });
  await ctx.close();
}

// Detail crops at DPR 2 — each is short enough to stay under the limit.
const details = [
  ['hero',      '.hero'],
  ['about',     '#about'],
  ['house',     '#house'],
  ['area',      '#area'],
  ['services',  '#services'],
  ['gallery',   '#gallery'],
  ['reviews',   '.reviews'],
  ['contacts',  '#contacts'],
  ['location',  '#location'],
];
const ctx2 = await browser.newContext({
  viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2,
});
const p2 = await ctx2.newPage();
await p2.goto(url, { waitUntil: 'networkidle' });
await p2.evaluate(() => document.fonts.ready);
await p2.waitForTimeout(400);
for (const [name, sel] of details) {
  await p2.locator(sel).screenshot({ path: `out/d-${name}.png` });
}
await ctx2.close();

await browser.close();
console.log('done');
