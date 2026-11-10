(()=>{'use strict';
 const $=s=>document.querySelector(s),menu=$('#site-menu'),toggle=$('#top-filter');
 function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false')}
 toggle.onclick=()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden))};
 document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!toggle.contains(e.target))closeMenu()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();toggle.focus()}});
 menu.addEventListener('click',e=>{if(e.target.closest('a,button'))closeMenu()});
 $('#catalog-total').textContent=V4_PROJECTS.length;
 function compare(){if(V4Store.get().compare.length>=2)$('#open-compare').click();else{location.hash='catalog';$('#toast').textContent='Добавьте 2–3 проекта кнопкой ⇄ в карточках, затем нажмите «Сравнить».';$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),5000)}}
 $('#startCompare').onclick=compare;
 document.querySelectorAll('[data-site-compare]').forEach(b=>b.onclick=compare);
 document.querySelectorAll('[data-site-rate]').forEach(b=>b.onclick=()=>{location.hash='catalog';$('#toast').textContent='Откройте «Подробнее» у проекта и выберите оценку в его карточке.';$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),5000)});
 $('#communitySaved').onclick=()=>{if($('#favorites').getAttribute('aria-pressed')!=='true')$('#favorites').click();location.hash='catalog'};
 const toolbar=$('.toolbar');new ResizeObserver(()=>document.documentElement.style.setProperty('--catalog-toolbar-height',toolbar.offsetHeight+'px')).observe(toolbar);
})();
