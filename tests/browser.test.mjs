import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const PORT = 4174;
const origin = 'http://127.0.0.1:' + PORT;
const server = spawn('python3', ['scripts/preview.py'], {
  env: { ...process.env, PORT: String(PORT) }, stdio: ['ignore','pipe','pipe']
});
let output = '';
server.stderr.on('data', chunk => output += chunk.toString());
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function ready() {
  for (let tries = 0; tries < 60; tries++) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {}
    await delay(250);
  }
  throw new Error('Preview server did not start: ' + output);
}
const errors = [];
let browser;
try {
  await ready();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(origin)) errors.push('HTTP ' + response.status() + ' ' + response.url()); });
  for (const route of ['/', '/work', '/services', '/plans', '/studio', '/contact']) {
    const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    assert.ok(await page.locator('h1').isVisible(), 'No visible h1 on ' + route);
    assert.ok(await page.locator('nav[aria-label="Main navigation"]').isVisible(), 'No navigation on ' + route);
  }
  await page.goto(origin, { waitUntil: 'networkidle' });
  assert.ok(await page.locator('.footer-wordmark').count(), 'Missing giant Brayro footer signature');
  assert.ok(await page.locator('[data-particle-field]').count(), 'Missing original particle art');
  assert.ok(await page.locator('[data-particle-field]').evaluate(c => c.width > 0 && c.height > 0), 'Canvas failed to size');
  await page.getByRole('tab', { name: 'Build' }).click();
  assert.match(await page.locator('.workspace-intro strong').textContent(), /Beautiful/);
  await page.getByRole('tab', { name: 'Connect' }).click();
  assert.match(await page.locator('.workspace-intro strong').textContent(), /Intelligence/);
  await page.goto(origin + '/plans', { waitUntil: 'networkidle' });
  await page.locator('[data-market]').selectOption('ae');
  assert.equal((await page.locator('[data-price="monthly-starter"]').first().textContent()).trim(), 'AED 690/month');
  assert.match(await page.locator('[data-offer="monthly-starter"]').getAttribute('href'), /market=ae/);
  await page.locator('[data-market]').selectOption('au');
  assert.equal((await page.locator('[data-price="monthly-starter"]').first().textContent()).trim(), 'A$390/month');
  await page.goto(origin + '/contact?offer=ai-workflow-audit&market=ae', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('#project-type').inputValue(), 'AI systems');
  assert.match(await page.locator('#form-status').textContent(), /AED 2,490/);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(origin, { waitUntil: 'networkidle' });
    assert.ok(await page.locator('.menu-toggle').isVisible());
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 3, 'Horizontal overflow at ' + width + 'px: ' + overflow + 'px');
  }
  await mkdir('artifacts/previews',{ recursive:true });
  await page.setViewportSize({ width:390, height:844 });
  await page.screenshot({path:'artifacts/previews/home-mobile.png', fullPage:false});
  await page.setViewportSize({ width:1440, height:900 });
  await page.goto(origin, { waitUntil:'networkidle' });
  await page.screenshot({path:'artifacts/previews/home-desktop.png', fullPage:false});
  assert.deepEqual(errors, [], 'Browser console or local HTTP failures');
  console.log('PASS: six routes, responsive menus, offer pricing, contact preselection, and no JS/local HTTP errors.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}