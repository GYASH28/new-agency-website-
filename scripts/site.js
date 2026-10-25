
/* BRAYRO — coherent visual system. Small interactions only; no third-party runtime. */
(()=>{
'use strict';
const one=(s,r=document)=>r.querySelector(s);
const all=(s,r=document)=>[...r.querySelectorAll(s)];
const nav=one('#primary-nav');
const toggle=one('.menu-toggle');
const close=()=>{if(!nav||!toggle)return;nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu')};
if(nav&&toggle){
toggle.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu')});
nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
document.addEventListener('pointerdown',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))close()});
}
all('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));
const OFFERS=Object.freeze({
'monthly-starter':{name:'Monthly Website Starter',prices:{in:'₹2,599/mo',ae:'AED 690/month',au:'A$390/month'}},
'monthly-growth':{name:'Monthly Website Growth',prices:{in:'₹3,999/mo',ae:'AED 1,190/month',au:'A$690/month'}},
'monthly-studio':{name:'Monthly Website Studio',prices:{in:'₹5,999+/mo',ae:'AED 1,990+/month',au:'A$1,190+/month'}},
'launch-website':{name:'Launch Website',prices:{in:'₹9,999',ae:'AED 2,990',au:'A$1,490'}},
'business-experience':{name:'Business Experience',prices:{in:'₹17,999',ae:'AED 5,990',au:'A$2,990'}},
'premium-experience':{name:'Premium Experience',prices:{in:'₹25K–₹35K+',ae:'AED 9,990–14,990+',au:'A$5,900–8,900+'}},
'ai-workflow-audit':{name:'AI Workflow Audit',prices:{in:'₹9,999',ae:'AED 2,490',au:'A$990'}},
'company-second-brain':{name:'Company Second Brain',prices:{in:'₹29,999',ae:'AED 7,900',au:'A$4,900'}},
'knowledge-care':{name:'Knowledge Care',prices:{in:'₹2,999/mo',ae:'AED 990/month',au:'A$590/month'}}
});
const markets={in:'India',ae:'UAE',au:'Australia'};
const validMarket=m=>Object.prototype.hasOwnProperty.call(markets,m)?m:'in';
const params=new URLSearchParams(location.search);
let market=validMarket(params.get('market'));
if(!params.has('market')){try{market=validMarket(sessionStorage.getItem('brayro-new-market'))}catch{}}
const marketSelect=one('[data-market]');
function setMarket(value){
market=validMarket(value);
all('[data-price]').forEach(el=>{const offer=OFFERS[el.dataset.price];if(offer)el.textContent=offer.prices[market]});
all('[data-offer]').forEach(el=>{const offer=OFFERS[el.dataset.offer];if(!offer)return;el.href='/contact?'+new URLSearchParams({offer:el.dataset.offer,market});el.setAttribute('aria-label','Enquire about '+offer.name+' ('+offer.prices[market]+')')});
if(marketSelect)marketSelect.value=market;
try{sessionStorage.setItem('brayro-new-market',market)}catch{}
}
setMarket(market);
if(marketSelect)marketSelect.addEventListener('change',e=>setMarket(e.target.value));
const form=one('#contact-form');
if(form){
const service=one('#project-type');
const offer=Object.prototype.hasOwnProperty.call(OFFERS,params.get('offer'))?OFFERS[params.get('offer')]:null;
if(offer){
service.value=offer.name.startsWith('Monthly')?'A monthly website':/Workflow|Second Brain|Knowledge Care/.test(offer.name)?'AI systems':'A new website';
one('#form-status').textContent='Interested in '+offer.name+' ('+offer.prices[market]+'). The message is sent only from your email or WhatsApp app.';
}
const serviceParam=params.get('service');
if(serviceParam&&[...service.options].some(option=>option.value===serviceParam))service.value=serviceParam;
const message=()=>{
const d=new FormData(form);
return ['Hello BRAYRO AI,','','I would like to discuss a project.','','Name: '+String(d.get('name')||'').trim().slice(0,80),'Email: '+String(d.get('email')||'').trim().slice(0,120),'Project type: '+String(d.get('service')||''),'Market: '+markets[market],...(offer?['Offer: '+offer.name+' ('+offer.prices[market]+')']:[]),'','Project details:',String(d.get('message')||'').trim().slice(0,1200)].join('\n')
};
const ready=()=>form.reportValidity();
form.addEventListener('submit',e=>{e.preventDefault();if(!ready())return;location.href='mailto:yashganesh.work@gmail.com?subject='+encodeURIComponent('BRAYRO AI — New Project Enquiry')+'&body='+encodeURIComponent(message())});
one('#whatsapp-send')?.addEventListener('click',()=>{if(!ready())return;window.open('https://wa.me/919175524637?text='+encodeURIComponent(message()),'_blank','noopener,noreferrer')});
}
/* One signature only: low-density typography particles contained in the dark studio panel. */
const canvas=one('[data-particle-field]');
if(canvas&&canvas.getContext){
const host=canvas.parentElement,ctx=canvas.getContext('2d',{alpha:true});
if(ctx){
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let width=1,height=1,scale=1,dots=[],progress=0,visible=false,frame=0,last=0,mouse={x:-1000,y:-1000};
let seed=0x7261726f;
const random=()=>{seed+=0x6d2b79f5;let v=seed;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return ((v^(v>>>14))>>>0)/4294967296};
function resize(){
const box=host.getBoundingClientRect();
width=Math.max(1,Math.round(box.width));height=Math.max(1,Math.round(box.height));
scale=Math.min(window.devicePixelRatio||1,2);
canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);
const buf=document.createElement('canvas');buf.width=width;buf.height=height;const b=buf.getContext('2d',{willReadFrequently:true});
if(!b)return;
b.textAlign='center';b.textBaseline='middle';b.fillStyle='white';
const word=width<425?'BR':'BRAYRO';let font=width<425?width*.44:width*.19;
b.font='600 '+font+'px Space,Manrope,sans-serif';
while(b.measureText(word).width>width*.8){font*=.93;b.font='600 '+font+'px Space,Manrope,sans-serif'}
b.fillText(word,width/2,height/2);
const data=b.getImageData(0,0,width,height).data;
const pool=[],step=width<425?5:4;
for(let y=Math.round(height*.15);y<height*.85;y+=step)for(let x=Math.round(width*.07);x<width*.93;x+=step){
if(data[(y*width+x)*4+3]>145)pool.push([x,y]);
}
seed=0x7261726f;
const limit=width<425?540:1100;
dots=[];
const stride=Math.max(1,Math.floor(pool.length/limit));
for(let i=0;i<pool.length;i+=stride){
if(dots.length>=limit)break;
const [tx,ty]=pool[i];const a=random()*Math.PI*2;const r=(.2+random()*.7)*width*.55;
dots.push({x:tx,y:ty,fromX:width*.5+Math.cos(a)*r,fromY:height*.5+Math.sin(a)*r,r:.6+random()*.95,opacity:.4+random()*.55,orange:random()<.11});
}
if(reduced.matches)progress=1;
draw();
}
function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(scale,scale);
for(const p of dots){
const t=progress*progress*(3-2*progress);
let x=p.fromX+(p.x-p.fromX)*t,y=p.fromY+(p.y-p.fromY)*t;
if(!reduced.matches){const dx=x-mouse.x,dy=y-mouse.y;const dist=Math.hypot(dx,dy);if(dist<90&&dist>0){const shift=(1-dist/90)*12;x+=dx/dist*shift;y+=dy/dist*shift}}
ctx.globalAlpha=p.opacity;ctx.fillStyle=p.orange?'#f5a37e':'#dce6e6';ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();
}
ctx.restore();ctx.globalAlpha=1;
}
function paint(now){
frame=0;if(!visible||document.hidden||reduced.matches)return;
progress=Math.min(1,progress+Math.min(50,now-last||16)/1400);last=now;draw();
if(progress<1)frame=requestAnimationFrame(paint);
}
function run(){if(reduced.matches){progress=1;draw();return}if(visible&&!frame&&progress<1){last=performance.now();frame=requestAnimationFrame(paint)}}
function halt(){cancelAnimationFrame(frame);frame=0}
if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting||false;if(visible)run();else halt()},{threshold:.04}).observe(host)}else{visible=true;run()}
if('ResizeObserver' in window)new ResizeObserver(resize).observe(host);else addEventListener('resize',resize,{passive:true});
host.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch')return;const b=host.getBoundingClientRect();mouse={x:e.clientX-b.left,y:e.clientY-b.top};if(progress>=1)draw()},{passive:true});
host.addEventListener('pointerleave',()=>{mouse={x:-1000,y:-1000};if(progress>=1)draw()},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)halt();else run()});
reduced.addEventListener('change',()=>{progress=reduced.matches?1:0;halt();draw();run()});
if(document.fonts?.ready)document.fonts.ready.then(resize);else resize();
}
}
/* Footer wordmark is typographic, not an animation that competes with the content. */
const mark=one('.footer-wordmark');
if(mark&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
mark.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const rect=mark.getBoundingClientRect();mark.style.setProperty('--light-x',((e.clientX-rect.left)/rect.width*100).toFixed(0)+'%')},{passive:true});
mark.addEventListener('pointerleave',()=>mark.style.setProperty('--light-x','50%'),{passive:true});
}

