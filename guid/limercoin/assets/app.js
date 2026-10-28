'use strict';
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
document.querySelectorAll('.carousel').forEach(carousel=>{const slides=[...carousel.querySelectorAll('[data-slide]')],dots=[...carousel.querySelectorAll('[data-dot]')];let current=0,startX=null;
function show(n){current=(n+slides.length)%slides.length;slides.forEach((slide,i)=>slide.hidden=i!==current);dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===current)));carousel.querySelector('[data-status]').textContent='Слайд '+(current+1)+' из '+slides.length;}
carousel.querySelector('[data-prev]').addEventListener('click',()=>show(current-1));carousel.querySelector('[data-next]').addEventListener('click',()=>show(current+1));dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1))}});
carousel.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});carousel.addEventListener('touchend',e=>{if(startX!==null){const diff=e.changedTouches[0].clientX-startX;if(Math.abs(diff)>45)show(current+(diff<0?1:-1));startX=null;}},{passive:true});});