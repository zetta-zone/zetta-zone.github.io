/* Currency membership is chosen by the owner, never inferred from use. */
(()=>{'use strict';
// Defaults are installed before V51Model applies browser-owned project edits.
const roller=V4_PROJECTS.find(p=>p.id==='rollercoin');
if(roller){
 roller.internalCurrencies=[['RLT','RollerToken'],['RST','Roller Season Token'],['HMT','Hamvest token'],['TWT','TaskWall token'],['FREON','Freon token'],['ECOIN','Event Coin']].map(([ticker,name])=>({ticker,name,icon:'assets/rollercoin/'+ticker.toLowerCase()+'.svg'}));
 for(const c of roller.coins){c.icon='assets/rollercoin/'+(c.ticker==='POL'?'matic':c.ticker.toLowerCase())+'.svg';if(['ALGO','USDT'].includes(c.ticker))Object.assign(c,{use:'Майнинг, депозит и реинвестирование',deposit:'Доступен',method:'Вывод недоступен',withdrawable:false});}
}
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function group(p,key,view,layout){
 const items=(window.V51Model?V51Model.visibleItems(p,key,view,undefined,layout):p[key]||[]).filter(c=>c&&(c.ticker||c.name));
 if(!items.length)return '';
 const internal=key==='internalCurrencies',caption=p[key+'Caption']??(internal?'Внутриигровые валюты':'');
 return '<section class="currency-group" data-currency-group="'+key+'" aria-label="'+(internal?'Внутриигровые валюты':'Валюты проекта')+'" data-preserve-content>'+ (caption.trim()?'<p class="currency-caption" data-v51-field="'+key+'Caption">'+E(caption)+'</p>':'')+'<div class="currency-row" tabindex="0" aria-label="'+(internal?'Внутриигровые валюты':'Валюты проекта')+'">'+items.map(c=>'<span class="currency-item" tabindex="0" data-rc-tip="'+E((c.ticker?c.ticker+' · ':'')+(c.name||''))+'" aria-label="'+E((c.ticker?c.ticker+' · ':'')+(c.name||''))+'" title="'+E(c.name||c.ticker)+'"><span class="coin-icon">'+V5ProjectVisual.coin(c)+'</span><span>'+E(c.ticker||c.name)+'</span></span>').join('')+'</div></section>';
}
function rollerGroup(p,key,view,layout){
 const internal=key==='internalCurrencies',items=(window.V51Model?V51Model.visibleItems(p,key,view,undefined,layout):p[key]||[]).filter(c=>c&&(c.ticker||c.name));
 if(!items.length)return '';
 const caption=p[key+'Caption']??(internal?'Внутриигровые валюты':'');
 return '<section class="currency-group rc-currency-group" data-currency-group="'+key+'" data-preserve-content aria-label="'+(internal?'Внутриигровые валюты':'Криптовалюты')+'">'+(caption.trim()?'<p class="currency-caption" data-v51-field="'+key+'Caption">'+E(caption)+'</p>':'')+'<div class="currency-row" style="--rc-count:'+items.length+'" tabindex="0" aria-label="'+(internal?'Внутриигровые валюты':'Криптовалюты')+'">'+items.map(c=>{const restricted=!internal&&['ALGO','USDT'].includes(c.ticker),tip=(c.ticker?c.ticker+' · ':'')+(c.name||'')+(restricted?' — майнинг, депозит и реинвестирование доступны; вывод недоступен.':internal?' — внутриигровая валюта.':' — условия вывода зависят от валюты и сети.');return '<button type="button" class="currency-item rc-currency" data-rc-tip="'+E(tip)+'" aria-label="'+E(tip)+'"'+(restricted?' data-no-withdraw="true"':'')+'><span class="coin-icon">'+V5ProjectVisual.coin(c)+'</span></button>'}).join('')+'</div></section>';
}
function rollerWithdrawal(p){const l=p.legacy||{},yes=v=>v===true?'Да':v===false?'Нет':'Уточнить';return '<section class="rc-withdrawal" data-preserve-content aria-label="Вывод средств"><strong>Вывод средств</strong><span>Минимум: '+E(l.minWithdraw||p.withdrawalLabel||'зависит от валюты и сети')+'</span><span>FaucetPay: '+yes(l.faucetpaySupported)+' · Direct Wallet: '+yes(l.directWalletSupported)+'</span><span>Способ: внешний криптокошелёк</span></section>';}
function html(p,view='cards',layout){
 if(view==='cards'&&p.demo===true&&/^hashgarden-test-0[234]$/.test(p.id)){
 // Display-only examples: never persist or replace the project's financial data.
 const sample={...p,internalCurrencies:[{ticker:'SEED',name:'Игровые семена',icon:'assets/demo-seed.svg'}],coins:[{ticker:'BTC',name:'Bitcoin'},{ticker:'LTC',name:'Litecoin'},{ticker:'USDT',name:'Tether'}],internalCurrenciesCaption:'Внутриигровые валюты',coinsCaption:'Пополнение и вывод'};
 return group(sample,'internalCurrencies',view)+group(sample,'coins',view)+'<div class="demo-currency-note" data-preserve-content>Условные валюты · пример интерфейса. Выплаты не подтверждены.</div>';
 }
if(p.id==='rollercoin')return (view==='detail'?'':rollerWithdrawal(p))+rollerGroup(p,'internalCurrencies',view,layout)+rollerGroup(p,'coins',view,layout);return group(p,'coins',view,layout)+group(p,'internalCurrencies',view,layout)}
function paint(root,p,view,layout){
 if(p.id==='rollercoin')root.dataset.project='rollercoin';
 const detail=root.matches('.dossier');let host=root.querySelector('[data-currency-groups]');
 if(!host){host=document.createElement('div');host.dataset.currencyGroups='';host.className='currency-groups';if(detail){const coins=root.querySelector('#coins');if(!coins)return;coins.before(host)}else (root.querySelector('.card-body,.row-bottom')||root).append(host)}
 const markup=html(p,view,layout);if(host.innerHTML!==markup)host.innerHTML=markup;host.hidden=!markup;
 if(detail){for(const sel of ['#coins','#coin-detail','.coin-heading','[data-project-copy="copy15"]']){const n=root.querySelector(sel);if(n)n.hidden=true}}
}
// A fixed tooltip never changes card height and escapes scrolling rows.
let tip,active;
function close(){active?.removeAttribute("aria-describedby");tip?.remove();tip=null;active=null;}
function show(target){close();active=target;tip=document.createElement('div');tip.className='rc-currency-tooltip';tip.id='rc-currency-tooltip';tip.role='tooltip';tip.textContent=target.dataset.rcTip;document.body.append(tip);target.setAttribute('aria-describedby',tip.id);const r=target.getBoundingClientRect();tip.style.left=Math.max(8,Math.min(r.left,innerWidth-tip.offsetWidth-8))+'px';tip.style.top=Math.max(8,(r.top>tip.offsetHeight+12?r.top-tip.offsetHeight-8:r.bottom+8))+'px';}
document.addEventListener('pointerover',e=>{const t=e.target.closest('[data-rc-tip]');if(t&&t!==active){show(t);setTimeout(()=>{if(t.isConnected&&t.matches(':hover')&&active!==t)show(t)},100)}});
document.addEventListener('pointerout',e=>{if(active?.contains(e.target)&&!active.contains(e.relatedTarget))close()});
document.addEventListener('focusin',e=>{const t=e.target.closest('[data-rc-tip]');if(t)show(t)});
document.addEventListener('focusout',close);
document.addEventListener('click',e=>{const t=e.target.closest('[data-rc-tip]');if(t){show(t)}else close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
addEventListener('scroll',close,true);addEventListener('resize',close);
// Fit icons by overlapping neighbours instead of scrolling or clipping currencies.
const observed=new Set();let queued=false;
function fitRows(){queued=false;for(const row of observed)if(!row.isConnected){rowObserver.unobserve(row);observed.delete(row)}
for(const row of document.querySelectorAll('.currency-row')){if(!observed.has(row)){observed.add(row);rowObserver.observe(row)}
const items=[...row.children].filter(n=>n.matches('.currency-item')&&!n.hidden);const count=items.length;if(!count)continue;
const available=Math.max(0,row.clientWidth-4),size=Math.min(28,available),step=count>1?Math.min(size+6,Math.max(0,(available-size)/(count-1))):0;
row.style.setProperty('--currency-size',size+'px');row.style.setProperty('--currency-step',step+'px');
}}
function queueFit(){if(!queued){queued=true;requestAnimationFrame(fitRows)}}
const rowObserver=new ResizeObserver(queueFit);new MutationObserver(queueFit).observe(document.body,{childList:true,subtree:true});
addEventListener('resize',queueFit);addEventListener('v5:editor-apply',queueFit);addEventListener('v5:catalog-render',queueFit);queueFit();
window.V5Currencies={html,paint,fit:queueFit};
})();
