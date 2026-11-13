/* Currency membership is chosen by the owner, never inferred from use. */
(()=>{'use strict';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function group(p,key,view,layout){
 const items=(window.V51Model?V51Model.visibleItems(p,key,view,undefined,layout):p[key]||[]).filter(c=>c&&(c.ticker||c.name));
 if(!items.length)return '';
 const internal=key==='internalCurrencies',caption=p[key+'Caption']??(internal?'Внутриигровые валюты':'');
 return '<section class="currency-group" data-currency-group="'+key+'" aria-label="'+(internal?'Внутриигровые валюты':'Валюты проекта')+'" data-preserve-content>'+ (caption.trim()?'<p class="currency-caption" data-v51-field="'+key+'Caption">'+E(caption)+'</p>':'')+'<div class="currency-row" tabindex="0" aria-label="'+(internal?'Внутриигровые валюты':'Валюты проекта')+'">'+items.map(c=>'<span class="currency-item" title="'+E(c.name||c.ticker)+'"><span class="coin-icon">'+V5ProjectVisual.coin(c)+'</span><span>'+E(c.ticker||c.name)+'</span></span>').join('')+'</div></section>';
}
function html(p,view='cards',layout){return group(p,'coins',view,layout)+group(p,'internalCurrencies',view,layout)}
function paint(root,p,view,layout){
 const detail=root.matches('.dossier');let host=root.querySelector('[data-currency-groups]');
 if(!host){host=document.createElement('div');host.dataset.currencyGroups='';host.className='currency-groups';if(detail){const coins=root.querySelector('#coins');if(!coins)return;coins.before(host)}else (root.querySelector('.card-body,.row-bottom')||root).append(host)}
 const markup=html(p,view,layout);if(host.innerHTML!==markup)host.innerHTML=markup;host.hidden=!markup;
 if(detail){for(const sel of ['#coins','#coin-detail','.coin-heading','[data-project-copy="copy15"]']){const n=root.querySelector(sel);if(n)n.hidden=true}}
}
window.V5Currencies={html,paint};
})();
