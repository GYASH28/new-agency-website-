import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const read=p=>readFileSync(resolve(process.cwd(),p),'utf8');
const pages=['index.html','work.html','services.html','plans.html','studio.html','contact.html'];
test('Every page has its own metadata and one consistent, accessible shell',()=>{
for(const file of pages){
const html=read(file);
assert.match(html,/<!doctype html>/i,file);
assert.match(html,/<main id="main">/,file);
assert.match(html,/<h1(?:\s|>)/,file);
assert.match(html,/<title>[^<]+<\/title>/,file);
assert.match(html,/<meta name="description"/,file);
assert.match(html,/aria-label="Main navigation"/,file);
assert.match(html,/<footer class="site-footer">/,file);
assert.match(html,/class="footer-wordmark"/,file);
assert.match(html,/<a href="#main" class="skip-link">/,file);
assert.match(html,/href="\/styles\/site.css"/,file);
assert.match(html,/src="\/scripts\/site.js"/,file);
assert.doesNotMatch(html,/\/styles\/material-motion\.css|\/scripts\/material-motion\.js|workspace-sidebar|float-note|tile-pink/,file);
}
});
test('Real first-party work and licensed studio assets are local',()=>{
for(const file of ['assets/fakhrimart-case-desktop.webp','assets/fakhrimart-case-mobile.webp','assets/about-yash.webp','brand/brayro-monogram.svg','fonts/manrope-latin-variable.woff2','fonts/instrument-serif-italic.woff2','scripts/site.js','styles/site.css','vercel.json'])assert.ok(existsSync(resolve(process.cwd(),file)),file);
const home=read('index.html'),work=read('work.html');
assert.match(home,/REAL PROJECT|VERIFIED CLIENT PROJECT/);
assert.match(work,/INDEPENDENT EXPERIMENTS/);
assert.match(work,/FakhriMart/);
assert.doesNotMatch(home+work,/<(?:img|script|link)[^>]+craft\.do/i);
});
test('All clean routes are configured',()=>{
const config=JSON.parse(read('vercel.json'));
for(const route of ['/work','/services','/plans','/studio','/contact'])assert.ok(config.rewrites.some(x=>x.source===route&&x.destination===route+'.html'),route);
});
test('Approved market prices and consent-first enquiry are preserved',()=>{
const plans=read('plans.html'),script=read('scripts/site.js');
for(const p of ['₹2,599/mo','₹3,999/mo','₹5,999+/mo','₹9,999','₹17,999','₹25K–₹35K+','₹29,999'])assert.ok(plans.includes(p),p);
assert.match(script,/AED 690\/month/);
assert.match(script,/A\$390\/month/);
assert.match(script,/919175524637/);
assert.match(script,/yashganesh\.work@gmail\.com/);
assert.match(script,/form\.reportValidity\(\)/);
assert.doesNotMatch(script,/fetch\(|XMLHttpRequest/);
});
test('Motion is deliberately contained and respects accessibility',()=>{
const html=read('index.html');
assert.match(html,/<canvas data-particle-field aria-hidden="true">/);
assert.equal((html.match(/data-particle-field/g)||[]).length,1);
assert.match(read('scripts/site.js'),/prefers-reduced-motion/);
assert.match(read('scripts/site.js'),/IntersectionObserver/);
assert.match(read('styles/site.css'),/prefers-reduced-motion/);
assert.doesNotMatch(read('index.html'),/lorem ipsum|placeholder\.com/i);
});

test('Art-direction assets and working editorial elements ship together',()=>{
  for(const file of ['styles/art-direction.css','scripts/art-direction.js'])assert.ok(existsSync(resolve(process.cwd(),file)),file);
  for(const page of pages){
    const html=read(page);
    assert.match(html,/href="\/styles\/art-direction\.css"/,page);
    assert.match(html,/src="\/scripts\/art-direction\.js"/,page);
    assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,page);
  }
  const home=read('index.html'),work=read('work.html'),plans=read('plans.html');
  assert.match(home,/class="showreel-project"/);
  assert.match(home,/REAL PROJECT:/);
  assert.match(work,/data-case-switch="\.case-photo"/);
  assert.match(work,/aria-pressed="false"/);
  assert.match(plans,/class="studio-faq"/);
  assert.match(plans,/<details>/);
  assert.match(read('scripts/art-direction.js'),/prefers-reduced-motion/);
});
