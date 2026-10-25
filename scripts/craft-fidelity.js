/* BRAYRO — Craft-inspired interactive tableaux.
   Self-hosted, no scroll hijacking, accessible without JavaScript. */
(()=>{
'use strict';
const one=(s,p=document)=>p.querySelector(s),all=(s,p=document)=>[...p.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const wide=matchMedia('(min-width:761px)');
const nav=document.querySelector('.site-header');
let scrollFrame=0;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const depth=all('[data-craft-depth]').map(el=>({el,amount:clamp(parseFloat(el.dataset.craftDepth)||0,-.2,.2)}));
const clouds=all('.craft-cloud');
function update(){
 scrollFrame=0;
 const y=window.scrollY||0;
 nav?.classList.toggle('scrolled',y>35);
 if(reduced.matches||!wide.matches||document.hidden){
   for(const p of depth)p.el.style.setProperty('--craft-depth','0px');
   for(const el of clouds)el.style.setProperty('--craft-float','0px');
   return;
 }
 const scene=one('[data-craft-scene]');
 if(scene){
   const sceneRect=scene.getBoundingClientRect();
   if(sceneRect.top<innerHeight+200 && sceneRect.bottom>-200){
      const delta=innerHeight*.56-(sceneRect.top+sceneRect.height*.5);
      for(const p of depth){
        const px=clamp(delta*p.amount,-28,28);
        p.el.style.setProperty('--craft-depth',px.toFixed(1)+'px');
      }
   }
 }
 const hero=one('.craft-hero');
 if(hero){
  const box=hero.getBoundingClientRect();
  if(box.bottom>-100){
    const offset=clamp(-box.top*.12,-25,45);
    clouds.forEach((el,i)=>el.style.setProperty('--craft-float',(offset*(i?-.65:1)).toFixed(1)+'px'));
  }
 }
}
const schedule=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(update)};
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
reduced.addEventListener('change',schedule);wide.addEventListener('change',schedule);
schedule();
/* Three genuinely usable, keyboard-operable ways to view studio work. */
const tabs=one('[data-craft-tabs]');
if(tabs){
 const buttons=all('[data-craft-tab]',tabs);
 const panels=all('[data-craft-panel]',tabs);
 const setTab=(name,focus=false)=>{
  const chosen=buttons.some(b=>b.dataset.craftTab===name)?name:'web';
  buttons.forEach(button=>{
    const on=button.dataset.craftTab===chosen;
    button.setAttribute('aria-selected',String(on));
    button.tabIndex=on?0:-1;
    if(on&&focus)button.focus();
  });
  panels.forEach(panel=>{panel.hidden=panel.dataset.craftPanel!==chosen});
 };
 tabs.addEventListener('click',event=>{const btn=event.target.closest('button[data-craft-tab]');if(btn)setTab(btn.dataset.craftTab)});
 tabs.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const i=buttons.findIndex(button=>button.getAttribute('aria-selected')==='true');
  const index=event.key==='Home'?0:event.key==='End'?buttons.length-1:(i+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
  event.preventDefault();setTab(buttons[index].dataset.craftTab,true);
 });
 setTab('web');
}
/* Work: real desktop/mobile captures of FakhriMart—no simulated content. */
for(const control of all('[data-case-switch]')){
 const stage=one(control.dataset.caseSwitch||'.case-photo');
 if(!stage)continue;
 const buttons=all('button[data-view]',control);
 const choose=view=>{
  const target=view==='mobile'?'mobile':'desktop';
  stage.dataset.viewMode=target;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===target)));
 };
 control.addEventListener('click',e=>{const button=e.target.closest('button[data-view]');if(button)choose(button.dataset.view)});
 choose('desktop');
}

/* Interactive studio field notes. All three steps remain readable without JS. */
const process=one('[data-process-playbook]');
if(process){
 const board=one('.craft-process-board',process);
 const buttonSet=all('button[data-process-stage]',process);
 const material=Object.freeze({
  listen:{num:'01—03',kicker:'THE STARTING POINT',title:'Start with <em>listening.</em>',desc:"We map the audience, the goal, and what’s getting in the way before touching a single pixel."},
  shape:{num:'02—03',kicker:'THE VISUAL DIRECTION',title:'Give the idea <em>its own voice.</em>',desc:'A distinct story, considered hierarchy, and the right visual materials make the experience feel unmistakably yours.'},
  refine:{num:'03—03',kicker:'THE FINISHING TOUCHES',title:'Make it feel <em>effortless.</em>',desc:'Responsive details, accessibility, and a careful final review turn promising work into something ready to use.'}
 });
 function select(step){
  const next=material[step]?step:'listen',item=material[next];
  buttonSet.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.processStage===next)));
  one('[data-process-number]',board).textContent=item.num;
  one('[data-process-kicker]',board).textContent=item.kicker;
  one('[data-process-title]',board).innerHTML=item.title;
  one('[data-process-description]',board).textContent=item.desc;
  if(!reduced.matches){
   board.classList.remove('is-turning');void board.offsetWidth;board.classList.add('is-turning');
  }
 }
 process.addEventListener('click',e=>{
  const button=e.target.closest('button[data-process-stage]');
  if(button)select(button.dataset.processStage);
 });
 process.addEventListener('keydown',e=>{
  const button=e.target.closest('button[data-process-stage]');
  if(!button||!['ArrowUp','ArrowDown'].includes(e.key))return;
  e.preventDefault();
  const i=buttonSet.indexOf(button),next=buttonSet[(i+(e.key==='ArrowDown'?1:-1)+buttonSet.length)%buttonSet.length];
  next.focus();select(next.dataset.processStage);
 });
}
/* Restrained parallax for only a few authentic screens and a portrait. */
const editorialImages=all('.craft-proof-image img,.craft-founder-image img,.service-case-visual img');
function moveImages(){
 if(reduced.matches||!wide.matches||document.hidden){
  editorialImages.forEach(img=>img.style.setProperty('--craft-image-depth','0px'));return;
 }
 for(const img of editorialImages){
  const host=img.parentElement,box=host.getBoundingClientRect();
  if(box.bottom<-100||box.top>innerHeight+100)continue;
  const dy=innerHeight*.55-(box.top+box.height*.5);
  img.style.setProperty('--craft-image-depth',clamp(dy*.034,-12,12).toFixed(1)+'px');
 }
}
let editorFrame=0;
const scheduleEditorial=()=>{if(!editorFrame)editorFrame=requestAnimationFrame(()=>{editorFrame=0;moveImages()})};
window.addEventListener('scroll',scheduleEditorial,{passive:true});
window.addEventListener('resize',scheduleEditorial,{passive:true});
reduced.addEventListener('change',scheduleEditorial);wide.addEventListener('change',scheduleEditorial);
scheduleEditorial();
/* Soft reveal is additive: content is fully visible before and without this code. */
if(!reduced.matches&&'IntersectionObserver' in window){
 const targets=all('.craft-possibilities-intro,.craft-proof .section-head,.craft-proof-feature,.craft-proof-note,.craft-founder-copy,.craft-path-intro,.service-essay-copy,.practice-top,.studio-story-copy,.pricing-block .section-head,.contact-aside');
 const seen=new IntersectionObserver(entries=>{
  for(const e of entries)if(e.isIntersecting){e.target.classList.add('craft-entered');seen.unobserve(e.target)}
 },{threshold:.07,rootMargin:'0px 0px -24px 0px'});
 targets.forEach(target=>seen.observe(target));
}

})();