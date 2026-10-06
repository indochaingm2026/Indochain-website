const header=document.querySelector('.site-header');
const toggle=document.querySelector('.menu-toggle');
window.addEventListener('scroll',()=>{if(header) header.classList.toggle('scrolled',window.scrollY>40)});
if(toggle) toggle.addEventListener('click',()=>header.classList.toggle('menu-open'));
document.querySelectorAll('.mobile-links a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('menu-open')));
document.querySelectorAll('form[data-demo]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const msg=form.querySelector('.form-message');if(msg){msg.textContent='Thank you. Please contact us directly by email or WhatsApp while the online form connection is being finalized.';msg.style.color='#0b55a5';}form.reset();}));

const hero=document.querySelector('.hero-slider');
if(hero){
  const slides=[...hero.querySelectorAll('.hero-slide')];
  const dots=[...hero.querySelectorAll('.hero-dot')];
  const progress=hero.querySelector('.hero-progress span');
  let current=0; let timer=null; const duration=5500;
  function showSlide(index){
    current=(index+slides.length)%slides.length;
    slides.forEach((el,i)=>el.classList.toggle('is-active',i===current));
    dots.forEach((el,i)=>{el.classList.toggle('is-active',i===current);el.setAttribute('aria-selected',i===current?'true':'false');});
    progress.style.animation='none'; void progress.offsetWidth; progress.style.animation=`heroProgress ${duration}ms linear`;
  }
  function start(){clearInterval(timer); timer=setInterval(()=>showSlide(current+1),duration); showSlide(current);}
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);start();}));
  hero.addEventListener('mouseenter',()=>{clearInterval(timer);hero.classList.add('is-paused');progress.style.animationPlayState='paused';});
  hero.addEventListener('mouseleave',()=>{hero.classList.remove('is-paused');start();});
  let touchX=0;
  hero.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});
  hero.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45){showSlide(current+(dx<0?1:-1));start();}},{passive:true});
  start();
}

const heroStyle=document.createElement('style');heroStyle.textContent='@keyframes heroProgress{from{width:0}to{width:100%}}';document.head.appendChild(heroStyle);
