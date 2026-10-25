/* BRAYRO cinematic motion.
   Focused, requestAnimationFrame-throttled, device-aware, no libraries or remote assets. */
(()=>{
'use strict';
const doc=document,root=doc.documentElement;
const $=(s,ctx=doc)=>ctx.querySelector(s),$$=(s,ctx=doc)=>[...ctx.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const wide=matchMedia('(min-width: 761px)');
const header=$('.site-header');
const progress=doc.createElement('span');
progress.className='site-scroll-progress';progress.setAttribute('aria-hidden','true');
header?.append(progress);
const clamp=(a,min,max)=>Math.max(min,Math.min(max,a));
let running=false,visible=true,scrollFrame=0;
const layers=$$('[data-depth]').map(el=>({
el,scene:el.closest('[data-motion-scene]')||el.parentElement,
factor:clamp(Number(el.dataset.depth)||0,-.4,.4),
limit:clamp(Number(el.dataset.depthLimit)||44,6,65)
}));
function paintScroll(){
scrollFrame=0;
const y=window.scrollY||0,range=Math.max(1,doc.documentElement.scrollHeight-window.innerHeight);
root.style.setProperty('--page-progress',(clamp(y/range,0,1)*100).toFixed(2)+'%');
header?.classList.toggle('scrolled',y>40);
if(reduced.matches || !wide.matches || !visible){
for(const entry of layers){entry.el.style.setProperty('--depth-y','0px')}
return;
}
for(const entry of layers){
const box=entry.scene.getBoundingClientRect();
if(box.bottom<-100||box.top>innerHeight+100)continue;
const distance=innerHeight*.52-(box.top+box.height*.5);
const px=clamp(distance*entry.factor,-entry.limit,entry.limit);
entry.el.style.setProperty('--depth-y',px.toFixed(2)+'px');
}
const phone=$('.frame-phone');
if(phone){
const hero=$('.hero-home')?.getBoundingClientRect();
if(hero?.bottom>0 && hero.top<innerHeight){
phone.style.setProperty('--phone-depth',clamp((innerHeight*.55-(hero.top+hero.height*.5))*.065,-21,21).toFixed(2)+'px');
}
}
}
function requestScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(paintScroll)}
window.addEventListener('scroll',requestScroll,{passive:true});
window.addEventListener('resize',requestScroll,{passive:true});
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)requestScroll()});
reduced.addEventListener('change',requestScroll);wide.addEventListener('change',requestScroll);
requestScroll();
// Typographic and image reveal occurs only when an element actually enters view.
// In the absence of an observer, content remains fully visible.
if(!reduced.matches && 'IntersectionObserver' in window){
const observer=new IntersectionObserver(entries=>{
for(const entry of entries){
if(!entry.isIntersecting)continue;
entry.target.classList.add(entry.target.hasAttribute('data-image-reveal')?'motion-image-entered':'motion-entered');
observer.unobserve(entry.target);
}
},{threshold:.08,rootMargin:'0px 0px -24px 0px'});
$$('[data-motion-enter],[data-image-reveal]').forEach(el=>observer.observe(el));
}
// Pointer response is restricted to the home product image, never the entire page.
const stage=$('.hero-display'),device=$('.hero-workframe');
if(stage && device){
const fine=matchMedia('(pointer:fine)');
let tiltFrame=0,targetX=0,targetY=0,currentX=0,currentY=0;
const tick=()=>{
tiltFrame=0;
if(reduced.matches||!wide.matches||!fine.matches||!visible){currentX=0;currentY=0;return}
currentX+=(targetX-currentX)*.17;currentY+=(targetY-currentY)*.17;
device.style.setProperty('--tilt-x',currentX.toFixed(3)+'deg');
device.style.setProperty('--tilt-y',currentY.toFixed(3)+'deg');
if(Math.abs(targetX-currentX)>.01||Math.abs(targetY-currentY)>.01)tiltFrame=requestAnimationFrame(tick);
};
const animate=()=>{if(!tiltFrame)tiltFrame=requestAnimationFrame(tick)};
stage.addEventListener('pointermove',e=>{
if(e.pointerType==='touch'||!wide.matches||reduced.matches)return;
const b=stage.getBoundingClientRect();
const x=clamp((e.clientX-b.left)/b.width-.5,-.5,.5),y=clamp((e.clientY-b.top)/b.height-.5,-.5,.5);
targetX=(-y*2.6);targetY=x*2.6;animate();
},{passive:true});
stage.addEventListener('pointerleave',()=>{targetX=0;targetY=0;animate()});
reduced.addEventListener('change',()=>{targetX=targetY=0;device.style.setProperty('--tilt-x','0deg');device.style.setProperty('--tilt-y','0deg')});
}
// Supaste-inspired interaction principle: let visitors browse two REAL project captures.
// These are alternate views of the same verified work, not fabricated UI demos.
const caseArt=$('.case-photo'),viewSwitch=$('.case-controls');
if(caseArt&&viewSwitch){
const btns=$$('button[data-view]',viewSwitch);
function choose(view){
const next=view==='mobile'?'mobile':'desktop';
caseArt.dataset.viewMode=next;
btns.forEach(btn=>{
const selected=btn.dataset.view===next;
btn.setAttribute('aria-pressed',String(selected));
});
}
viewSwitch.addEventListener('click',e=>{
const button=e.target.closest('button[data-view]');
if(button)choose(button.dataset.view);
});
choose('desktop');
}
})();