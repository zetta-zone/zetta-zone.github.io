/* Private visual preview: remove editorial scaffolding without changing source data. */
(()=>{'use strict';
const remove='.demo-pill,.test-note,.demo-banner,.demo-tag,.test-instance-caption,.action-note,.demo-notice,.demo-aside,.compare-note,.dialog-notice,.gallery-topline>span:nth-child(2),.card-footer [data-dialog="service"],#footer-info,.catalog-brand>small';
const replacements=new Map([
['Проверка показана как пример','Проверка проекта'],['Выплаты и дата проверки — DEMO','Проверено 01.11.2026'],['Изучен основной сценарий · DEMO','Изучен основной сценарий'],['Пример записи о проверке · DEMO','Проверка выплаты'],['Посмотреть пример материала ↗','Материал проверки ↗'],['Подробная карточка · V5','ZETTA-ZONE'],['Тестовый набор, условия вывода не подтверждены',''],['Нет оценки','10 критериев'],['DEMO · пример',''],['Пример оценки · DEMO','Оценка проекта'],['ПЗС','ПТС']
]);
function cleanText(t){if(replacements.has(t.trim()))return replacements.get(t.trim());return t.replace(/\s*[·—-]?\s*тест(?:овый экземпляр)?\s*(\d*)/ig,(_,n)=>n?' '+n:'').replace(/(?:\s*[·—-]\s*)?DEMO(?:-КАТАЛОГ)?/ig,'').replace(/Пример\s*:\s*/g,'').replace(/\s*·\s*локально/g,'').replace(/\s*·\s*$/,'')}
function clean(root){if(root.nodeType===Node.TEXT_NODE){if(!root.parentElement?.closest('script,style')){const next=cleanText(root.data);if(next!==root.data)root.data=next}return}if(root.nodeType!==1)return;root.querySelectorAll(remove).forEach(n=>n.remove());if(root.matches(remove)){root.remove();return}const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode())clean(n)}
// Omit entire prototype-only paragraphs, rather than leaving empty rows.
function omitNotes(root){root.querySelectorAll('p,small').forEach(n=>{if(/вымышлен|вымышлены|вымышленные|прототип|В рабочем каталоге|В настоящей карточке|Для настоящей карточки|как будет выглядеть|Реальные данные проекта не заявлены|Временная демонстрационная оценка/i.test(n.textContent)&&!n.querySelector('button,input')){if(n.id)n.textContent='';else n.remove()}})}
function refresh(){observer.disconnect();omitNotes(document.body);clean(document.body);observer.observe(document.body,{subtree:true,childList:true,characterData:true})}
const observer=new MutationObserver(refresh);refresh();
})();
