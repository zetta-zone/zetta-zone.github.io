'use strict';
const nav=document.querySelector('.section-nav'),sections=[...document.querySelectorAll('.main-content>.content-section')],navLinks=[...nav.querySelectorAll('a')];
let activeSection=null,catalogY=0;
const topbar=document.querySelector('.prototype-bar');
function navTop(){return topbar.getBoundingClientRect().height}
function resetSections(){activeSection=null;sections.forEach(s=>s.hidden=false);navLinks.forEach(a=>{a.classList.remove('active');a.removeAttribute('aria-current')});document.querySelectorAll('.reading-aside a').forEach(a=>a.removeAttribute('aria-current'))}
function selectSection(id){const target=document.getElementById(id);if(!sections.includes(target))return;activeSection=id;sections.forEach(s=>s.hidden=s!==target);navLinks.forEach(a=>{const yes=a.hash==='#'+id;a.classList.toggle('active',yes);if(yes)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.querySelectorAll('.reading-aside a').forEach(a=>a.toggleAttribute('aria-current',a.hash==='#'+id));stickyActions.hidden=false;const heroBottom=document.querySelector('#hero').getBoundingClientRect().bottom;const y=scrollY+heroBottom-navTop();window.scrollTo({top:y,behavior:'instant'})}
document.querySelectorAll('.section-nav a,.reading-aside a,.verification').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();selectSection(a.hash.slice(1))}));
nav.setAttribute('aria-label','Выбрать раздел карточки');
navLinks.forEach((a,i)=>a.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?navLinks.length-1:(i+(e.key==='ArrowRight'?1:-1)+navLinks.length)%navLinks.length;navLinks[next].focus();selectSection(navLinks[next].hash.slice(1))}}));
const stickyActions=document.querySelector('.sticky-actions');
function updateScroll(){const past=document.querySelector('#hero').getBoundingClientRect().bottom<=navTop()+1;stickyActions.hidden=!past;nav.classList.toggle('hero-past',past);}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll);
const originalClose=closeCard;
closeCard=function(){if(document.referrer){const from=new URL(document.referrer);if(from.origin===location.origin&&/^\/catalog\/?$/.test(from.pathname)&&history.length>1){history.back();return}}originalClose();resetSections();document.body.classList.remove('card-open');window.scrollTo({top:catalogY,behavior:'instant'});document.querySelector('#back-catalog').hidden=true};
document.querySelector('.close-card').onclick=closeCard;
document.querySelector('#back-catalog').onclick=closeCard;
document.querySelector('#reopen').onclick=()=>{catalogY=scrollY;document.querySelector('.dossier').hidden=false;document.querySelector('#closed-state').hidden=true;document.querySelector('#compare-tray').hidden=!selected;document.body.classList.add('card-open');document.querySelector('#back-catalog').hidden=false;window.scrollTo({top:0,behavior:'instant'});document.querySelector('.close-card').focus();updateScroll()};
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();resetSections();window.scrollTo({top:0,behavior:'instant'})});
// Keep project identity together; move the same node above the gallery on narrow screens.
const hero=document.querySelector('#hero'),passport=document.querySelector('.passport'),header=document.querySelector('.project-header');
const metrics=document.querySelector('.overview-metrics');header.append(metrics);hero.prepend(document.querySelector('.header-tools'));
const compact=matchMedia('(max-width:1100px)');
function placeIdentity(){if(compact.matches)hero.prepend(header);else passport.prepend(header)}
placeIdentity();compact.addEventListener('change',placeIdentity);
const layout=document.querySelector('.content-layout');
const resizeObserver=new ResizeObserver(()=>document.documentElement.style.setProperty('--topbar-height',topbar.getBoundingClientRect().height+'px'));
resizeObserver.observe(topbar);
// One selected section from the first render; scrolling never resets it.
function initialSection(){const id=location.hash.slice(1);const target=sections.find(s=>s.id===id)||sections[0];activeSection=target.id;sections.forEach(s=>s.hidden=s!==target);navLinks.forEach(a=>{const yes=a.hash==='#'+activeSection;a.classList.toggle('active',yes);if(yes)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
resetSections=initialSection;
document.body.classList.add('card-open');initialSection();updateScroll();





