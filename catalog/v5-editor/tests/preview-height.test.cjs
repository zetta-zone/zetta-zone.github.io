const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/../catalog.js','utf8');
const fit=source.slice(source.indexOf('function fitDescriptions(){'),source.indexOf('\n',source.indexOf('function fitDescriptions(){')));
function render(full,width=400){const span={textContent:''},button={textContent:''},el={id:'card-description-test',clientWidth:width,scrollHeight:300,dataset:{full,lines:'4'},querySelector:s=>s==='span'?span:button};let target;
 const document={querySelectorAll:()=>[el],createRange:()=>({selectNodeContents:n=>target=n,getBoundingClientRect:()=>({top:0,bottom:target===span?Math.ceil(span.textContent.length/40)*20:20})})};
 vm.runInNewContext(fit+';fitDescriptions()', {document,equalizeCatalogueCards(){},expanded:new Set(),getComputedStyle:()=>({lineHeight:'20px'})});return span.textContent;
}
test('saved container height cannot turn a short description into an ellipsis',()=>assert.equal(render('Short description'),'Short description'));
test('text truncation still limits long descriptions and preserves hidden text',()=>{assert.ok(render('a'.repeat(500)).length<500);assert.equal(render('Short description',0),'Short description')});
