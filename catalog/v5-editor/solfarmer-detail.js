/* Metadata for the separate record; the shared renderer and editor remain intact. */
(()=>{'use strict';if(window.DEMO_PROJECT?.id!=='solfarmer-official-demo')return;
const set=(selector,text)=>document.querySelectorAll(selector).forEach(n=>n.textContent=text);
set('.verification small','Публичные источники · 13.11.2026');
set('.card-footer>span:first-child','Подготовлено: 13.11.2026');
set('.passport .action-note','Официальный сайт · выплаты и условия требуют проверки');
const note=document.querySelector('.passport .action-note');if(note)note.hidden=false;
document.title='SolFarmer · ZETTA-ZONE V5.1';
})();
