import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const output = path.resolve('artifacts/browser-qa');
const routes = ['/', '/work', '/services', '/plans', '/studio', '/contact'];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];
const results = [];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small-mobile', width: 320, height: 700 }
];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  for (const route of routes) {
    const target = BASE + route;
    const response = await page.goto(target, { waitUntil: 'networkidle' });
    const name = route === '/' ? 'home' : route.slice(1);
    const stem = viewport.name + '-' + name;
    try {
      assert.equal(response?.status(), 200, 'HTTP error on ' + stem);
      assert.equal(await page.locator('main h1').count(), 1, 'Expected exactly one H1 on ' + stem);
      assert.equal(await page.locator('main h1').isVisible(), true, 'Hidden headline on ' + stem);
      assert.equal(await page.locator('.brand-lockup').isVisible(), true, 'Hidden brand on ' + stem);
      const overflow = await page.evaluate(() => ({
        actual: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth
      }));
      assert.ok(overflow.actual <= overflow.viewport + 3, 'Horizontal overflow on ' + stem + ': ' + JSON.stringify(overflow));
      assert.equal(pageErrors.length, 0, 'JS errors on ' + stem + ': ' + pageErrors.join('; '));
      if (name === 'home' || name === 'plans' || name === 'contact') {
        await page.screenshot({ path: path.join(output, stem + '.png'), fullPage: true, animations: 'disabled' });
      }
      results.push({ viewport: viewport.name, route, status: 'pass' });
    } catch (error) {
      results.push({ viewport: viewport.name, route, status: 'fail', reason: error.message });
      failures.push(stem + ': ' + error.message);
      await page.screenshot({ path: path.join(output, stem + '-FAIL.png'), fullPage: true, animations: 'disabled' });
    }
  }
  if (viewport.width <= 760) {
    try {
      await page.goto(BASE + '/', { waitUntil:'networkidle' });
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator('.nav-links a[href="/work"]').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      results.push({ viewport: viewport.name, route: 'mobile-nav', status: 'pass' });
    } catch (error) {
      failures.push(viewport.name + ' mobile navigation: ' + error.message);
      results.push({ viewport: viewport.name, route:'mobile-nav', status:'fail', reason:error.message });
    }
  }
  await page.close();
}

const logic = await browser.newPage();
try {
  await logic.goto(BASE + '/plans', { waitUntil: 'networkidle' });
  const starter = logic.locator('[data-price="monthly-starter"]').first();
  assert.equal(await starter.textContent(), '₹2,599/mo');
  await logic.locator('#market').selectOption('ae');
  assert.equal(await starter.textContent(), 'AED 690/month');
  assert.match(await logic.locator('[data-offer="monthly-starter"]').getAttribute('href'), /market=ae/);
  await logic.locator('#market').selectOption('au');
  assert.equal(await starter.textContent(), 'A$390/month');
  await logic.goto(BASE + '/contact?offer=monthly-starter&market=au', { waitUntil:'networkidle' });
  assert.equal(await logic.locator('#project-type').inputValue(), 'A monthly website');
  assert.match(await logic.locator('#form-status').textContent(), /A\$390\/month/);
  assert.equal(await logic.locator('#your-name').getAttribute('required'), '');
  assert.equal(await logic.locator('#your-message').getAttribute('required'), '');
  results.push({ viewport: 'functional', route: 'pricing-and-contact', status: 'pass' });
} catch (error) {
  failures.push('pricing/contact: ' + error.message);
  results.push({ viewport: 'functional', route: 'pricing-and-contact', status: 'fail', reason:error.message });
}
await logic.close();
await browser.close();
await writeFile(path.join(output,'results.json'),JSON.stringify({base:BASE,results,failures},null,2));
console.log(JSON.stringify({passed:results.filter(x=>x.status==='pass').length,failed:failures.length,failures},null,2));
if (failures.length) process.exitCode = 1;
