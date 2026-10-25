import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const base = process.cwd();
const read = p => readFileSync(resolve(base, p), 'utf8');
const htmlFiles = ['index.html','work.html','services.html','plans.html','studio.html','contact.html'];
test('Every standalone page has a title, accessible main, nav, footer and description', () => {
  for (const file of htmlFiles) {
    const html = read(file);
    assert.match(html, /<!doctype html>/i, file);
    assert.match(html, /<main id="main">/, file);
    assert.match(html, /<title>[^<]+<\/title>/, file);
    assert.match(html, /<meta name="description"/, file);
    assert.match(html, /aria-label="Main navigation"/, file);
    assert.match(html, /<footer /, file);
    assert.match(html, /<h1(?: |>)/, file);
  }
});
test('Internal linked pages and copied brand assets exist', () => {
  for (const path of ['brand/brayro-monogram.svg','brand/logo-horizontal-reverse.svg','assets/fakhrimart-case-desktop.webp','assets/fakhrimart-case-mobile.webp','assets/rae-face.svg','fonts/manrope-latin-variable.woff2','scripts/site.js','styles/site.css','vercel.json']) {
    assert.ok(existsSync(resolve(base, path)), 'Missing ' + path);
  }
  const config = JSON.parse(read('vercel.json'));
  for (const route of ['/work','/services','/plans','/studio','/contact']) {
    assert.ok(config.rewrites.some(rewrite => rewrite.source === route), 'Missing route ' + route);
  }
});
test('No Craft branding or third party asset hotlinks', () => {
  const rendered = htmlFiles.map(read).join('\n');
  assert.doesNotMatch(rendered, /<img[^>]+craft\.do|<script[^>]+craft\.do|<link[^>]+craft\.do/i);
  assert.doesNotMatch(rendered, /lorem ipsum|placeholder\.com/i);
});
test('Approved Indian pricing and contact consent-first flow are retained', () => {
  const plans = read('plans.html');
  for (const value of ['₹2,599/mo','₹3,999/mo','₹5,999+/mo','₹9,999','₹17,999','₹25K–₹35K+','₹29,999']) assert.ok(plans.includes(value), value);
  const site = read('scripts/site.js');
  assert.ok(site.includes('919175524637'));
  assert.ok(site.includes('yashganesh.work@gmail.com'));
  assert.match(site,/form\.reportValidity/);
  assert.doesNotMatch(site, /fetch\(|XMLHttpRequest/);
});
