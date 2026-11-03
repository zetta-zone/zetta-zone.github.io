(()=>{'use strict';const mobile=()=>matchMedia('(max-width:700px)').matches;
const platforms=document.querySelector('.identity .platforms');platforms.innerHTML=V4Visual.platforms(p);
document.querySelector('.identity .eyebrow').textContent=(p.categoryLabel||p.category)+(p.demo?' · DEMO':'');
document.querySelectorAll('.ratings [data-dialog="editorial"] span').forEach(n=>n.textContent='ZETTA');
const editorial=document.querySelector('.ratings [data-dialog="editorial"]');if(p.demo){editorial.querySelector('strong').textContent='—';editorial.querySelector('small:last-child').textContent='Нет оценки';editorial.onclick=()=>openDialog('Оценка ZETTA','<p>Оценка ещё не выставлена. Данные появятся после проверки проекта.</p>')}
const sectionRatings=document.createElement('div');sectionRatings.className='section-ratings';sectionRatings.innerHTML='<button data-reading-vote><span>ПЗС</span><strong>—</strong></button><button data-reading-editorial><span>ZETTA</span><strong>—</strong></button>';nav.insertBefore(sectionRatings,stickyActions);
sectionRatings.querySelector('[data-reading-vote]').onclick=()=>document.querySelector('.ratings [data-dialog="vote"]').click();sectionRatings.querySelector('[data-reading-editorial]').onclick=()=>editorial.click();
function updateRatings(){const r=V4Store.rating(p);sectionRatings.querySelector('[data-reading-vote] strong').textContent=Number.isFinite(r.average)?r.average.toFixed(1).replace('.',','):'—'}addEventListener('v4:state',updateRatings);updateRatings();
// Each focused section has a dedicated DEMO illustration.
const sectionPhotos={overview:0,features:1,mechanics:2,finance:3,balance:4,verification:5,verdict:6};
function measureSection(){if(!mobile()||!activeSection)return;const section=document.getElementById(activeSection),button=section.querySelector('.section-expand');const unfolded=section.classList.contains('is-unfolded');const more=unfolded||section.scrollHeight>section.clientHeight+2;button.hidden=!more;section.classList.toggle('has-more',more);button.textContent=unfolded?'−':'+';button.setAttribute('aria-expanded',String(unfolded));button.setAttribute('aria-label',unfolded?'Свернуть раздел':'Раскрыть раздел полностью')}
sections.forEach(section=>{const button=document.createElement('button');button.className='section-expand';button.type='button';button.hidden=true;button.setAttribute('aria-expanded','false');button.onclick=()=>{section.classList.toggle('is-unfolded');measureSection()};section.append(button)});
if(p.demo)document.querySelectorAll('.overview-metrics>div').forEach((n,i)=>{const label=n.querySelector('span');label.title=label.textContent;label.textContent=['Год','Аккаунтов','Обновлено'][i]||label.textContent});
const originalSelect=selectSection;selectSection=function(id){if(!mobile()){originalSelect(id);return}sections.forEach(s=>s.classList.remove('is-unfolded','has-more'));originalSelect(id);showSlide(sectionPhotos[id]??0);window.scrollTo({top:0,behavior:'instant'});requestAnimationFrame(measureSection)};
document.querySelector('.main-content').addEventListener('click',()=>requestAnimationFrame(measureSection));
document.querySelector('.main-content').addEventListener('toggle',()=>requestAnimationFrame(measureSection),true);
new ResizeObserver(()=>requestAnimationFrame(measureSection)).observe(document.querySelector('.main-content'));
addEventListener('resize',()=>{if(!mobile())sections.forEach(s=>s.classList.remove('is-unfolded','has-more'));measureSection()});
// Local voting has no seeded votes in this review.
voteMarkup=function(){return `<p>Оцените проект от 1 до 5. Голос сохраняется в этом браузере.</p><div class="vote-stars" role="group" aria-label="Выбрать оценку">${[1,2,3,4,5].map(n=>`<button data-vote="${n}" aria-label="${n} из 5" aria-pressed="${vote===n}" class="${n<=vote?'selected':''}">★</button>`).join('')}</div><p>${vote?'Ваша оценка: '+vote+' / 5':'Оценок пока нет.'}</p><button class="text-button" id="reset-vote">Сбросить голос</button>`};
document.querySelectorAll('.card-footer span').forEach(n=>{if(n.textContent.includes('V4.'))n.textContent='Подробная карточка · V4.2'});
})();
