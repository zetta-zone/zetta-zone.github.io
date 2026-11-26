const test=require('node:test'),assert=require('node:assert/strict'),A=require('../editor-architecture');
test('selected limits merge across all templates without touching other properties or data',()=>{
const source={templateView:'list',nodeRoles:{'id:ve-card':'card'},styles:{'id:ve-card':{minWidth:320,maxWidth:900,minHeight:240,maxHeight:1200,padding:33}}};
for(const templateView of ['list','cards','detail']){const id=templateView==='detail'?'id:top':'id:ve-card',target={templateView,styles:{[id]:{padding:7,color:'#112233',width:600}},content:{x:'individual'},hidden:{x:true},appearanceOverrides:{x:{color:true}}},snapshot=structuredClone(target),next=A.copyProperties(source,target,'id:ve-card',['minWidth','maxWidth','minHeight','maxHeight']);assert.deepEqual(next.styles[id],{...target.styles[id],minWidth:320,maxWidth:900,minHeight:240,maxHeight:1200});for(const k of ['content','hidden','appearanceOverrides'])assert.deepEqual(next[k],target[k]);assert.deepEqual(target,snapshot)}
});
test('single property and cleared property preserve siblings; invalid pairs reject',()=>{
const source={templateView:'list',styles:{'id:ve-card':{minWidth:50}}},target={templateView:'list',styles:{'id:ve-card':{maxWidth:100,width:90}}};assert.deepEqual(A.copyProperties(source,target,'id:ve-card',['minWidth']).styles['id:ve-card'],{maxWidth:100,width:90,minWidth:50});assert.deepEqual(A.copyProperties(source,target,'id:ve-card',['maxWidth']).styles['id:ve-card'],{width:90});source.styles['id:ve-card'].minWidth=200;assert.throws(()=>A.copyProperties(source,target,'id:ve-card',['minWidth']));
});
