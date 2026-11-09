const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/layout-editor.js','utf8');
const block=(col)=>({zone:'hero',row:1,rows:1,col,span:6,width:100,height:0,pad:12,align:'start',justify:'stretch',x:0,y:0});
const defaults={schema:'zetta-v5-lab-desktop',version:1,gap:18,blocks:{a:block(1),b:block(7)}};
const context={defaults,blocks:[{id:'a',zone:'hero'},{id:'b',zone:'hero'}],structuredClone};vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('function validate(raw)'),source.indexOf('let config='))+';this.validate=validate;',context);
assert.equal(context.validate(defaults).blocks.a.span,6);
for(const mutate of [c=>c.version=2,c=>c.blocks.a.zone='sections',c=>c.blocks.a.x=100,c=>c.blocks.a.width=101,c=>c.blocks.a.row=1.5,c=>c.blocks.a.col=8,c=>c.blocks.a.rows=2.5,c=>c.blocks.b.col=6,c=>delete c.blocks.b,c=>c.gap=NaN]){const c=structuredClone(defaults);mutate(c);assert.throws(()=>context.validate(c))}
const next=structuredClone(defaults);next.blocks.b.row=2;next.blocks.b.col=1;assert.equal(context.validate(next).blocks.b.row,2);
console.log('12 layout validation checks passed');