/* Shared motion language: reveal once, and subtle depth only on capable desktops. */
const motionOK=matchMedia('(min-width:761px) and (prefers-reduced-motion:no-preference)');
if(motionOK.matches && 'IntersectionObserver' in window){
  const items=all('.intro-row>div,.section-head,.featured-work,.directory-row,.approach-grid>div,.approach-steps li,.signal-copy,.footer-intro');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  },{rootMargin:'0px 0px -6% 0px',threshold:.08});
  document.documentElement.classList.add('motion-ready');
  items.forEach((el,i)=>{
    if(el.getBoundingClientRect().top<innerHeight*.95){el.classList.add('is-revealed');return}
    observer.observe(el);
  });
  const depth=[
    ['.hero-workframe','--hero-lift',-17],
    ['.featured-image img','--case-lift',-11],
    ['.case-photo>img:first-child','--case-detail-lift',-9],
    ['.footer-wordmark','--footer-lift',-12]
  ].map(([selector,prop,max])=>({el:one(selector),prop,max})).filter(x=>x.el);
  let ticking=false;
  function updateDepth(){
    ticking=false;
    if(document.hidden || !motionOK.matches)return;
    for(const {el,prop,max} of depth){
      const rect=el.getBoundingClientRect();
      if(rect.bottom<0||rect.top>innerHeight)continue;
      const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));
      el.style.setProperty(prop,(max*(progress-.5)*2).toFixed(1)+'px');
    }
  }
  const queue=()=>{if(!ticking){ticking=true;requestAnimationFrame(updateDepth)}};
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',queue,{passive:true});
  motionOK.addEventListener('change',()=>{
    if(!motionOK.matches){document.documentElement.classList.remove('motion-ready');depth.forEach(({el,prop})=>el.style.removeProperty(prop))}
    else{document.documentElement.classList.add('motion-ready');queue()}
  });
  queue();
}

})();
