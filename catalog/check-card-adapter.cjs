const fs=require('fs'),vm=require('vm'),assert=require('assert');
const js=fs.readFileSync('outputs/site-notice/catalog/catalog.js','utf8');
const normalize=fs.readFileSync('work/catalog-sheet-normalize.js','utf8');
const metrics=js.slice(js.indexOf('function catalogMetricsMarkup(p)'));
const ctx={URL,esc:s=>String(s).replace(/[<>&"']/g,'_')};vm.createContext(ctx);vm.runInContext(normalize+'\n'+metrics,ctx);
const raw={id:'limercoin',url:'https://limercoin.com/',cat:'Майнинг-симуляторы',sub:'Симулятор майнинга с мини-играми',d:'Limercoin — подробное описание.',logoUrl:'',inGameCurrency:'LMT'};
let p=ctx.normalizeSheetProject(raw);assert.equal(p.sub,raw.sub);assert.equal(p.inGameCurrency,'LMT');assert.match(p.logoUrl,/limercoin/);
let html=ctx.catalogMetricsMarkup(p);assert.match(html,/LMT/);assert.match(html,/Мини-игры/);assert(!html.includes('Раз в час'));assert(!html.includes('Кран'));
assert.match(ctx.catalogMetricsMarkup({id:'miningblocks',inGameCurrency:'Blocks'}),/Раз в час/);
assert.match(ctx.catalogMetricsMarkup({id:'rollercoin',inGameCurrency:'RLT'}),/rlt.svg/);
let old=ctx.normalizeSheetProject({...raw,sub:raw.d});assert.notEqual(old.sub,raw.d);
let custom=ctx.normalizeSheetProject({...raw,inGameCurrency:'CUSTOM'});assert.equal(custom.inGameCurrency,'CUSTOM');
// Other categories do not inherit the Limercoin-specific features or currency.
let other=ctx.normalizeSheetProject({id:'other',url:'https://example.org/',sub:'Tools',cat:'Инструменты',earningTypes:[]});assert(!other.inGameCurrency);assert(!ctx.catalogMetricsMarkup(other).includes('Раз в час'));
console.log('PASS: shared metric classes; Limercoin uses supplied subtitle and LMT; legacy cards unchanged; no invented faucet for feed records.');
