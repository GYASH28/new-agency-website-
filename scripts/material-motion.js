/* BRAYRO / Material & Motion. Canvas art is original and only decorates accessible HTML. */
(() => {
'use strict';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const homeWorkspace = document.querySelector('.workspace');
if(homeWorkspace) {
  const intro = homeWorkspace.querySelector('.workspace-intro');
  const cards = homeWorkspace.querySelector('.workspace-cards');
  if(intro && cards) {
    const modes = [
      { key:'imagine', tab:'Imagine', label:'THE CREATIVE SPACE', title:'Everything starts somewhere.', note:'From a scattered thought to a thoughtfully built experience.'},
      { key:'build', tab:'Build', label:'MAKE IT REAL', title:'Beautiful. Functional. Yours.', note:'Ideas take shape as responsive, intentional digital experiences.'},
      { key:'ai', tab:'Connect', label:'MAKE IT USEFUL', title:'Intelligence with intention.', note:'Practical AI that removes the repetitive work and keeps people in control.'}
    ];
    const tabs = document.createElement('div');
    tabs.className='workspace-tabs';
    tabs.setAttribute('role','tablist');
    tabs.setAttribute('aria-label','Explore our creative process');
    modes.forEach((mode, index)=>{
      const btn=document.createElement('button');
      btn.type='button';btn.className='workspace-tab';
      btn.textContent=mode.tab;btn.dataset.mode=mode.key;
      btn.setAttribute('role','tab');btn.setAttribute('aria-selected',index===0?'true':'false');
      btn.tabIndex=index===0?0:-1;
      tabs.append(btn);
    });
    intro.after(tabs);
    const label=intro.querySelector('span'), title=intro.querySelector('strong'),note=intro.querySelector('p');
    let current=0;
    const switchMode = (i, focus=false)=>{
      current=(i+modes.length)%modes.length;
      const mode=modes[current];
      homeWorkspace.dataset.workspaceMode=mode.key;
      if(label)label.textContent=mode.label;
      if(title)title.textContent=mode.title;
      if(note)note.textContent=mode.note;
      tabs.querySelectorAll('[role=tab]').forEach((tab,idx)=>{
        tab.setAttribute('aria-selected',String(idx===current));
        tab.tabIndex=idx===current?0:-1;
        if(focus && idx===current)tab.focus();
      });
    };
    tabs.addEventListener('click',e=>{const b=e.target.closest('button[data-mode]');if(b)switchMode(modes.findIndex(m=>m.key===b.dataset.mode));});
    tabs.addEventListener('keydown',e=>{
      if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
      e.preventDefault();
      const next=e.key==='Home'?0:e.key==='End'?modes.length-1:current+(e.key==='ArrowRight'?1:-1);
      switchMode(next,true);
    });
  }
}
const wordmark=document.querySelector('.footer-wordmark');
if(wordmark) {
  wordmark.addEventListener('pointermove',event=>{
    if(reduced.matches || event.pointerType==='touch')return;
    const b=wordmark.getBoundingClientRect();
    wordmark.style.setProperty('--pointer-x',((event.clientX-b.left)/b.width*100).toFixed(1)+'%');
    wordmark.style.setProperty('--pointer-y',((event.clientY-b.top)/b.height*100).toFixed(1)+'%');
  },{passive:true});
  wordmark.addEventListener('pointerleave',()=>{
    wordmark.style.setProperty('--pointer-x','50%');
    wordmark.style.setProperty('--pointer-y','50%');
  });
}
const canvas=document.querySelector('[data-particle-field]');
if(!canvas || !canvas.getContext)return;
const host=canvas.parentElement;
const ctx=canvas.getContext('2d',{alpha:true});
if(!ctx)return;
const rand=(()=>{let a=0x4b524159;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};})();
let w=1,h=1,particles=[],frame=0,visible=false,phase=0;
let pointer={x:-9999,y:-9999};
const DPR=()=>Math.min(window.devicePixelRatio||1,2);
const render=()=>{
  const d=DPR();
  ctx.clearRect(0,0,w*d,h*d);
  ctx.save();ctx.scale(d,d);
  const glow=ctx.createRadialGradient(w*.50,h*.50,1,w*.50,h*.50,w*.44);
  glow.addColorStop(0,'rgba(90,139,210,.12)');glow.addColorStop(1,'rgba(90,139,210,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  for(const p of particles){
    const t=reduced.matches?1:Math.min(1,Math.max(0,phase));
    const x=p.sx+(p.tx-p.sx)*t+(!reduced.matches?Math.sin(phase*1.1+p.seed)*1.1:0);
    const y=p.sy+(p.ty-p.sy)*t+(!reduced.matches?Math.cos(phase*.9+p.seed)*1.1:0);
    let offx=0,offy=0;
    if(!reduced.matches){
      const dx=x-pointer.x,dy=y-pointer.y;
      const dist=Math.hypot(dx,dy);
      if(dist<115 && dist>0.1){const repulse=(1-dist/115)**2*21;offx=dx/dist*repulse;offy=dy/dist*repulse}
    }
    ctx.globalAlpha=p.alpha*(.65+.35*t);
    ctx.fillStyle=p.color;
    ctx.beginPath();ctx.arc(x+offx,y+offy,p.radius,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();ctx.globalAlpha=1;
};
function size(){
  const rect=host.getBoundingClientRect();
  const nextWidth=Math.round(rect.width),nextHeight=Math.round(rect.height);
  if(!nextWidth||!nextHeight)return;
  w=nextWidth;h=nextHeight;
  canvas.width=Math.round(w*DPR());canvas.height=Math.round(h*DPR());
  const off=document.createElement('canvas');off.width=w;off.height=h;
  const oc=off.getContext('2d',{willReadFrequently:true});
  if(!oc)return;
  const title=w<450?'BR':'BRAYRO';
  let fontSize=w<450?w*.46:w*.19;
  oc.fillStyle='#fff';
  oc.textAlign='center';oc.textBaseline='middle';oc.font='800 '+fontSize+'px SpaceGrotesk,Arial,sans-serif';
  while(oc.measureText(title).width>w*.85 && fontSize>18){fontSize*=.93;oc.font='800 '+fontSize+'px SpaceGrotesk,Arial,sans-serif'}
  oc.fillText(title,w/2,h/2);
  const px=oc.getImageData(0,0,w,h).data;
  const step=w<450?5:4;
  const next=[];
  const centerX=w/2,centerY=h/2;
  for(let y=Math.round(h*.18);y<h*.82;y+=step)for(let x=Math.round(w*.06);x<w*.94;x+=step){
    const alpha=px[(y*w+x)*4+3];
    if(alpha<100||rand()<.3)continue;
    const angle=rand()*Math.PI*2;
    const dist=Math.sqrt(rand())*Math.max(w,h)*.68;
    next.push({tx:x+(rand()-.5)*2,ty:y+(rand()-.5)*2,sx:centerX+Math.cos(angle)*dist,sy:centerY+Math.sin(angle)*dist,seed:rand()*18,
      radius:.65+rand()*1.35,alpha:.48+rand()*.51,color:rand()<.16?'#ffa069':rand()<.53?'#b8d8ff':'#f8f2e5'});
  }
  const limit=w<460?780:1800;
  particles=next.length>limit?next.filter((_,i)=>i%Math.ceil(next.length/limit)===0):next;
  if(reduced.matches)phase=1;
  render();
}
let last=0;
function animate(ts){
 frame=0;
 if(!visible || reduced.matches || document.hidden)return;
 const dt=Math.min(40,ts-last || 16);
 last=ts;phase=Math.min(1,phase+dt*.0009);
 render();frame=requestAnimationFrame(animate);
}
function start(){
 if(reduced.matches){phase=1;render();return}
 if(visible && !frame){last=performance.now();frame=requestAnimationFrame(animate)}
}
function stop(){if(frame)cancelAnimationFrame(frame);frame=0}
const io=('IntersectionObserver' in window)?new IntersectionObserver(entries=>{
 visible=entries[0]?.isIntersecting||false;visible?start():stop();
},{threshold:0.04}):null;
if(io)io.observe(host);else{visible=true;start()}
const ro=('ResizeObserver' in window)?new ResizeObserver(size):null;
if(ro)ro.observe(host);else window.addEventListener('resize',size,{passive:true});
host.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch')return;const b=host.getBoundingClientRect();pointer={x:e.clientX-b.left,y:e.clientY-b.top}}, {passive:true});
host.addEventListener('pointerleave',()=>{pointer={x:-9999,y:-9999}}, {passive:true});
document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
reduced.addEventListener('change',()=>{phase=reduced.matches?1:0;reduced.matches?stop():start();render();});
if(document.fonts && document.fonts.ready)document.fonts.ready.then(size);else size();
})();
