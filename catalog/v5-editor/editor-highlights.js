/* Selection UI belongs to the workspace, outside the scaled project document. */
(()=>{'use strict';
const area=document.querySelector('.ve-host-workspace'),layer=document.createElement('div');
layer.className='ve-highlights';layer.setAttribute('aria-label','Выбранный элемент и родители');document.body.append(layer);
const gutter=document.createElement('div');gutter.className='ve-highlight-gutter';layer.append(gutter);
const setting='zz-v5-editor-parent-outlines';let parents=true;try{parents=localStorage.getItem(setting)!=='false'}catch{}
const toggle=document.createElement('label');toggle.className='ve-parent-toggle';
const input=document.createElement('input');input.type='checkbox';input.checked=parents;input.setAttribute('aria-label','Показывать родительские контуры');input.title='Оранжевый — родитель, фиолетовый — следующий уровень';
toggle.append(input,document.createTextNode('Контуры родителей'));
function mountToggle(){document.querySelector('#host-side .ve-sticky-head')?.append(toggle)}
addEventListener('ve:panel-mounted',mountToggle);mountToggle();
input.onchange=()=>{parents=input.checked;try{localStorage.setItem(setting,String(parents))}catch{}};
const roles=['Выбрано','Родитель','Уровень выше'];
const items=roles.map((role,i)=>{const box=document.createElement('div'),tag=document.createElement('button');box.className='ve-highlight-box';tag.className='ve-highlight-label';box.dataset.level=tag.dataset.level=i;tag.type='button';tag.title=i?'Выбрать этот родительский блок':'Текущий выбранный элемент';tag.onclick=()=>window.V5EditorHost.select(tag.dataset.node);layer.append(box,tag);return {box,tag}});
const clamp=(n,a,b)=>Math.max(a,Math.min(n,Math.max(a,b)));
let previous='';
function draw(){requestAnimationFrame(draw);const frame=document.querySelector('#host-preview'),chain=window.V5EditorHost?.selection()||[];
if(!frame||!chain.length){layer.hidden=true;return}
const a=area.getBoundingClientRect(),f=frame.getBoundingClientRect(),canvas=document.querySelector('#host-canvas').getBoundingClientRect(),sx=f.width/frame.clientWidth,sy=f.height/frame.clientHeight;
const clip={left:Math.max(0,a.left,f.left,canvas.left),top:Math.max(0,a.top+90,f.top,canvas.top),right:Math.min(innerWidth,a.right,f.right,canvas.right),bottom:Math.min(innerHeight,a.bottom,f.bottom,canvas.bottom)};
const bounds={left:Math.max(0,a.left)+3,top:Math.max(0,a.top)+3,right:Math.min(innerWidth,a.right)-3,bottom:Math.min(innerHeight,a.bottom)-3};
const data=chain.slice(0,parents?3:1).map((c,i)=>{const r=c.node.getBoundingClientRect();return {...c,i,x:f.left+r.left*sx,y:f.top+r.top*sy,w:r.width*sx,h:r.height*sy}});
const signature=JSON.stringify([clip,bounds,data.map(({node,...d})=>d)]);layer.hidden=false;if(signature===previous)return;previous=signature;
Object.assign(gutter.style,{left:a.left+'px',top:a.top+'px',width:a.width+'px',height:'90px'});

for(let i=0;i<3;i++){const {box,tag}=items[i],d=data[i];const visible=d&&d.w>0&&d.h>0&&d.x<clip.right&&d.x+d.w>clip.left&&d.y<clip.bottom&&d.y+d.h>clip.top;box.hidden=tag.hidden=!visible;if(!visible)continue;
Object.assign(box.style,{left:d.x+'px',top:d.y+'px',width:d.w+'px',height:d.h+'px',clipPath:`inset(${Math.max(0,clip.top-d.y)}px ${Math.max(0,d.x+d.w-clip.right)}px ${Math.max(0,d.y+d.h-clip.bottom)}px ${Math.max(0,clip.left-d.x)}px)`});
tag.textContent=roles[i]+': '+d.name;tag.dataset.node=d.id;tag.title=d.name+(i?' — нажмите, чтобы выбрать':' — текущий элемент');tag.setAttribute('aria-label',roles[i]+': '+d.name);tag.style.maxWidth=Math.max(80,bounds.right-bounds.left)+'px';
if(i===0)window.V5EditorHost.bindHighlightHandle(tag,d.id);
const w=tag.offsetWidth,x=clamp(d.x,bounds.left,bounds.right-w),y=bounds.top+i*29;
// Keep interactive names in the reserved workspace gutter, clear of project controls.
Object.assign(tag.style,{left:x+'px',top:y+'px'});
}
}
requestAnimationFrame(draw);
})();
