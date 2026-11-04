(()=>{'use strict';const mobile=()=>matchMedia('(max-width:700px)').matches;
const platforms=document.querySelector('.identity .platforms');platforms.innerHTML=V4Visual.platforms(p);
document.querySelector('.identity .eyebrow').textContent=(p.categoryLabel||p.category)+(p.demo?' · DEMO':'');
document.querySelectorAll('.ratings [data-dialog="editorial"] span').forEach(n=>n.textContent='ZETTA');
const editorial=document.querySelector('.ratings [data-dialog="editorial"]');if(p.demo){editorial.querySelector('strong').textContent='—';editorial.querySelector('small:last-child').textContent='Нет оценки';editorial.onclick=()=>openDialog('Оценка ZETTA','<p>Оценка ещё не выставлена. Данные появятся после проверки проекта.</p>')}
const sectionRatings=document.createElement('div');sectionRatings.className='section-ratings';sectionRatings.innerHTML='<button data-reading-vote><span>ПЗС</span><strong>—</strong></button><button data-reading-editorial><span>ZETTA</span><strong>—</strong></button>';nav.insertBefore(sectionRatings,stickyActions);
sectionRatings.querySelector('[data-reading-vote]').onclick=()=>document.querySelector('.ratings [data-dialog="vote"]').click();sectionRatings.querySelector('[data-reading-editorial]').onclick=()=>editorial.click();
function updateRatings(){const r=V4Store.rating(p);sectionRatings.querySelector('[data-reading-vote] strong').textContent=Number.isFinite(r.average)?r.average.toFixed(1).replace('.',','):'—'}addEventListener('v4:state',updateRatings);updateRatings();
// One mobile action bar for both continuous and focused reading.
const mobileBar=document.querySelector('.mobile-detail-bar');
const mobileFavorite=document.querySelector('#mobile-save');
mobileFavorite.onclick=()=>document.querySelector('#save').click();
mobileBar.querySelector('[data-mobile-vote]').onclick=()=>document.querySelector('.ratings [data-dialog="vote"]').click();
mobileBar.querySelector('[data-mobile-editorial]').onclick=()=>editorial.click();
function syncMobileBar(){
 const favorite=document.querySelector('#save');
 mobileFavorite.textContent=favorite.textContent;
 mobileFavorite.setAttribute('aria-pressed',favorite.getAttribute('aria-pressed'));
 mobileFavorite.setAttribute('aria-label',favorite.getAttribute('aria-label'));
 const r=V4Store.rating(p);
 mobileBar.querySelector('[data-mobile-vote] strong').textContent=Number.isFinite(r.average)?r.average.toFixed(1).replace('.',','):'—';
 mobileBar.querySelector('[data-mobile-editorial] strong').textContent=editorial.querySelector('strong').textContent.split('/')[0].trim();
 const compare=mobileBar.querySelector('.mobile-compare');
 compare.dataset.count=V4Store.get().compare.length;
}
function measureMobileBar(){
 if(!mobile()){document.documentElement.style.setProperty('--mobile-bar-height','0px');return}
 const bounds=document.querySelector('.dossier').getBoundingClientRect();
 mobileBar.style.left=bounds.left+'px';mobileBar.style.width=bounds.width+'px';
 document.documentElement.style.setProperty('--mobile-bar-height',mobileBar.getBoundingClientRect().height+'px');
}
addEventListener('v4:state',syncMobileBar);syncMobileBar();
const mobileBarObserver=new ResizeObserver(measureMobileBar);
mobileBarObserver.observe(document.querySelector('.dossier'));mobileBarObserver.observe(mobileBar);
addEventListener('resize',measureMobileBar);measureMobileBar();
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
document.querySelectorAll('.card-footer span').forEach(n=>{if(n.textContent.includes('V4.'))n.textContent='Подробная карточка · V4.2.1'});

const desktop=matchMedia('(min-width:701px)'),title=document.querySelector('.identity h1'),originalTitle=title.firstChild.textContent;
const close=document.querySelector('.close-card'),closeHome=document.createComment('close');close.before(closeHome);
const essence=document.querySelector('#essence'),essenceHome=document.createComment('essence');essence.before(essenceHome);
function arrangeAudit(){if(desktop.matches){title.firstChild.textContent=originalTitle.replace(/\s*[·—-]?\s*тест\s*\d*/ig,'').replace(/\bDEMO\b/ig,'').trim();document.body.append(close);close.classList.add('detached-close');platforms.before(essence);platforms.innerHTML=['Браузер','Windows','macOS','iOS','Android'].map((name,i)=>{const available=(p.platforms||[]).some(x=>x.includes(name));return '<span class="platform-label '+(available?'available':'unavailable')+'" title="'+(available?'Доступно':'Нет данных о доступности')+'"><b aria-hidden="true">'+['◎','⊞','◈','▯','♟'][i]+'</b>'+name+'</span>'}).join('');document.querySelector('.identity .eyebrow').textContent='Категория · '+(p.categoryLabel||p.category);metrics.innerHTML=p.stats.slice(0,2).map((s,i)=>'<div><i aria-hidden="true">'+['◷','♟'][i]+'</i><strong>'+esc(s.value)+'</strong><span>'+esc(s.label)+'</span></div>').join('')+'<div><i aria-hidden="true">⚒</i><strong>94 BTC</strong><span>Намайнено</span></div>';}else{title.firstChild.textContent=originalTitle;closeHome.after(close);close.classList.remove('detached-close');essenceHome.after(essence);platforms.innerHTML=V4Visual.platforms(p);metrics.innerHTML=p.stats.map(s=>'<div><strong>'+esc(s.value)+'</strong><span>'+esc(s.label)+'</span></div>').join('')}}desktop.addEventListener('change',arrangeAudit);arrangeAudit();
for(const [i,n] of [...document.querySelectorAll('.passport .ratings>button')].entries()){const mark=document.createElement('div');mark.className='rating-emblem';mark.textContent=['★','◈','Z'][i];n.prepend(mark);const visual=document.createElement('div');visual.className='rating-graphic';visual.textContent=i===0?'☆☆☆☆☆':'★★★★☆';n.append(visual);if(i>0){n.querySelector('strong').textContent=['','4,0 / 5','3,8 / 5'][i];n.querySelector('small:last-of-type').textContent='DEMO · пример';n.onclick=()=>openDialog('Пример оценки · DEMO','<p>Временная демонстрационная оценка для проверки оформления. Это не настоящая оценка проекта.</p>')}}
syncMobileBar();
})();
