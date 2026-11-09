(()=>{'use strict';
const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname),requested=new URLSearchParams(location.search).get('editor')==='1';
if(!document.querySelector('.dossier')){
 if(local){const a=document.createElement('a');a.className='lab-launch';a.href='detail.html?project=hashgarden-demo&editor=1';a.textContent='Редактор ПК · локально';document.body.append(a)}return;
}
const close=document.querySelector('.close-card');document.body.append(close);close.classList.add('lab-close');
const desktop=matchMedia('(min-width:1001px)'),key='zz-v5-lab-layout-desktop-v1';
// Stable slots keep a shared configuration even when a project has no note.
for(const cls of ['action-note','draft-notice'])if(!document.querySelector('.passport>.'+cls)){const n=document.createElement('div');n.className=cls;n.dataset.preserveContent='';n.hidden=true;document.querySelector('.passport').append(n)}
const specs=[
 ['identity','.identity','Название, логотип и описание','hero',1,1,10],
 ['tools','.header-tools','Избранное','hero',1,11,2],
 ['stats','.overview-metrics','Статистика','hero',2,1,12],
 ['gallery','.visual-story','Галерея и подписи','hero',3,1,7],
 ['tag','.passport>.eyebrow','Слоган','hero',3,8,5],
 ['headline','.passport>h2','Заголовок проекта','hero',4,8,5],
 ['unique','.passport>.unique','Особенности','hero',5,8,5],
 ['ratings','.passport>.ratings','Оценки','hero',6,8,5],
 ['check','.passport>.verification','Статус проверки','hero',7,8,5],
 ['facts','.passport>.quick-facts','Краткие условия','hero',8,8,5],
 ['actions','.passport>.primary-actions','Регистрация и сравнение','hero',9,8,5],
 ['note','.passport>.action-note','Примечание к регистрации','hero',10,8,5],
 ['warning','.passport>.draft-notice','Уведомление проекта','hero',11,1,12],
 ...['overview','features','mechanics','finance','balance','verification','verdict'].map((id,i)=>[id,'#'+id,({overview:'Обзор',features:'Возможности',mechanics:'Механика',finance:'Финансы',balance:'Плюсы и минусы',verification:'Проверка',verdict:'Итог'})[id],'sections',i+1,1,12])
];
const blocks=specs.map(([id,selector,label,zone,row,col,span])=>({id,node:document.querySelector(selector),label,zone,row,col,span})).filter(b=>b.node);
const zones={hero:document.querySelector('#hero'),sections:document.querySelector('.main-content')};
for(const [id,node]of Object.entries(zones))node.dataset.labZone=id;
for(const b of blocks){b.node.dataset.labBlock=b.id;b.node.dataset.labLabel=b.label}
const defaults={schema:'zetta-v5-lab-desktop',version:1,gap:18,blocks:Object.fromEntries(blocks.map(b=>[b.id,{zone:b.zone,row:b.row,col:b.col,span:b.span,rows:b.id==='gallery'?8:1,width:100,height:0,pad:12,align:'start',justify:'stretch',x:0,y:0}]))};
function validate(raw){
 if(!raw||raw.schema!==defaults.schema||raw.version!==1||!raw.blocks||Array.isArray(raw.blocks))throw Error('Неверная схема или версия JSON');
 const result=structuredClone(defaults);const num=(v,min,max)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error('Число вне допустимого диапазона');return v};
 result.gap=num(raw.gap,18,64);
 if(Object.keys(raw.blocks).length!==blocks.length)throw Error('Неполный набор блоков');
 for(const b of blocks){const v=raw.blocks[b.id];if(!v||v.zone!==b.zone)throw Error('Неизвестный блок или зона');const c={zone:b.zone};
 for(const [k,min,max]of [['row',1,100],['rows',1,12],['col',1,12],['span',1,12],['width',25,100],['height',0,1200],['pad',0,80],['x',-8,8],['y',-8,8]])c[k]=num(v[k],min,max);
 if(![c.row,c.col,c.span,c.rows].every(Number.isInteger)||c.col+c.span>13)throw Error('Блок выходит за сетку');
 for(const k of ['align','justify']){if(!['start','center','end','stretch'].includes(v[k]))throw Error('Неверное выравнивание');c[k]=v[k]}
 result.blocks[b.id]=c;
 }
 for(const a of blocks)for(const b of blocks){if(a.id>=b.id)continue;const x=result.blocks[a.id],y=result.blocks[b.id];if(x.zone===y.zone&&x.row<y.row+y.rows&&y.row<x.row+x.rows&&x.col<y.col+y.span&&y.col<x.col+x.span)throw Error('Блоки пересекаются в сетке')}
 return result;
}
let config=structuredClone(defaults),saved=JSON.stringify(defaults),selected=blocks[0].id,history=[],future=[],editing=false,panel;
try{const stored=localStorage.getItem(key);if(stored){config=validate(JSON.parse(stored));saved=JSON.stringify(config)}}catch(e){console.warn('V5 lab: saved layout ignored:',e.message)}
function apply(){document.body.classList.toggle('lab-layout',desktop.matches);for(const b of blocks){const c=config.blocks[b.id];for(const [k,v]of Object.entries({col:c.col,span:c.span,row:c.row,rows:c.rows,width:c.width+'%',height:c.height+'px',pad:c.pad+'px',align:c.align,justify:c.justify,x:c.x+'px',y:c.y+'px'}))b.node.style.setProperty('--lab-'+k,v);b.node.classList.toggle('lab-selected',editing&&b.id===selected)}for(const z of Object.values(zones))z.style.setProperty('--lab-gap',config.gap+'px');if(panel)refresh()}
function status(s){if(panel)panel.querySelector('.lab-status').textContent=s}
function commit(next){try{next=validate(next);if(JSON.stringify(next)===JSON.stringify(config))return;history.push(structuredClone(config));if(history.length>100)history.shift();future=[];config=next;apply();status('Есть несохранённые изменения')}catch(e){status(e.message);refresh()}}
function settle(next,id){const c=next.blocks[id];for(const b of blocks){if(b.id===id)continue;const t=next.blocks[b.id];if(t.zone===c.zone&&t.row<c.row+c.rows&&c.row<t.row+t.rows&&t.col<c.col+c.span&&c.col<t.col+t.span)t.row=Math.max(...Object.values(next.blocks).filter(v=>v.zone===t.zone).map(v=>v.row+v.rows))}return next}
function swap(a,b){if(a===b)return;const next=structuredClone(config),x=next.blocks[a],y=next.blocks[b];if(x.zone!==y.zone){status('Перемещение доступно внутри своей зоны: шапка или разделы.');return}for(const k of ['row','col','span','rows']){const temp=x[k];x[k]=y[k];y[k]=temp}commit(next)}
function change(field,value){const next=structuredClone(config);if(field==='gap')next.gap=+value;else{const c=next.blocks[selected];c[field]=['align','justify'].includes(field)?value:+value;if(field==='col'||field==='span'){c.span=Math.min(c.span,13-c.col)}settle(next,selected)}commit(next)}
function refresh(){panel.querySelector('[data-select]').value=selected;const c=config.blocks[selected];for(const input of panel.querySelectorAll('[data-field]'))input.value=input.dataset.field==='gap'?config.gap:c[input.dataset.field];panel.querySelector('[data-undo]').disabled=!history.length;panel.querySelector('[data-redo]').disabled=!future.length;panel.querySelector('[data-dirty]').textContent=JSON.stringify(config)===saved?'Сохранено в этом браузере':'Не сохранено';const swapSelect=panel.querySelector('[data-swap-target]');for(const o of swapSelect.options)o.disabled=config.blocks[o.value].zone!==c.zone||o.value===selected}
function select(id){selected=id;apply()}
function enable(){if(!local||!desktop.matches)return;resetSections();editing=true;document.body.classList.add('lab-editing');if(!panel)createPanel();panel.hidden=false;apply();status('Перетащите блок: центр — обмен; верх/низ — новая строка. Слева/справа — соседняя колонка.');}
function disable(){editing=false;document.body.classList.remove('lab-editing');if(panel)panel.hidden=true;apply()}
function createPanel(){panel=document.createElement('aside');panel.className='lab-panel';panel.dataset.preserveContent='';panel.setAttribute('aria-label','Визуальный редактор ПК');
const numeric=[['row','Строка',1,100],['rows','Высота в строках',1,12],['col','Колонка',1,12],['span','Ширина в колонках',1,12],['width','Ширина, %',25,100],['height','Мин. высота, px',0,1200],['pad','Внутр. отступ, px',0,80],['x','Смещение X, px',-8,8],['y','Смещение Y, px',-8,8],['gap','Между блоками, px',18,64]];
panel.innerHTML='<h2>Редактор ПК</h2><p>Локальная лаборатория · общая компоновка для всех проектов. Данные и оформление проектов сохраняются.</p><label>Проект<select data-project-pick></select></label><label>Блок<select data-select></select></label>'+numeric.map(([id,label,min,max])=>`<label>${label}<input type="number" data-field="${id}" min="${min}" max="${max}" step="1"></label>`).join('')+['align','justify'].map((id,i)=>`<label>${i?'По горизонтали':'По вертикали'}<select data-field="${id}"><option value="start">Начало</option><option value="center">Центр</option><option value="end">Конец</option><option value="stretch">Растянуть</option></select></label>`).join('')+'<p>Сетка: 12 колонок. Смещение ±8 px внутри защитного промежутка. Конфликтующий блок переносится в свободную строку.</p><label>Обмен с<select data-swap-target></select></label><div class="lab-actions"><button data-swap>Поменять местами</button><button data-reset-one>Вернуть блок</button></div><hr><div class="lab-actions"><button data-save>Сохранить</button><button data-undo>Отменить</button><button data-redo>Повторить</button><button data-reset>Исходная компоновка</button><button data-export>Экспорт JSON</button><button data-import>Импорт JSON</button><button data-exit>Выйти</button></div><details><summary>JSON текстом</summary><textarea data-json aria-label="Настройки JSON" rows="6" style="width:100%;box-sizing:border-box"></textarea><div class="lab-actions"><button data-json-show>Показать текущий JSON</button><button data-json-apply>Применить JSON</button></div></details><input type="file" accept="application/json,.json" data-file hidden><b data-dirty></b><p class="lab-status" role="status"></p><hr><p>Следующий этап: Новая карточка · Адрес проекта · Загрузить данные. Автоимпорт пока не подключён.</p>';
document.body.append(panel);
for(const b of blocks)for(const sel of panel.querySelectorAll('[data-select],[data-swap-target]'))sel.add(new Option(b.label,b.id));
const picker=panel.querySelector('[data-project-pick]');for(const pr of V4_PROJECTS)picker.add(new Option(pr.name,pr.id));picker.value=p.id;picker.onchange=()=>{if(JSON.stringify(config)!==saved){status('Сначала сохраните или экспортируйте компоновку перед сменой проекта.');picker.value=p.id;return}location.href='detail.html?project='+encodeURIComponent(picker.value)+'&editor=1'};
panel.querySelector('[data-select]').onchange=e=>select(e.target.value);
for(const input of panel.querySelectorAll('[data-field]'))input.onchange=()=>change(input.dataset.field,input.value);
const bind=(s,f)=>panel.querySelector(s).onclick=f;
bind('[data-swap]',()=>swap(selected,panel.querySelector('[data-swap-target]').value));
bind('[data-reset-one]',()=>{const n=structuredClone(config);n.blocks[selected]=structuredClone(defaults.blocks[selected]);commit(settle(n,selected))});
bind('[data-save]',()=>{try{localStorage.setItem(key,JSON.stringify(config));if(localStorage.getItem(key)!==JSON.stringify(config))throw Error();saved=JSON.stringify(config);refresh();status('Сохранено. После перезагрузки будет применена эта компоновка.')}catch{status('Не удалось сохранить. Экспортируйте JSON.')}});
bind('[data-undo]',()=>{if(!history.length)return;future.push(structuredClone(config));config=history.pop();apply();status('Изменение отменено')});
bind('[data-redo]',()=>{if(!future.length)return;history.push(structuredClone(config));config=future.pop();apply();status('Изменение повторено')});
bind('[data-reset]',()=>commit(structuredClone(defaults)));
bind('[data-export]',()=>{const blob=new Blob([JSON.stringify(config,null,2)],{type:'application/json'}),a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='zetta-v5-lab-desktop.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Экспортирован текущий вариант')});
bind('[data-json-show]',()=>panel.querySelector('[data-json]').value=JSON.stringify(config,null,2));bind('[data-json-apply]',()=>{try{const raw=panel.querySelector('[data-json]').value;if(raw.length>100000)throw Error('JSON слишком большой');commit(validate(JSON.parse(raw)));status('JSON проверен и импортирован. Нажмите «Сохранить».');}catch(e){status('Импорт отклонён: '+e.message)}});
bind('[data-import]',()=>panel.querySelector('[data-file]').click());panel.querySelector('[data-file]').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>100000)throw Error('JSON слишком большой');const parsed=validate(JSON.parse(await f.text()));commit(parsed);status('JSON проверен и импортирован. Нажмите «Сохранить».')}catch(err){status('Импорт отклонён: '+err.message)}finally{e.target.value=''}};
bind('[data-exit]',disable);
}
let dragId=null;
for(const b of blocks){b.node.addEventListener('click',e=>{if(!editing)return;e.preventDefault();e.stopImmediatePropagation();select(b.id)},true);
b.node.addEventListener('dragstart',e=>{if(!editing)return;dragId=b.id;select(b.id);e.dataTransfer.setData('text/plain',b.id);e.dataTransfer.effectAllowed='move'});
b.node.addEventListener('dragover',e=>{if(!editing||!dragId||config.blocks[dragId].zone!==b.zone)return;e.preventDefault();b.node.classList.add('lab-drop')});
b.node.addEventListener('dragleave',()=>b.node.classList.remove('lab-drop'));
b.node.addEventListener('drop',e=>{if(!editing||!dragId)return;e.preventDefault();e.stopPropagation();b.node.classList.remove('lab-drop');const id=dragId;dragId=null;if(id===b.id||config.blocks[id].zone!==b.zone)return;const box=b.node.getBoundingClientRect(),x=(e.clientX-box.left)/box.width,y=(e.clientY-box.top)/box.height;
 if(y<.2||y>.8){const n=structuredClone(config),target=n.blocks[b.id],row=target.row+(y>.8?target.rows:0);for(const c of Object.values(n.blocks))if(c.zone===b.zone&&c.row>=row)c.row+=n.blocks[id].rows;n.blocks[id].row=row;n.blocks[id].col=target.col;n.blocks[id].span=target.span;commit(n)}else if(x<.2||x>.8){const n=structuredClone(config),target=n.blocks[b.id],a=n.blocks[id];if(target.span<2){swap(id,b.id);return}const left=Math.floor(target.span/2),start=target.col,total=target.span;a.row=target.row;if(x<.2){a.col=start;a.span=left;target.col=start+left;target.span=total-left}else{target.span=left;a.col=start+left;a.span=total-left}commit(n)}else swap(id,b.id);
 });b.node.addEventListener('dragend',()=>{dragId=null;blocks.forEach(x=>x.node.classList.remove('lab-drop'))})}
function updateDraggable(){for(const b of blocks)b.node.draggable=editing&&desktop.matches}
const originalApply=apply;apply=function(){originalApply();updateDraggable()};
// Preserve section navigation when viewing, but never let focus mode reparent an edited block.
document.querySelector('.section-nav').addEventListener('click',e=>{if(editing){e.preventDefault();e.stopImmediatePropagation();status('В редакторе все разделы раскрыты. Для навигации выйдите из редактора.')}},true);
if(local){const button=document.createElement('button');button.className='lab-launch';button.textContent='Редактор ПК';button.onclick=enable;document.body.append(button);const availability=()=>{button.hidden=!desktop.matches;if(!desktop.matches)disable();apply()};desktop.addEventListener('change',availability);availability();if(requested)enable()}else apply();
addEventListener('beforeunload',e=>{if(JSON.stringify(config)!==saved){e.preventDefault();e.returnValue=''}});
})();
