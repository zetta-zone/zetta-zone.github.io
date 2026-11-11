// Panel lifecycle regression checks. No card renderer is loaded or mutated here.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element{
 constructor(){this.attrs={};this.children=[];this.className='';this.clientWidth=844;this.clientHeight=700;this.offsetWidth=280;this.offsetHeight=175;this.style={setProperty:(k,v)=>this.attrs[k]=v};this.classList={toggle:(k,v)=>{this.attrs[k]=v},contains:k=>!!this.attrs[k],add:k=>{this.attrs[k]=true},remove:k=>{delete this.attrs[k]}}}
 append(e){this.children.push(e)}prepend(e){this.children.unshift(e)}contains(e){return this.children.includes(e)}setAttribute(k,v){this.attrs[k]=v}addEventListener(){}focus(){}setPointerCapture(){}querySelector(){return this.children[0]}matches(){return false}
}
const body=new Element(),side=new Element(),layout=new Element(),top=new Element(),listeners={},storage=new Map();let portrait=true;
const ctx={document:{body,activeElement:body,querySelector:s=>s==='#host-side'?side:s==='.ve-host-layout'?layout:top,createElement:()=>new Element()},innerHeight:780,innerWidth:390,visualViewport:{height:780,offsetTop:0,addEventListener(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},matchMedia:q=>({get matches(){return q.includes('orientation')?portrait:false},addEventListener(){}}),addEventListener:(k,f)=>listeners[k]=f,setTimeout,clearTimeout};ctx.window=ctx;let dock=0;ctx.V5EditorHost={dock(){dock++}};
vm.runInNewContext(fs.readFileSync(__dirname+'/editor-mobile.js','utf8'),ctx);
const bar=side.children[0],open=top.children[0],grip=bar.children[0],expand=bar.children[1],close=bar.children[3];
assert.equal(body.attrs['ve-panel-bottom'],true);assert.equal(layout.attrs['--panel-height'],'25%');
expand.onclick();assert.equal(layout.attrs['--panel-height'],'72%');
close.onclick();assert.equal(body.attrs['ve-panel-hidden'],true);assert.equal(side.inert,true);
portrait=false;listeners.orientationchange();assert.equal(body.attrs['ve-panel-bottom'],false);assert.equal(body.attrs['ve-panel-hidden'],true);
open.onclick();assert.equal(side.inert,false);assert.equal(body.attrs['ve-panel-expanded'],true);
bar.children[2].onclick();assert.equal(dock,1);
grip.onpointerdown({button:0,clientX:300,clientY:100,pointerId:1,preventDefault(){}});grip.onpointermove({clientX:400,clientY:100});grip.onpointerup();assert.ok(parseFloat(layout.attrs['--panel-width'])>30);
portrait=true;listeners.orientationchange();assert.equal(layout.attrs['--panel-height'],'72%');
close.onclick();ctx.V5EditorHost.elementSelected();assert.equal(body.attrs['ve-panel-hidden'],false);
const before=storage.get('zz-v5-editor-panel-v1');listeners['ve:panel-mounted']();assert.equal(storage.get('zz-v5-editor-panel-v1'),before);
assert.equal(side.children.filter(x=>x===bar).length,1);
console.log('Panel lifecycle: orientation, expand, hide/restore, resize, dock, selection and remount passed');
