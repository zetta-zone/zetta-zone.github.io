'use strict';
const nav=document.querySelector('.section-nav'),sections=[...document.querySelectorAll('.main-content>.content-section')],navLinks=[...nav.querySelectorAll('a')];
let activeSection=null,catalogY=0;
const topbar=document.querySelector('.prototype-bar');
function navTop(){return activeSection?readingHeader.getBoundingClientRect().height:0}
function resetSections(){document.body.classList.remove('section-mode');activeSection=null;setReadingHeader(false);if(typeof scrollRoom!=='undefined')scrollRoom.style.height='0px';sections.forEach(s=>s.hidden=false);navLinks.forEach(a=>{a.classList.remove('active');a.removeAttribute('aria-current')});document.querySelectorAll('.reading-aside a').forEach(a=>a.removeAttribute('aria-current'))}
function selectSection(id){const target=document.getElementById(id);if(!sections.includes(target))return;document.body.classList.add('section-mode');activeSection=id;setReadingHeader(true);sections.forEach(s=>s.hidden=s!==target);navLinks.forEach(a=>{const yes=a.hash==='#'+id;a.classList.toggle('active',yes);if(yes)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.querySelectorAll('.reading-aside a').forEach(a=>a.toggleAttribute('aria-current',a.hash==='#'+id));stickyActions.hidden=false;updateScrollRoom();const shell=document.querySelector('.section-shell');const y=scrollY+shell.getBoundingClientRect().top-navTop();window.scrollTo({top:y,behavior:'instant'})}
document.querySelectorAll('.section-nav a,.reading-aside a,.verification').forEach(a=>a.addEventListener('click',e=>{if(a.closest('.section-nav')||activeSection){e.preventDefault();selectSection(a.hash.slice(1))}}));
nav.setAttribute('aria-label','Выбрать раздел карточки');
navLinks.forEach((a,i)=>a.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?navLinks.length-1:(i+(e.key==='ArrowRight'?1:-1)+navLinks.length)%navLinks.length;navLinks[next].focus();selectSection(navLinks[next].hash.slice(1))}}));
const stickyActions=document.querySelector('.sticky-actions');
function updateScroll(){const past=document.querySelector('#hero').getBoundingClientRect().bottom<=navTop()+1;stickyActions.hidden=!past;nav.classList.toggle('hero-past',past);if(activeSection&&scrollY<80)resetSections()}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll);
const originalClose=closeCard;
closeCard=function(){if(document.referrer){const from=new URL(document.referrer);if(from.origin===location.origin&&/^\/catalog\/?$/.test(from.pathname)&&history.length>1){history.back();return}}originalClose();resetSections();document.body.classList.remove('card-open');window.scrollTo({top:catalogY,behavior:'instant'});document.querySelector('#back-catalog').hidden=true};
document.querySelector('.close-card').onclick=closeCard;
document.querySelector('#back-catalog').onclick=closeCard;
document.querySelector('#reopen').onclick=()=>{catalogY=scrollY;document.querySelector('.dossier').hidden=false;document.querySelector('#closed-state').hidden=true;document.querySelector('#compare-tray').hidden=!selected;document.body.classList.add('card-open');document.querySelector('#back-catalog').hidden=false;window.scrollTo({top:0,behavior:'instant'});document.querySelector('.close-card').focus();updateScroll()};
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();resetSections();window.scrollTo({top:0,behavior:'instant'})});
// Keep project identity together; move the same node above the gallery on narrow screens.
const hero=document.querySelector('#hero'),passport=document.querySelector('.passport'),header=document.querySelector('.project-header');
const metrics=document.querySelector('.overview-metrics');passport.insertBefore(metrics,passport.querySelector('.ratings'));hero.prepend(document.querySelector('.header-tools'));
const compact=matchMedia('(max-width:1100px)');
function placeIdentity(){if(compact.matches)hero.prepend(header);else passport.prepend(header)}
placeIdentity();compact.addEventListener('change',placeIdentity);
const identity=header.querySelector('.identity'),headerTools=hero.querySelector('.header-tools'),themeControl=topbar.querySelector('.theme-control');
const readingHeader=document.createElement('div');readingHeader.className='reading-project-wrap';readingHeader.hidden=true;
const readingBox=document.createElement('div');readingBox.className='reading-project';readingHeader.append(readingBox);hero.before(readingHeader);
function setReadingHeader(show){readingHeader.hidden=!show;if(show){readingBox.append(identity,themeControl,headerTools)}else{header.prepend(identity);hero.prepend(headerTools);topbar.append(themeControl)}document.documentElement.style.setProperty('--reading-header-height',show?readingHeader.getBoundingClientRect().height+'px':'0px')}
const layout=document.querySelector('.content-layout');
const scrollRoom=document.createElement('div');scrollRoom.className='section-scroll-room';scrollRoom.setAttribute('aria-hidden','true');document.body.append(scrollRoom);
function updateScrollRoom(){if(!activeSection)return;const shell=document.querySelector('.section-shell');const anchor=scrollY+shell.getBoundingClientRect().top-navTop();const baseHeight=document.documentElement.scrollHeight-scrollRoom.offsetHeight;scrollRoom.style.height=Math.max(0,Math.ceil(anchor+innerHeight-baseHeight+2))+'px'}
const footer=document.querySelector('.card-footer');
const resizeObserver=new ResizeObserver(()=>{document.documentElement.style.setProperty('--topbar-height','0px');document.documentElement.style.setProperty('--footer-height',footer.getBoundingClientRect().height+'px');document.documentElement.style.setProperty('--reading-header-height',activeSection?readingHeader.getBoundingClientRect().height+'px':'0px');updateScrollRoom()});
resizeObserver.observe(topbar);resizeObserver.observe(footer);resizeObserver.observe(layout);resizeObserver.observe(readingHeader);
// The ordinary view stays a full page; menu selection opens a focused subcard.
document.body.classList.add('card-open');resetSections();updateScroll();

