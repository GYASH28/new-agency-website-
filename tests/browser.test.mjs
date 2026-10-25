import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const PORT=4174,origin='http://127.0.0.1:'+PORT;
const server=spawn('python3',['scripts/preview.py'],{env:{...process.env,PORT:String(PORT)},stdio:['ignore','pipe','pipe']});
let serverLogs='';
server.stderr.on('data',c=>serverLogs+=c.toString());
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){for(let i=0;i<60;i++){try{if((await fetch(origin)).ok)return}catch{}await pause(250)}throw new Error('Preview server not running: '+serverLogs)}
const errors=[];
let browser;
try{
await ready();
browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on('pageerror',err=>errors.push('JS: '+err.message));
page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(origin))errors.push('HTTP '+r.status()+' '+r.url())});
const routes=['/','/work','/services','/plans','/studio','/contact'];
for(const route of routes){
const response=await page.goto(origin+route,{waitUntil:'networkidle'});
assert.equal(response.status(),200,route);
assert.ok(await page.locator('h1').isVisible(),'Missing title: '+route);
assert.ok(await page.locator('.footer-wordmark').isVisible(),'Missing signature footer: '+route);
assert.ok(await page.locator('nav[aria-label="Main navigation"]').count(),'Missing navigation: '+route);
}
await page.goto(origin,{waitUntil:'networkidle'});
assert.ok(await page.locator('[data-particle-field]').evaluate(c=>c.width>0&&c.height>0),'Signature particle canvas failed to size');
assert.equal(await page.locator('.craft-browser-picture img').count(),2,'Hero must show genuine FakhriMart work on desktop and mobile');
assert.equal(await page.locator('.craft-proof-note').count(),2,'Home must show the two independent experiments');
assert.ok(await page.locator('link[href="/styles/craft-fidelity.css"]').count(),'Art direction CSS missing');
assert.equal(await page.locator('[role="tab"][data-craft-tab]').count(),3);
await page.locator('[data-craft-tab="ai"]').click();
assert.equal(await page.locator('[data-craft-panel="ai"]').isVisible(),true);
assert.equal(await page.locator('[data-craft-panel="web"]').isVisible(),false);
await page.locator('[data-craft-tab="ai"]').press('ArrowRight');
assert.equal(await page.locator('[data-craft-panel="direction"]').isVisible(),true);
await page.locator('[data-craft-tab="web"]').click();

