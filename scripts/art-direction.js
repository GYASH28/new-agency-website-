
/* BRAYRO — editorial interactions. Core nav, pricing, form and particle engine
   remain in site.js. This file only adds purposeful page affordances. */
(()=>{
'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const fine=matchMedia('(pointer:fine) and (min-width: 761px)');
const route=location.pathname.replace(/\/$/,'')||'/';
const current=route==='/index.html'?'/':route.replace(/\.html$/,'');
document.querySelectorAll('.primary-nav a,.site-footer nav a').forEach(link=>{
  let path=new URL(link.href,location.href).pathname.replace(/\/$/,'')||'/';
  if(path===current){link.setAttribute('aria-current','page')}
});
/* The work gallery switches between two authentic screenshots of the SAME client project. */
document.querySelectorAll('[data-case-switch]').forEach(control=>{
  const stage=document.querySelector(control.dataset.caseSwitch||'.case-photo');
  if(!stage)return;
  const buttons=[...control.querySelectorAll('button[data-view]')];
  const select=view=>{
    const next=view==='mobile'?'mobile':'desktop';
    stage.dataset.viewMode=next;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===next)));
  };
  control.addEventListener('click',e=>{
    const target=e.target.closest('button[data-view]');
    if(target && control.contains(target))select(target.dataset.view);
  });
  select('desktop');
});
/* Design exhibit: depth applies to letterforms only, in a tiny range, never to UI controls. */
if(fine.matches && !reduce.matches){
  document.querySelectorAll('.showreel-art').forEach(stage=>{
    const letter=stage.querySelector('.showreel-big');
    if(!letter)return;
    let frame=0;
    stage.addEventListener('pointermove',event=>{
      if(frame)return;
      const box=stage.getBoundingClientRect();
      const x=Math.max(-1,Math.min(1,((event.clientX-box.left)/box.width-.5)*2));
      const y=Math.max(-1,Math.min(1,((event.clientY-box.top)/box.height-.5)*2));
      frame=requestAnimationFrame(()=>{
        frame=0;
        letter.style.setProperty('--art-x',(x*10).toFixed(1)+'px');
        letter.style.setProperty('--art-y',(y*8).toFixed(1)+'px');
      });
    },{passive:true});
    stage.addEventListener('pointerleave',()=>{
      letter.style.removeProperty('--art-x');
      letter.style.removeProperty('--art-y');
    },{passive:true});
  });
}
/* Respect reduced-motion and avoid blank/hidden content in unsupported browsers. */
if('IntersectionObserver' in window && !reduce.matches){
  const targets=[...document.querySelectorAll('.showreel-project,.studio-faq-header,.service-essay-grid,.project-entry')];
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(({target,isIntersecting})=>{
      if(!isIntersecting)return;
      observer.unobserve(target);
      if(target.getBoundingClientRect().top<innerHeight*.25)return;
      target.animate(
       [{opacity:.82,transform:'translate3d(0,20px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],
       {duration:800,easing:'cubic-bezier(.22,1,.36,1)',fill:'none'}
      );
    });
  },{rootMargin:'0px 0px -6% 0px',threshold:.08});
  targets.forEach(el=>observer.observe(el));
}
})();
