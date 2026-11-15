const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const A=require('../editor-architecture.js');
const key=(v='cards',d='desktop')=>'zz-v5-editor-config-rollercoin-'+v+'-'+d+'-3';
const card=(styles={})=>({schema:'zetta-zone/shared-card',version:2,template:'pc-detail-v5',templateView:'cards',styles,content:{},hidden:{},removed:{},moves:[],palette:'',themeStyles:null});
test('legacy geometry is theme-independent and originals survive unchanged',()=>{
 const raw=card({'id:ve-card':{width:420,height:400,color:'#ffffff'}});raw.themeStyles={dark:{palette:'',styles:raw.styles},light:{palette:'',styles:{'id:ve-card':{width:390,color:'#000000'}}}};
 const n=A.normalize(raw);assert.equal(n.styles['id:ve-card'].width,420);assert.equal(n.themeStyles,null);assert.equal(n.styles['id:ve-card'].color,undefined);assert.deepEqual(n.legacySnapshot,raw);assert.deepEqual(A.normalize(n),n);
});
test('RollerCoin legacy text, logo, currency icon and appearance become shared fields',()=>{
 const raw=card({'id:ve-card':{width:420,backgroundColor:'#223344'}});raw.content.rollercoin={
  'id:ve-card/div.card-body:0/div.project-main:0/div.project-copy:0/small.project-status:0':{text:['Играй. Собирай. Майни.']},
  'id:ve-card/div.card-body:0/div.project-main:0/span.project-logo:0/img:0':{src:'assets/rollercoin/logo.svg'},
  'id:ve-card/div.card-body:0/div.currency-groups:0/section.currency-group:0/div.currency-row:0/span.currency-item:2/span.coin-icon:0/img.currency-art:0':{src:'assets/doge.svg'}};
 const m=A.migrate({[key()]:raw},{rollercoin:{fields:{name:'RollerCoin NEW'}}});const f=m.sharedData.rollercoin.fields;
 assert.equal(f.essence,'Играй. Собирай. Майни.');assert.equal(f.logo,'assets/rollercoin/logo.svg');assert.equal(f['coins.2.icon'],'assets/doge.svg');assert.equal(f['appearance.dark.card.backgroundColor'],'#223344');assert.equal(Object.keys(m.configs[key()].content.rollercoin).length,0);assert.deepEqual(m.configs[key()].legacySnapshot,raw);
});
test('all nine contexts share data while geometry remains distinct',()=>{
 const configs={};let width=300;for(const v of ['list','cards','detail'])for(const d of ['desktop','tablet','phone'])configs[key(v,d)]={...card({'id:ve-card':{width:width++}}),templateView:v};
 const out=A.migrate(configs,{rollercoin:{fields:{name:'Owner name',logo:'owner.svg'}}});assert.equal(Object.keys(out.configs).length,9);assert.equal(new Set(Object.values(out.configs).map(c=>c.styles['id:ve-card'].width)).size,9);assert.equal(out.sharedData.rollercoin.fields.name,'Owner name');
});
test('explicit common appearance wins conflicts without losing legacy alternatives',()=>{
 const raw=card({'id:ve-card':{backgroundColor:'#112233'}});const m=A.migrate({[key()]:raw},{rollercoin:{fields:{'appearance.dark.card':{backgroundColor:'#abcdef'}}}});
 assert.equal(m.sharedData.rollercoin.fields['appearance.dark.card.backgroundColor'],undefined);assert.equal(m.sharedData.rollercoin.fields['appearance.dark.card'].backgroundColor,'#abcdef');assert(m.conflicts.some(c=>c.path==='appearance.dark.card.backgroundColor'));assert.equal(m.configs[key()].legacySnapshot.styles['id:ve-card'].backgroundColor,'#112233');
});
test('copy selected geometry never copies colour, data, images, template, or spacing not selected',()=>{
 const source=A.normalize(card({'id:ve-card':{width:420,padding:20,color:'#abcdef'}}));source.sharedData={rollercoin:{fields:{name:'Source'}}};source.content={rollercoin:{title:{text:['Source text']}}};
 const target=A.normalize(card({'id:ve-card':{width:300,padding:7}}));target.content={rollercoin:{title:{text:['Keep me']}}};target.sharedData={rollercoin:{fields:{name:'Target'}}};const before=structuredClone(source);
 const {state}=A.copyGeometry(source,target,['size']);assert.equal(state.styles['id:ve-card'].width,420);assert.equal(state.styles['id:ve-card'].padding,7);assert.equal(state.styles['id:ve-card'].color,undefined);assert.deepEqual(state.content,target.content);assert.deepEqual(state.sharedData,target.sharedData);assert.deepEqual(source,before);
});
test('copy across templates resolves semantic identity and preserves unmatched nodes',()=>{
 const source=A.normalize(card({'id:ve-card':{width:420},'id:ve-card/div.project-main:0':{height:65},'id:unknown':{width:8}}));const target=A.normalize({...card({'id:top':{padding:8}}),templateView:'detail'});
 const {state,unmatched}=A.copyGeometry(source,target,['size']);assert.equal(state.styles['id:top'].width,420);assert.equal(state.geometryRoles.header.height,65);assert(unmatched.includes('id:unknown'));assert.equal(state.styles.undefined,undefined);assert.equal(state.templateView,'detail');
});
test('copy refuses an empty parameter selection',()=>assert.throws(()=>A.copyGeometry(card(),card(),[])));
class Storage{constructor(values,fail=Infinity){this.map=new Map(Object.entries(values));this.fail=fail;this.writes=0}get length(){return this.map.size}key(i){return [...this.map.keys()][i]}getItem(k){return this.map.get(k)??null}setItem(k,v){if(++this.writes===this.fail)throw Error('QuotaExceededError');this.map.set(k,v)}removeItem(k){this.map.delete(k)}}
test('save failure at every write restores all prior project/config records',()=>{
 const original={data:'old data',cards:'old cards',detail:'old detail'};for(let failure=1;failure<=4;failure++){const storage=new Storage(original,failure);assert.throws(()=>A.transaction(storage,{data:'new data',cards:'new cards',detail:'new detail'}));for(const [k,v]of Object.entries(original))assert.equal(storage.getItem(k),v)}
});
test('each successful save retains an independent complete backup',()=>{
 const storage=new Storage({data:'old data',cards:'old cards'});const one=A.transaction(storage,{data:'new data',cards:'new cards'}),two=A.transaction(storage,{cards:'newer cards'});assert.notEqual(one,two);assert.equal(JSON.parse(storage.getItem(one)).entries.cards,'old cards');assert.equal(JSON.parse(storage.getItem(two)).entries.cards,'new cards');assert.equal(storage.getItem('cards'),'newer cards');
});
test('read-time workspace migration includes unsaved drafts and never writes storage',()=>{
 const raw=card({'id:ve-card':{width:420}});raw.content.rollercoin={'id:ve-card/div.project-main:0/div.project-copy:0/small.project-status:0':{text:['Unsaved text']}};
 const local=new Storage({}),session=new Storage({'zz-v5-editor-drafts-3':JSON.stringify({[key()]:{state:raw}})});local.length=0;
 const ctx={window:{},localStorage:local,sessionStorage:session,addEventListener(){}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../editor-architecture.js'),'utf8'),ctx);assert.equal(ctx.V5Architecture.workspace().sharedData.rollercoin.fields.essence,'Unsaved text');assert.equal(local.writes,0);assert.equal(session.writes,0);
});
test('published owner RollerCoin configuration survives migration and a second round trip',()=>{
 const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../published-workspace.js'),'utf8'),ctx);const published=JSON.parse(JSON.stringify(ctx.window.V5PublishedWorkspace.configs)),common=JSON.parse(JSON.stringify(ctx.window.V5PublishedWorkspace.common()));const first=A.migrate(published,common),second=A.migrate(first.configs,first.sharedData);
 for(const [k,value]of Object.entries(published))assert.deepEqual(first.configs[k].legacySnapshot,value);assert.deepEqual(second.sharedData,first.sharedData);assert.deepEqual(second.configs,first.configs);assert.equal(first.sharedData.rollercoin.fields.name,'RollerCoin NEW');assert.equal(first.sharedData.rollercoin.fields.essence,'Играй. Собирай. Майни.');
});
test('ambiguous target roles are skipped rather than applied to several unrelated nodes',()=>{
 const source=A.normalize(card({'id:ve-card/div.project-main:0':{height:65}}));const target=A.normalize({...card(),templateView:'detail',nodeRoles:{'id:header-one':'header','id:header-two':'header'}});const r=A.copyGeometry(source,target,['size']);assert.equal(r.unmatched.length,1);assert.equal(r.state.geometryRoles.header,undefined);
});
test('recovery can remove newly added entries and keeps the pre-recovery snapshot',()=>{
 const storage=new Storage({data:'new data',extra:'new config'});const backup=A.transaction(storage,{data:'old data',extra:null},'Recovery');assert.equal(storage.getItem('extra'),null);assert.equal(A.latestBackup(storage).entries.extra,'new config');assert.equal(JSON.parse(storage.getItem(backup)).entries.data,'new data');
});
