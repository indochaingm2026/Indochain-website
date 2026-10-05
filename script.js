
const nav=document.querySelector('.nav');
window.addEventListener('scroll',()=>nav&&nav.classList.toggle('scrolled',scrollY>40));
const menu=document.querySelector('.menu'), links=document.querySelector('.nav-links');
if(menu) menu.addEventListener('click',()=>links.classList.toggle('open'));
document.querySelectorAll('form[data-demo]').forEach(form=>{
 form.addEventListener('submit',e=>{
  e.preventDefault();
  const msg=form.querySelector('.form-message');
  msg.textContent='Thank you. Your inquiry has been received. Please connect your email/backend service to enable live delivery.';
  msg.style.color='#15803d';
  form.reset();
 });
});
