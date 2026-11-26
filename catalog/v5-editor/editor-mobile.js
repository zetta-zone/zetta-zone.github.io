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
let phoneSettingsOpen=false,phoneMenuCollapsed=false,phoneMenu=null;
let phoneToolbarScroll=[0,0];
const phoneSettings=document.createElement('section');
phoneSettings.id='ve-phone-view-settings';
phoneSettings.setAttribute('aria-label','Настройки редактора');
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

function button(text,label,action,parent=bar){const b=document.createElement('button');b.type='button';b.textContent=text;b.title=label;b.setAttribute('aria-label',label);b.onclick=action;parent.append(b);return b}
const settings=button('Вид / масштаб','Показать или скрыть выбор вида, устройства и масштаба',()=>{
 if(phone()&&phoneMenu){
  phoneSettingsOpen=!phoneSettingsOpen;
  apply();
  if(phoneSettingsOpen)phoneMenu.inspector.scrollTo(0,0);
 }else{
  state.compactControls=!state.compactControls;
  apply();
 }
});
settings.className='ve-panel-settings';
const grip=button('⠿','Изменить размер панели: перетащите или используйте стрелки',()=>{});grip.className='ve-panel-grip';
const expand=button('↕','Развернуть / свернуть панель',()=>{state.expanded=!state.expanded;apply()});expand.className='ve-panel-expand';
const dock=button('⇆','Перенести панель слева / справа',()=>window.V5EditorHost.dock());dock.className='ve-panel-dock';
const phoneDock=document.createElement('button');
phoneDock.type='button';
phoneDock.onclick=()=>{window.V5EditorHost.dock();updatePhoneDock()};
function updatePhoneDock(){phoneDock.textContent=window.V5EditorHost.currentDock()==='right'?'Панель слева':'Панель справа'}
phoneSettings.append(phoneDock);
const hideButton=button('Скрыть','Скрыть панель редактора',()=>{state.hidden=true;phoneSettingsOpen=false;apply();open.focus()});hideButton.className='ve-panel-hide';
const open=document.createElement('button');open.id='host-panel-open';open.textContent='✎ Редактировать';open.title='Открыть панель редактора';open.setAttribute('aria-label',open.title);open.setAttribute('aria-controls','host-side');open.onclick=()=>{state.hidden=false;apply();(phoneMenu?.save||bar.querySelector('button')).focus({preventScroll:true})};document.querySelector('.ve-host-top').append(open);
const splitter=document.createElement('div');splitter.className='ve-panel-divider';splitter.setAttribute('role','separator');splitter.tabIndex=0;splitter.title='Потяните границу, чтобы изменить размер панели';splitter.setAttribute('aria-label','Изменить ширину или высоту панели редактора');
function minWidth(){return Math.min(.55,Math.max(.15,245/Math.max(1,layout.clientWidth)))}
function persist(){try{localStorage.setItem(storage,JSON.stringify(state))}catch{}}
function apply(){
 const isPhone=phone(),isTablet=tablet(),vertical=bottom(),showSettings=isPhone&&!!phoneMenu&&phoneSettingsOpen&&!phoneMenuCollapsed&&!state.hidden;
 body.classList.toggle('ve-phone',isPhone);
 body.classList.toggle('ve-tablet',isTablet);
 if(isTablet)state.width=Math.min(.38,Math.max(minWidth(),state.width));
 body.classList.toggle('ve-panel-hidden',!!state.hidden);
 body.classList.toggle('ve-panel-bottom',vertical);
 body.classList.toggle('ve-controls-compact',isPhone||!!state.compactControls);
 body.classList.toggle('ve-phone-view-open',showSettings);
 phoneSettings.hidden=!showSettings;
 phoneDock.hidden=vertical;
 if(phoneMenu){
  const {commands,context,views,toggle,pin}=phoneMenu;
  if(phoneMenuCollapsed&&!context.hidden)phoneToolbarScroll=[commands.scrollLeft,views.scrollLeft];
  const reopening=!phoneMenuCollapsed&&context.hidden;
  commands.hidden=phoneMenuCollapsed;
  context.hidden=phoneMenuCollapsed;
  if(reopening){
   commands.scrollLeft=phoneToolbarScroll[0];
   views.scrollLeft=phoneToolbarScroll[1];
  }
  toggle.textContent=phoneMenuCollapsed?'Меню ▾':'▴';
  toggle.setAttribute('aria-label',phoneMenuCollapsed?'Раскрыть меню':'Свернуть меню');
  toggle.setAttribute('aria-expanded',String(!phoneMenuCollapsed));
  pin.setAttribute('aria-pressed',String(!!state.phoneMenuPinned));
  updatePhoneDock();
 }
 if(isPhone&&phoneMenu){
  settings.textContent='⚙';
  settings.setAttribute('aria-controls',phoneSettings.id);
 }else{
  settings.textContent='Вид / масштаб';
  settings.removeAttribute('aria-controls');
 }
 settings.setAttribute('aria-label',showSettings?'Закрыть настройки редактора':isPhone&&phoneMenu?'Настройки редактора':'Вид и масштаб карточки');
 settings.setAttribute('aria-expanded',String(isPhone&&phoneMenu?showSettings:!state.compactControls));
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
function scrollRow(name,className){
 const row=document.createElement('div');
 row.className=className;
 row.tabIndex=0;
 row.setAttribute('role','region');
 row.setAttribute('aria-label',name);
 return row;
}
function mountPhoneToolbar(panel){
 if(phoneMenu)return;
 const quick=panel.querySelector('.ve-quick-actions');
 const save=quick?.querySelector('[data-action=save]');
 const project=panel.querySelector('.ve-open-data');
 if(!save||!project)return;

 const toolbar=document.createElement('div');
 toolbar.className='ve-phone-toolbar';
 const primary=document.createElement('div');
 primary.className='ve-phone-primary';
 const commands=scrollRow('Подсказки и команды редактора','ve-phone-commands ve-phone-scroll');
 commands.id='ve-phone-commands';
 for(const [action,label] of [['undo','Отменить'],['redo','Повторить']]){
  const command=quick.querySelector('[data-action='+action+']');
  command.setAttribute('aria-label',label);
  commands.append(command);
 }
 const pin=button('📌','Закрепить меню открытым',()=>{
  state.phoneMenuPinned=!state.phoneMenuPinned;
  apply();
 },commands);
 primary.append(save,commands);
 const toggle=button('▴','Свернуть меню',()=>{
  phoneMenuCollapsed=!phoneMenuCollapsed;
  if(phoneMenuCollapsed)state.phoneMenuPinned=false;
  apply();
 },primary);
 toggle.setAttribute('aria-controls','ve-phone-commands ve-phone-context');
 toggle.dataset.originalHelp='Сворачивает или раскрывает меню. Сохранение и инструменты редактирования доступны в обоих состояниях.';
 pin.dataset.originalHelp='Оставляет обе строки открытыми при выборе элемента и редактировании карточки.';
 settings.dataset.originalHelp='Открывает настройки панели, масштаб по ширине и переключатель контуров родителей.';

 const context=document.createElement('div');
 context.id='ve-phone-context';
 context.className='ve-phone-context';
 const views=scrollRow('Вид, проект, устройство и масштаб. Прокрутка влево и вправо','ve-phone-scroll');
 views.append(viewLabel,project,deviceLabel,zoomLabel);
 context.append(views,settings);
 toolbar.append(primary,context);

 quick.parentElement.querySelector('.ve-tabs')?.after(quick);
 const inspector=document.createElement('div');
 inspector.className='ve-phone-inspector';
 phoneSettings.prepend(fitButton,expand,hideButton,catalogLink);
 inspector.append(phoneSettings,...panel.children);
 panel.append(toolbar,inspector);
 phoneMenu={commands,context,views,toggle,pin,save,inspector};
 inspector.addEventListener('click',event=>{
  const tab=event.target.closest('[data-pane-tab]');
  if(tab){
   const pane=panel.querySelector('#'+tab.getAttribute('aria-controls'));
   if(pane&&!pane.hidden)pane.scrollIntoView({block:'start',inline:'nearest'});
  }
  if(event.target.closest('.ve-element-tools button:not([data-structure-help]),.ve-touch-actions button,[data-action=hide],[data-action=recover],[data-action=move]'))startEditing();
 });
 for(const event of ['input','change'])inspector.addEventListener(event,e=>{
  if(!e.target.closest('#ve-phone-view-settings,.ve-project-picker'))startEditing();
 });
}
window.V5EditorHost.unmountPhoneToolbar=()=>{
 if(!phoneMenu)return;
 if(!phoneMenuCollapsed)phoneToolbarScroll=[phoneMenu.commands.scrollLeft,phoneMenu.views.scrollLeft];
 bar.append(catalogLink,viewLabel,deviceLabel,fitButton,zoomLabel,settings,expand,hideButton);
 phoneSettings.remove();
 phoneMenu=null;
};
function mount(){
 if(!side.contains(bar))side.prepend(bar);
 if(!side.contains(splitter))side.append(splitter);
 const panel=side.querySelector('.ve-panel');
 if(phone()&&panel)mountPhoneToolbar(panel);
 apply();
 if(phoneMenu&&!phoneMenuCollapsed){
  phoneMenu.commands.scrollLeft=phoneToolbarScroll[0];
  phoneMenu.views.scrollLeft=phoneToolbarScroll[1];
 }
}
function startEditing(){
 if(!phoneMenu||!phone())return;
 const collapse=!state.phoneMenuPinned&&!phoneMenuCollapsed;
 if(!collapse&&!phoneSettingsOpen)return;
 if(collapse){
  if(phoneMenu.context.contains(document.activeElement)||phoneMenu.commands.contains(document.activeElement)){
   phoneMenu.toggle.focus({preventScroll:true});
  }
  phoneMenuCollapsed=true;
 }
 phoneSettingsOpen=false;
 apply();
}
addEventListener('ve:panel-mounted',mount);mount();
window.V5EditorHost.elementSelected=startEditing;
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
