const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('separate SolFarmer preserves every existing record and browser save',()=>{
 const values=new Map([['zz-v5-editor-config-hashgarden-test-03-detail-desktop-3','{"user":"Solfarmer draft"}'],['saved-json','unchanged']]);
 const storage={getItem:k=>values.get(k)||null,setItem(k,v){values.set(k,v)},key:i=>[...values.keys()][i],get length(){return values.size}};
 const c={window:null,location:{search:'?project=solfarmer-official-demo',pathname:'/detail.html'},URLSearchParams,structuredClone,localStorage:storage,addEventListener(){},console,innerWidth:1440,document:{},parent:null};c.window=c;c.parent=c;vm.createContext(c);
 for(const f of ['data.js','nocid.js','projects-preview.js','legacy-records.js','stage2-data.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),c);
 const before=JSON.stringify(c.V4_PROJECTS),saved=JSON.stringify([...values]);
 const code=fs.readFileSync(__dirname+'/solfarmer-demo.js','utf8');vm.runInContext(code,c);
 assert.equal(JSON.stringify(c.V4_PROJECTS.slice(0,-1)),before);assert.equal(JSON.stringify([...values]),saved);
 const p=c.DEMO_PROJECT;assert.equal(p.id,'solfarmer-official-demo');assert.equal(p.editorial.overall,null);assert.equal(p.ratings.community.count,0);assert.equal(p.verified,'unverified');assert.equal(p.coins[0].min,'Требует проверки');
 assert.ok(!JSON.stringify(p).includes('miningblocks'));assert.ok(!JSON.stringify(p).includes('HashGarden'));assert.equal(p.internalCurrencies,undefined);
 for(const asset of [p.logo,...p.slides.map(x=>x.image),p.appearance.dark.card.backgroundImage])assert.ok(fs.statSync(__dirname+'/'+asset).size>1000);
 const count=c.V4_PROJECTS.length;vm.runInContext(code,c);assert.equal(c.V4_PROJECTS.length,count);
 vm.runInContext(fs.readFileSync(__dirname+'/editor-model-v51.js','utf8'),c);
 const model=c.V51Model,other=JSON.stringify(c.V4GetProject('mining-blocks'));
 const patch=model.patch(model.data(),p.id,'name','Edited SolFarmer');const roundtrip=JSON.parse(JSON.stringify(patch));model.applyData(roundtrip);
 assert.equal(p.name,'Edited SolFarmer');assert.equal(JSON.stringify(c.V4GetProject('mining-blocks')),other);
 assert.equal(model.data()[p.id].fields.name,'Edited SolFarmer');
});