await page.goto(origin+'/work',{waitUntil:'networkidle'});
assert.equal(await page.locator('.case-controls button[data-view]').count(),2,'Portfolio device switcher missing');
const caseStyle=await page.locator('.case-controls button[data-view="desktop"]').evaluate(button=>({radius:getComputedStyle(button).borderRadius,background:getComputedStyle(button).backgroundColor}));
assert.notEqual(caseStyle.radius,'0px','Work device control must be a styled pill, not a default browser button');
assert.notEqual(caseStyle.background,'rgba(0, 0, 0, 0)','Selected device control needs a visible surface');
await page.locator('.case-controls button[data-view="mobile"]').click();
assert.equal(await page.locator('.case-photo').getAttribute('data-view-mode'),'mobile');
assert.equal(await page.locator('.case-controls button[data-view="mobile"]').getAttribute('aria-pressed'),'true');
await page.locator('.case-controls button[data-view="desktop"]').click();
assert.equal(await page.locator('.case-photo').getAttribute('data-view-mode'),'desktop');
await page.goto(origin+'/plans',{waitUntil:'networkidle'});
assert.equal(await page.locator('.studio-faq details').count(),4,'Pricing FAQ missing');
const accordion=page.locator('.studio-faq details').first();
const faqLayout=await page.locator('.studio-faq-header').evaluate(el=>({display:getComputedStyle(el).display,columns:getComputedStyle(el).gridTemplateColumns}));
assert.equal(faqLayout.display,'grid','Pricing FAQ needs a designed editorial grid');
await accordion.locator('summary').click();
assert.equal(await accordion.evaluate(el=>el.open),true,'FAQ does not expand');
await accordion.locator('summary').click();
assert.equal(await accordion.evaluate(el=>el.open),false,'FAQ does not collapse');
await page.locator('[data-market]').selectOption('ae');
assert.equal((await page.locator('[data-price="monthly-starter"]').first().textContent()).trim(),'AED 690/month');
assert.match(await page.locator('[data-offer="monthly-starter"]').getAttribute('href'),/market=ae/);
await page.locator('[data-market]').selectOption('au');
assert.equal((await page.locator('[data-price="monthly-starter"]').first().textContent()).trim(),'A$390/month');
await page.goto(origin+'/contact?offer=ai-workflow-audit&market=ae',{waitUntil:'networkidle'});
assert.equal(await page.locator('#project-type').inputValue(),'AI systems');
assert.match(await page.locator('#form-status').textContent(),/AED 2,490/);
for(const width of [320,390,768,1440]){
await page.setViewportSize({width,height:900});
for(const route of routes){
await page.goto(origin+route,{waitUntil:'domcontentloaded'});
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
if(overflow>3){
 const offenders=await page.evaluate(()=>[...document.querySelectorAll('body *')].map(el=>({element:el.tagName.toLowerCase()+'.'+(el.className?.baseVal||el.className||''),right:Math.round(el.getBoundingClientRect().right),scrollWidth:el.scrollWidth,width:Math.round(el.getBoundingClientRect().width)})).filter(x=>x.right>innerWidth+3).slice(0,12));
 throw new Error('Horizontal overflow on '+route+' at '+width+'px: '+overflow+'px; elements: '+JSON.stringify(offenders));
}
}
}
for(const width of [320,390]){
await page.setViewportSize({width,height:844});
await page.goto(origin,{waitUntil:'networkidle'});
assert.ok(await page.locator('.menu-toggle').isVisible(),'Menu missing at '+width);
await page.locator('.menu-toggle').click();
assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
await page.keyboard.press('Escape');
assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
}
await mkdir('artifacts/previews',{recursive:true});
await page.setViewportSize({width:1440,height:900});
await page.goto(origin,{waitUntil:'networkidle'});
await page.screenshot({path:'artifacts/previews/home-desktop.png'});
await page.screenshot({path:'artifacts/previews/home-desktop-full.png',fullPage:true});
await page.goto(origin+'/work',{waitUntil:'networkidle'});
await page.screenshot({path:'artifacts/previews/work-desktop.png'});
await page.goto(origin+'/services',{waitUntil:'networkidle'});
assert.equal(await page.locator('.practice-grid article').count(),3,'Services principles missing');
assert.equal(await page.locator('.practice-grid').evaluate(el=>getComputedStyle(el).display),'grid');
await page.screenshot({path:'artifacts/previews/services-desktop.png',fullPage:true});
await page.goto(origin+'/plans',{waitUntil:'networkidle'});
await page.screenshot({path:'artifacts/previews/plans-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});
await page.goto(origin,{waitUntil:'networkidle'});
await page.screenshot({path:'artifacts/previews/home-mobile.png'});
await page.screenshot({path:'artifacts/previews/home-mobile-full.png',fullPage:true});
await page.goto(origin+'/work',{waitUntil:'networkidle'});
await page.screenshot({path:'artifacts/previews/work-mobile.png',fullPage:true});
await page.goto(origin+'/plans',{waitUntil:'networkidle'});
await page.screenshot({path:'artifacts/previews/plans-mobile.png',fullPage:true});
assert.deepEqual(errors,[],'Browser JavaScript or resource errors');
console.log('PASS: six editorial routes, portfolio switcher, markets, FAQ, contact, responsive widths 320/390/768/1440, particle canvas, giant footer, menus, and no runtime/HTTP errors.');
}finally{await browser?.close();server.kill('SIGTERM')}
