/* Workspace controls only: never write card styles or target-device settings. */
(()=>{'use strict';
const body=document.body,side=document.querySelector('#host-side'),layout=document.querySelector('.ve-host-layout');
const portrait=matchMedia('(orientation:portrait)'),touch=matchMedia('(pointer:coarse)');
const hasTouch=()=>touch.matches||navigator.maxTouchPoints>0;
const phone=()=>hasTouch()&&Math.min(screen.width,screen.height)<600;
const tablet=()=>hasTouch()&&!phone()&&innerWidth>=700;
const bottom=()=>hasTouch()&&portrait.matches&&!tablet();
const storage='zz-v5-editor-panel-v1';let state={hidden:false,height:.25,width:.26,expanded:false,compactControls:true};
try{const saved=localStorage.getItem(storage);if(saved)Object.assign(state,JSON.parse(saved));}catch{}
state.height=Math.min(.85,Math.max(.2,Number(state.height)||.25));state.width=Math.min(.58,Math.max(.15,Number(state.width)||.26));
let phoneSettingsOpen=false,phoneToolbarScroll=0;
const phoneSettings=document.createElement('section');
phoneSettings.id='ve-phone-view-settings';
phoneSettings.setAttribute('aria-label','Вид и масштаб карточки');
phoneSettings.hidden=true;
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
const settings=button('Вид / масштаб','Показать или скрыть выбор вида, устройства и масштаба',()=>{
 if(phone()){
  phoneSettingsOpen=!phoneSettingsOpen;
  if(phoneSettingsOpen){
   const panel=settings.closest('.ve-panel');
   if(panel)panel.scrollTop=0;
  }
 }
 else state.compactControls=!state.compactControls;
 apply();
});
settings.className='ve-panel-settings';
const grip=button('⠿','Изменить размер панели: перетащите или используйте стрелки',()=>{});grip.className='ve-panel-grip';
const expand=button('↕','Развернуть / свернуть панель',()=>{state.expanded=!state.expanded;apply()});expand.className='ve-panel-expand';
const dock=button('⇆','Перенести панель слева / справа',()=>window.V5EditorHost.dock());dock.className='ve-panel-dock';
const phoneDock=document.createElement('button');
phoneDock.type='button';
phoneDock.onclick=()=>{window.V5EditorHost.dock();updatePhoneDock()};
function updatePhoneDock(){phoneDock.textContent=window.V5EditorHost.currentDock()==='right'?'Панель слева':'Панель справа'}
const contextControls=[viewLabel,deviceLabel,fitButton,zoomLabel].filter(Boolean);
phoneSettings.append(phoneDock);
bar.append(phoneSettings);
const hideButton=button('Скрыть','Скрыть панель редактора',()=>{state.hidden=true;phoneSettingsOpen=false;apply();open.focus()});hideButton.className='ve-panel-hide';
const phoneCommands=[settings,expand,hideButton,catalogLink].filter(Boolean);
const open=document.createElement('button');open.id='host-panel-open';open.textContent='✎ Редактировать';open.title='Открыть панель редактора';open.setAttribute('aria-label',open.title);open.setAttribute('aria-controls','host-side');open.onclick=()=>{state.hidden=false;apply();(side.querySelector('.ve-phone-toolbar>[data-action=save]')||bar.querySelector('button')).focus({preventScroll:true})};document.querySelector('.ve-host-top').append(open);
const splitter=document.createElement('div');splitter.className='ve-panel-divider';splitter.setAttribute('role','separator');splitter.tabIndex=0;splitter.title='Потяните границу, чтобы изменить размер панели';splitter.setAttribute('aria-label','Изменить ширину или высоту панели редактора');
function minWidth(){return Math.min(.55,Math.max(.15,245/Math.max(1,layout.clientWidth)))}
function persist(){try{localStorage.setItem(storage,JSON.stringify(state))}catch{}}
function apply(){
 const isPhone=phone(),isTablet=tablet(),vertical=bottom(),showSettings=isPhone&&phoneSettingsOpen&&!state.hidden;
 body.classList.toggle('ve-phone',isPhone);
 body.classList.toggle('ve-tablet',isTablet);
 if(isTablet)state.width=Math.min(.38,Math.max(minWidth(),state.width));
 body.classList.toggle('ve-panel-hidden',!!state.hidden);
 body.classList.toggle('ve-panel-bottom',vertical);
 body.classList.toggle('ve-controls-compact',isPhone||!!state.compactControls);
 body.classList.toggle('ve-phone-view-open',showSettings);
 if(isPhone&&contextControls[0]?.parentNode!==phoneSettings)phoneSettings.prepend(...contextControls);
 if(!isPhone&&contextControls[0]?.parentNode!==bar)settings.before(...contextControls);
 phoneSettings.hidden=!showSettings;
 phoneDock.hidden=vertical;
 if(isPhone){
  settings.setAttribute('aria-controls',phoneSettings.id);
  updatePhoneDock();
 }else settings.removeAttribute('aria-controls');
 settings.textContent=showSettings?'К редактированию':'Вид / масштаб';
 settings.setAttribute('aria-label',showSettings?'К редактированию':'Вид и масштаб карточки');
 settings.setAttribute('aria-expanded',String(isPhone?showSettings:!state.compactControls));
 side.inert=!!state.hidden;
 side.setAttribute('aria-hidden',String(!!state.hidden));
 open.hidden=!state.hidden;
 open.setAttribute('aria-expanded',String(!state.hidden));
 expand.setAttribute('aria-expanded',String(!!state.expanded));
 splitter.hidden=!!state.hidden;
 splitter.setAttribute('aria-orientation',vertical?'horizontal':'vertical');
 splitter.setAttribute('aria-valuemin',String(vertical?20:Math.round(minWidth()*100)));
 splitter.setAttribute('aria-valuemax',String(vertical?85:isTablet?38:58));
 splitter.setAttribute('aria-valuenow',String(Math.round((vertical?state.height:state.width)*100)));
 const height=state.expanded?(isPhone?.60:.72):state.height;
 layout.style.setProperty('--panel-height',height*100+'%');
 layout.style.setProperty('--panel-width',state.width*100+'%');
 persist();
}
function mountPhoneToolbar(panel){
 if(panel.querySelector('.ve-phone-toolbar'))return;
 const tabs=panel.querySelector('.ve-tabs'),quick=panel.querySelector('.ve-quick-actions');
 const save=quick?.querySelector('[data-action=save]');
 if(!tabs||!save)return;
 const row=document.createElement('div');
 row.className='ve-phone-toolbar';
 const commands=document.createElement('div');
 commands.className='ve-phone-toolbar-scroll';
 commands.tabIndex=0;
 commands.setAttribute('role','region');
 commands.setAttribute('aria-label','Команды редактора, прокрутка влево и вправо');
 commands.append(tabs,quick,...phoneCommands);
 row.append(save,commands);
 panel.prepend(row,phoneSettings);
 commands.scrollLeft=phoneToolbarScroll;
 commands.addEventListener('click',event=>{
  const tab=event.target.closest('[data-pane-tab]');
  if(!tab)return;
  if(phoneSettingsOpen){phoneSettingsOpen=false;apply()}
  const pane=panel.querySelector('#'+tab.getAttribute('aria-controls'));
  if(pane&&!pane.hidden)panel.scrollTop+=pane.getBoundingClientRect().top-row.getBoundingClientRect().bottom;
 });
}
window.V5EditorHost.unmountPhoneToolbar=()=>{
 const commands=side.querySelector('.ve-phone-toolbar-scroll');
 if(!commands)return;
 phoneToolbarScroll=commands.scrollLeft;
 bar.append(catalogLink,settings,expand,phoneSettings,hideButton);
};
function mount(){
 if(!side.contains(bar))side.prepend(bar);
 if(!side.contains(splitter))side.append(splitter);
 const panel=side.querySelector('.ve-panel');
 if(phone()&&panel)mountPhoneToolbar(panel);
 apply();
}
addEventListener('ve:panel-mounted',mount);mount();
window.V5EditorHost.elementSelected=()=>{
 if(phoneSettingsOpen){phoneSettingsOpen=false;apply()}
};
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
