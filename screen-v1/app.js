'use strict';
const $ = id => document.getElementById(id);
const requested = document.body.dataset.requested;
const counts = {Назад:0, Регистрация:0, Сравнить:0};
const history = [];
let minHeight = Infinity, maxHeight = 0, frame = 0, latest = {}, lastKey = '', promptEvent;
const round = n => Math.round(n * 10) / 10;
const mq = mode => matchMedia(`(display-mode: ${mode})`).matches;
function snapshot(reason) {
  const v = window.visualViewport;
  const area = {width:round(v ? v.width : innerWidth),height:round(v ? v.height : innerHeight),top:round(v ? v.offsetTop : 0),left:round(v ? v.offsetLeft : 0),scale:round(v ? v.scale : 1)};
  if (!v || v.scale === 1) document.documentElement.style.setProperty('--view-h', area.height+'px');
  minHeight = Math.min(minHeight, area.height); maxHeight = Math.max(maxHeight, area.height);
  const s = getComputedStyle($('safeProbe'));
  const safe = {top:parseFloat(s.paddingTop),right:parseFloat(s.paddingRight),bottom:parseFloat(s.paddingBottom),left:parseFloat(s.paddingLeft)};
  const api = !!(document.fullscreenElement || document.webkitFullscreenElement);
  const manifestMode = ['fullscreen','standalone','minimal-ui','browser'].find(mq) || (navigator.standalone ? 'standalone' : 'browser');
  const actual = api ? 'Fullscreen' : manifestMode === 'fullscreen' ? 'Fullscreen' : manifestMode === 'standalone' || navigator.standalone ? 'Standalone' : 'Browser';
  const bottomButtons = [...document.querySelectorAll('[data-tap]')].map(b => {
    const r=b.getBoundingClientRect();
    return {name:b.dataset.tap,rect:{x:round(r.x),y:round(r.y),width:round(r.width),height:round(r.height)},inViewport:r.top>=area.top-1 && r.bottom<=area.top+area.height+1 && r.left>=area.left-1 && r.right<=area.left+area.width+1};
  });
  latest = {version:'screen-v1',time:new Date().toISOString(),requested,actual,manifestMode,fullscreenAPI:api,fullscreenEnabled:!!document.fullscreenEnabled,iosStandalone:!!navigator.standalone,visible:area,inner:{width:innerWidth,height:innerHeight},document:{width:document.documentElement.clientWidth,height:document.documentElement.clientHeight},screen:{width:screen.width,height:screen.height,dpr:devicePixelRatio},cssHeight:{dvh:round($('dvh').getBoundingClientRect().height),svh:round($('svh').getBoundingClientRect().height),lvh:round($('lvh').getBoundingClientRect().height)},safe,range:{min:round(minHeight),max:round(maxHeight),delta:round(maxHeight-minHeight)},orientation:screen.orientation?.type || (innerWidth>innerHeight?'landscape':'portrait'),pageScroll:round(scrollY),scrollTest:document.body.classList.contains('scroll-test'),bottomButtons,buttonCounts:{...counts},userAgent:navigator.userAgent};
  $('mode').textContent=actual;
  $('size').textContent=area.width+' × '+area.height;
  $('visible').textContent=area.width+' × '+area.height;
  $('range').textContent=round(minHeight)+'–'+round(maxHeight)+' px';
  $('safeValue').textContent=safe.top+' / '+safe.bottom+' px';
  $('fits').textContent=bottomButtons.every(b=>b.inViewport)?'Да, по геометрии':'Нет / масштаб';
  $('diagnostics').textContent=JSON.stringify(latest,null,2);
  const key=JSON.stringify([actual,area,safe,latest.orientation,latest.scrollTest]);
  if(key!==lastKey || ['tap','reset','report'].includes(reason)) {
    history.push({time:latest.time,reason,actual,visible:area,safe,scrollY:round(scrollY)});
    if(history.length>120)history.shift();
    lastKey=key;
  }
  $('fullscreen').textContent=api?'Выйти из Fullscreen API':'Запрос Fullscreen API';
}
function schedule(reason='resize'){if(frame)return;frame=requestAnimationFrame(()=>{frame=0;snapshot(reason)});}
window.addEventListener('resize',()=>schedule('window resize'));
window.addEventListener('orientationchange',()=>schedule('orientation'));
window.addEventListener('pageshow',()=>schedule('pageshow'));
window.addEventListener('scroll',()=>schedule('page scroll'),{passive:true});
if(window.visualViewport){visualViewport.addEventListener('resize',()=>schedule('visualViewport resize'));visualViewport.addEventListener('scroll',()=>schedule('visualViewport scroll'));}
for(const mode of ['browser','standalone','fullscreen','minimal-ui']){const m=matchMedia(`(display-mode: ${mode})`);if(m.addEventListener)m.addEventListener('change',()=>schedule('display mode'));else if(m.addListener)m.addListener(()=>schedule('display mode'));}
for(const e of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(e,()=>schedule(e));
$('fullscreen').addEventListener('click',async()=>{
  $('error').textContent='';
  try{
    if(document.fullscreenElement)await document.exitFullscreen();
    else if(document.webkitFullscreenElement && document.webkitExitFullscreen)document.webkitExitFullscreen();
    else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();
    else if(document.documentElement.webkitRequestFullscreen)document.documentElement.webkitRequestFullscreen();
    else throw new Error('Fullscreen API для всей страницы здесь не предоставлен. Проверьте запуск установленного варианта.');
  }catch(e){$('error').textContent='Запрос не выполнен: '+e.message;}
  schedule('fullscreen request');
});
document.addEventListener('fullscreenerror',()=>{$('error').textContent='Браузер отклонил запрос Fullscreen API.';});
$('shade').addEventListener('click',()=>{const on=$('shade').getAttribute('aria-pressed')!=='true';$('shade').setAttribute('aria-pressed',String(on));$('shade').textContent='Safe area: '+(on?'вкл.':'выкл.');document.querySelectorAll('.safe').forEach(e=>e.classList.toggle('off',!on));});
$('reset').addEventListener('click',()=>{minHeight=Infinity;maxHeight=0;history.length=0;snapshot('reset');});
$('scroll').addEventListener('click',()=>{const on=document.body.classList.toggle('scroll-test');$('stopScroll').hidden=!on;$('scroll').setAttribute('aria-pressed',String(on));$('scroll').textContent=on?'Завершить тест прокрутки':'Тест прокрутки страницы';window.scrollTo(0,0);$('content').scrollTop=0;schedule('scroll test');});
$('stopScroll').addEventListener('click',()=>{$('scroll').click();});
document.querySelectorAll('[data-tap]').forEach(b=>b.addEventListener('click',()=>{counts[b.dataset.tap]++;$('tapStatus').textContent=`${b.dataset.tap}: ${counts[b.dataset.tap]} · ${Object.values(counts).filter(Boolean).length} / 3 проверено`;snapshot('tap');}));
function report(){snapshot('report');return 'ZETTA-ZONE • Screen v1\n'+JSON.stringify({notes:$('notes').value,measurement:latest,history,interpretation:'CSS pixels, not hardware pixels. Height changes can include browser bars, keyboard, zoom and orientation. Button visibility is geometry only; confirm real taps and system panel overlap manually.'},null,2);}
$('copy').addEventListener('click',async()=>{const text=report();try{await navigator.clipboard.writeText(text);$('copyState').textContent='Отчёт скопирован.';}catch{$('fallback').hidden=false;$('fallback').value=text;$('fallback').focus();$('fallback').select();$('copyState').textContent='Выделенный отчёт можно скопировать вручную.';}});
$('share').addEventListener('click',async()=>{if(!navigator.share){$('copyState').textContent='Системное меню недоступно. Нажмите «Копировать отчёт».';return;}try{await navigator.share({title:'ZZ Screen v1',text:report()});}catch(e){if(e.name!=='AbortError')$('copyState').textContent=e.message;}});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;$('install').hidden=false;});
$('install').addEventListener('click',async()=>{if(!promptEvent)return;try{await promptEvent.prompt();await promptEvent.userChoice;}finally{promptEvent=null;$('install').hidden=true;}});
window.addEventListener('appinstalled',()=>{$('install').hidden=true;promptEvent=null;});
if('serviceWorker' in navigator){const url=new URL(requested==='fullscreen'?'../sw.js':'./sw.js',location.href);navigator.serviceWorker.register(url.href,{scope:new URL('./',url).pathname}).catch(e=>{$('error').textContent='Service Worker не зарегистрирован: '+e.message;});}
snapshot('initial');
