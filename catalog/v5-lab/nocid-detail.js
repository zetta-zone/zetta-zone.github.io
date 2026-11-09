/* Bind Nocid-specific facts after the inherited V5 layout has initialized. */
(()=>{'use strict';if(p.id!=='nocid')return;
document.body.classList.add('nocid-project');
function theme(){document.body.style.cssText=V5ProjectStyle(p)}theme();new MutationObserver(theme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
const logo=document.querySelector('.identity .project-logo');logo.removeAttribute('aria-hidden');logo.innerHTML=`<img src="${esc(p.logo)}" alt="Логотип Nocid">`;
const heading=document.querySelector('.identity h1');heading.querySelector('.demo-tag')?.remove();
const status=document.createElement('small');status.className='project-status';status.textContent='Тестовая карточка · DEMO — требует проверки';heading.after(status);
document.querySelector('.passport>.eyebrow').textContent='МАЙНЕРЫ · КРАФТ · ИССЛЕДОВАНИЯ';
const facts=document.querySelectorAll('.quick-facts dd');facts[0].textContent='Бесплатный майнер заявлен';facts[1].textContent=p.comparisonValues.deposit;facts[2].textContent=p.withdrawalLabel;
const verification=document.querySelector('.verification');verification.querySelector('b').textContent='Выплаты не проверены';verification.querySelector('small').textContent='Изучены публичные источники · 05.11.2026';verification.querySelector('.status-symbol').textContent='?';
const notice=document.querySelector('#verification .demo-notice');notice.className='draft-notice';notice.querySelector('b').textContent='Nocid — тестовая карточка, не подтверждение выплат.';
const labels=document.querySelectorAll('#verification .verification-grid>div>b');labels[0].textContent='Только публичные источники';labels[1].textContent='Не проверено';labels[2].textContent='Средний · DEMO — требует проверки';labels[3].textContent='Не мешает · DEMO — требует проверки';
const proof=document.querySelector('[data-dialog="proof"]');proof.textContent='Источники и статус проверки ↗';
document.querySelectorAll('.action-note').forEach(n=>{n.textContent='Переход на официальный nocid.fun; карточка остаётся тестовой.';n.hidden=false});
document.querySelector('.gallery-topline>span:nth-child(2)').textContent='МЕСТО ДЛЯ ИЗОБРАЖЕНИЯ · НУЖНО ЗАПОЛНИТЬ';
document.querySelectorAll('.gallery-track img,.thumbnail img').forEach((n,i)=>n.alt='Nocid: место для официального изображения '+(i+1));
document.querySelectorAll('.verdict-tags span').forEach((n,i)=>n.textContent=['Виртуальные майнеры','Исследования','Условия требуют проверки'][i]);
document.querySelector('#verdict>.eyebrow').textContent='ZETTA-ZONE · ПРЕДВАРИТЕЛЬНО';
document.querySelector('.card-footer>span').textContent='Источники проверены: 05.11.2026';
document.querySelector('#reopen').textContent='Открыть Nocid';
document.querySelector('.aside-index a[href="#features"]').firstChild.textContent=p.features.length+' возможностей ';
document.querySelector('.aside-index a[href="#finance"]').firstChild.textContent=p.coins.length+' валют / упоминаний ';
document.querySelector('#info-dialog .eyebrow').textContent='ZETTA-ZONE · NOCID · ТЕСТОВАЯ КАРТОЧКА';
document.querySelectorAll('.registration').forEach(b=>{b.onclick=()=>window.open(p.registrationUrl,'_blank','noopener,noreferrer')});
document.querySelectorAll('[data-dialog="editorial"],[data-dialog="external"]').forEach(b=>{b.querySelector('strong')?.replaceChildren(document.createTextNode('—'));b.querySelector('small:last-of-type')?.replaceChildren(document.createTextNode('Не оценено · DEMO в черновике'));b.querySelector('.rating-graphic')?.remove();});
document.querySelectorAll('[data-mobile-editorial] strong,[data-reading-editorial] strong').forEach(n=>n.textContent='—');
function sources(){return '<p>Получено 05.11.2026. Это заявления Nocid, не независимое подтверждение работы и выплат.</p><ul class="source-list">'+Object.values(p.sources).map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.note)+'</a></li>').join('')+'</ul><p><a href="NOCID-REPORT.md" target="_blank" rel="noopener">Полный отчёт по полям ↗</a></p>'}
function draft(){return '<details class="draft-details"><summary>Исходные DEMO-значения — требуют проверки</summary><p>Значения HashGarden сохранены для ручной корректировки. Они не являются сведениями о Nocid.</p><pre>'+esc(JSON.stringify(p.draftOriginal,null,2))+'</pre></details>'}
document.querySelectorAll('[data-dialog="service"],[data-dialog="proof"]').forEach(b=>b.onclick=()=>openDialog('Источники и незаполненные поля Nocid',sources()+draft()));
document.querySelectorAll('[data-dialog="editorial"]').forEach(b=>b.onclick=()=>openDialog('Оценка ZETTA не выставлена','<p>Исходная оценка 3,8 / 5 и десять критериев — DEMO — требует проверки. Они сохранены в черновике и не участвуют в рейтинге Nocid.</p>'+draft()));
document.querySelectorAll('[data-dialog="external"]').forEach(b=>b.onclick=()=>openDialog('Внешняя оценка','<p>Достоверная внешняя оценка Nocid не найдена.</p>'));
document.querySelector('[data-dialog="faucetpay"]').onclick=()=>openDialog('FaucetPay — условия требуют проверки','<p>FaucetPay показан в официальном платёжном блоке. Поддержка конкретных валют, минимумы, комиссии и сроки не установлены.</p>'+sources());
const wallet=document.querySelector('[data-dialog="wallet"]');wallet.textContent='Crypto · условия требуют проверки ↗';wallet.onclick=()=>openDialog('Crypto — требует проверки','<p>На главной перечислены LTC, DOGE, TRX, BTC и USDT в блоке Crypto. Сети и условия перевода не найдены. Не считать это подтверждением Direct Wallet.</p>'+sources());
const warning=document.createElement('p');warning.className='draft-notice';warning.innerHTML='Тестовая карточка. Все поля <b>«DEMO — требует проверки»</b> сохранены из шаблона и не подтверждены для Nocid. <a href="NOCID-REPORT.md" target="_blank" rel="noopener">Отчёт и источники ↗</a>';document.querySelector('.passport').append(warning);
function resetCoinLabels(){document.querySelector('#coin-detail .demo-tag')?.replaceChildren(document.createTextNode('УСЛОВИЯ НЕ ПРОВЕРЕНЫ'))}resetCoinLabels();new MutationObserver(resetCoinLabels).observe(document.querySelector('#coin-detail'),{childList:true});
// Show all mining currencies, retaining the original component and controls.
document.querySelectorAll('[data-dialog="vote"]').forEach(b=>b.setAttribute('title','Локальная тестовая оценка; на сервер Nocid не отправляется'));
})();
