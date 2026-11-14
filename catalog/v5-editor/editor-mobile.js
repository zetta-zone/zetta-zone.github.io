/* Workspace controls only: never write card styles or target-device settings. */
(()=>{'use strict';
const body=document.body,side=document.querySelector('#host-side'),layout=document.querySelector('.ve-host-layout');
const portrait=matchMedia('(orientation:portrait)'),touch=matchMedia('(pointer:coarse)');
function bottom(){return (touch.matches||navigator.maxTouchPoints>0)&&portrait.matches}
const storage='zz-v5-editor-panel-v1';let state={hidden:false,height:.25,width:.26,expanded:false,compactControls:true};
try{const saved=localStorage.getItem(storage);if(saved)Object.assign(state,JSON.parse(saved));else if((touch.matches||navigator.maxTouchPoints>0)&&Math.min(screen.width,screen.height)<600)state.hidden=true}catch{}
state.height=Math.min(.85,Math.max(.2,Number(state.height)||.25));state.width=Math.min(.58,Math.max(.15,Number(state.width)||.26));
const bar=document.createElement('div');bar.className='ve-panel-controls';bar.setAttribute('aria-label','Положение и размер панели');
const catalogLink=document.querySelector('.ve-host-top>a');
if(catalogLink){catalogLink.classList.add('ve-panel-back');catalogLink.textContent='← Каталог';bar.append(catalogLink)}
const viewLabel=document.querySelector('#host-view')?.closest('label');
const deviceLabel=document.querySelector('#host-device')?.closest('label');
if(viewLabel){viewLabel.classList.add('ve-panel-context');bar.append(viewLabel)}
if(deviceLabel){deviceLabel.classList.add('ve-panel-context');bar.append(deviceLabel)}
const fitButton=document.querySelector('#host-fit');
if(fitButton){fitButton.classList.add('ve-panel-fit');bar.append(fitButton)}
const zoomLabel=document.querySelector('#host-zoom')?.closest('label');
if(zoomLabel){zoomLabel.classList.add('ve-panel-zoom');bar.append(zoomLabel)}

function button(text,label,action){const b=document.createElement('button');b.type='button';b.textContent=text;b.title=label;b.setAttribute('aria-label',label);b.onclick=action;bar.append(b);return b}
const settings=button('Вид / масштаб','Показать или скрыть выбор режима, устройства и масштаб просмотра',()=>{state.compactControls=!state.compactControls;apply()});settings.className='ve-panel-settings';settings.setAttribute('aria-expanded',String(!state.compactControls));
const grip=button('⠿','Изменить размер панели: перетащите или используйте стрелки',()=>{});grip.className='ve-panel-grip';
const expand=button('↕','Развернуть / свернуть панель',()=>{state.expanded=!state.expanded;apply()});expand.className='ve-panel-expand';
const dock=button('⇆','Перенести панель слева / справа',()=>window.V5EditorHost.dock());dock.className='ve-panel-dock';
const hideButton=button('Скрыть','Скрыть панель редактора',()=>{state.hidden=true;apply();open.focus()});hideButton.className='ve-panel-hide';
const open=document.createElement('button');open.id='host-panel-open';open.textContent='✎ Редактировать';open.title='Открыть панель редактора';open.setAttribute('aria-label',open.title);open.setAttribute('aria-controls','host-side');open.onclick=()=>{state.hidden=false;apply();bar.querySelector('button').focus()};document.querySelector('.ve-host-top').append(open);
const splitter=document.createElement('div');splitter.className='ve-panel-divider';splitter.setAttribute('role','separator');splitter.tabIndex=0;splitter.title='Потяните границу, чтобы изменить размер панели';splitter.setAttribute('aria-label','Изменить ширину или высоту панели редактора');
function minWidth(){return Math.min(.55,Math.max(.15,245/Math.max(1,layout.clientWidth)))}
function persist(){try{localStorage.setItem(storage,JSON.stringify(state))}catch{}}
function apply(){body.classList.toggle('ve-panel-hidden',!!state.hidden);body.classList.toggle('ve-panel-bottom',bottom());body.classList.toggle('ve-controls-compact',!!state.compactControls);settings.setAttribute('aria-expanded',String(!state.compactControls));body.classList.toggle('ve-panel-expanded',!!state.expanded);side.inert=!!state.hidden;side.setAttribute('aria-hidden',String(!!state.hidden));open.hidden=!state.hidden;open.setAttribute('aria-expanded',String(!state.hidden));expand.setAttribute('aria-expanded',String(!!state.expanded));const vertical=bottom();splitter.hidden=!!state.hidden;splitter.setAttribute('aria-orientation',vertical?'horizontal':'vertical');splitter.setAttribute('aria-valuemin',String(vertical?20:Math.round(minWidth()*100)));splitter.setAttribute('aria-valuemax',String(vertical?85:58));splitter.setAttribute('aria-valuenow',String(Math.round((vertical?state.height:state.width)*100)));const h=state.expanded?.72:state.height;layout.style.setProperty('--panel-height',h*100+'%');layout.style.setProperty('--panel-width',state.width*100+'%');persist()}
function mount(){if(!side.contains(bar))side.prepend(bar);if(!side.contains(splitter))side.append(splitter);apply()}
addEventListener('ve:panel-mounted',mount);mount();
window.V5EditorHost.elementSelected=()=>{ /* Selection must not reopen a hidden phone panel. */ };
let drag=null;
function startDrag(e){if(e.button!==0)return;const handle=e.currentTarget;drag={handle,x:e.clientX,y:e.clientY,h:side.offsetHeight,w:side.offsetWidth,bottom:bottom(),right:body.classList.contains('ve-dock-right')};handle.setPointerCapture(e.pointerId);body.classList.add('ve-panel-resizing');e.preventDefault()}
function moveDrag(e){if(!drag||drag.handle!==e.currentTarget)return;if(drag.bottom){state.expanded=false;state.height=Math.min(.85,Math.max(.2,(drag.h+drag.y-e.clientY)/Math.max(1,layout.clientHeight)))}else state.width=Math.min(.58,Math.max(minWidth(),(drag.w+(e.clientX-drag.x)*(drag.right?-1:1))/Math.max(1,layout.clientWidth)));apply()}
function stopDrag(){drag=null;body.classList.remove('ve-panel-resizing')}
function keyResize(e){if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();if(bottom()){state.expanded=false;state.height=Math.min(.85,Math.max(.2,state.height+(e.key==='ArrowUp'?.025:e.key==='ArrowDown'?-.025:0)))}else{const dir=body.classList.contains('ve-dock-right')?1:-1;state.width=Math.min(.58,Math.max(minWidth(),state.width+(e.key==='ArrowLeft'?.025*dir:e.key==='ArrowRight'?-.025*dir:0)))}apply()}
for(const handle of [grip,splitter]){handle.onpointerdown=startDrag;handle.onpointermove=moveDrag;handle.onpointerup=stopDrag;handle.onpointercancel=stopDrag;handle.onkeydown=keyResize}
// VisualViewport tracks Safari's keyboard and browser chrome without reloading the iframe.
let focusTimer;
function viewport(){const v=visualViewport;body.style.setProperty('--editor-height',(v?v.height:innerHeight)+'px');body.style.setProperty('--editor-top',(v?v.offsetTop:0)+'px');const keyboard=!!v&&innerHeight-v.height>120;body.classList.toggle('ve-keyboard',keyboard);clearTimeout(focusTimer);if(keyboard&&side.contains(document.activeElement))focusTimer=setTimeout(()=>document.activeElement.scrollIntoView({block:'nearest'}),100)}
visualViewport?.addEventListener('resize',viewport);visualViewport?.addEventListener('scroll',viewport);addEventListener('resize',()=>{viewport();apply()});portrait.addEventListener('change',apply);addEventListener('orientationchange',()=>{apply();requestAnimationFrame(apply)});
new ResizeObserver(()=>{side.classList.toggle('ve-narrow',side.clientWidth<355);side.classList.toggle('ve-tight',side.clientWidth<275)}).observe(side);
side.addEventListener('focusin',e=>{if(!e.target.matches('input,textarea,select'))return;viewport()});viewport();apply();
})();
