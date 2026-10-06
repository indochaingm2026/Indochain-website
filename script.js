const header=document.querySelector('.site-header');
const toggle=document.querySelector('.menu-toggle');
window.addEventListener('scroll',()=>{if(header) header.classList.toggle('scrolled',window.scrollY>40)});
if(toggle) toggle.addEventListener('click',()=>header.classList.toggle('menu-open'));
document.querySelectorAll('.mobile-links a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('menu-open')));
document.querySelectorAll('form[data-demo]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const msg=form.querySelector('.form-message');if(msg){msg.textContent='Thank you. Please contact us directly by email or WhatsApp while the online form connection is being finalized.';msg.style.color='#0b55a5';}form.reset();}));
