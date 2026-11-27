/* Project data and appearance are shared; layout belongs to a view/device.
   Legacy records are adapted in memory. Only an explicit save writes storage. */
(function(scope){'use strict';
const clone=v=>JSON.parse(JSON.stringify(v)),own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
const appearanceKeys=new Set(['color','backgroundColor','backgroundImage','borderColor','backgroundAlpha','borderAlpha','textAlpha','fontFamily','fontWeight','borderRadius','borderWidth','separatorColor','separatorStyle']);
const groups={size:['width','height','minWidth','maxWidth','minHeight','maxHeight','zoom','fontSize'],position:['offsetX','offsetY'],spacing:['padding','margin','gap','lineHeight','letterSpacing','separatorBefore','separatorAfter'],layout:['display','flexWrap','flexDirection','alignItems','justifyContent','gridTemplateColumns','overflow','separatorEnabled','separatorWidth']};
const geometryKeys=new Set(Object.values(groups).flat());
function pick(styles,keys){return Object.fromEntries(Object.entries(styles||{}).filter(([k])=>keys.has(k)))}
function styleMap(styles,keys){const out={};for(const [id,s]of Object.entries(styles||{})){const value=pick(s,keys);if(Object.keys(value).length)out[id]=value}return out}
function inferRole(id){
if(id==='id:ve-card'||/^id:(?:top|card|dossier)$/.test(id))return 'card';
if(/project-title/.test(id))return /\/a[.:]/.test(id)?'title':'title_container';
if(/\/h1[.:]/.test(id))return 'title';
if(/project-logo/.test(id))return id.endsWith('/img:0')?'logo_image':'logo';
if(/project-main|project-header/.test(id)&&!/(project-main|project-header)[^/]*\//.test(id))return 'header';
if(/card-actions|primary-actions|project-cta/.test(id))return 'actions';
if(/feature-grid$|feature-grid:0$/.test(id))return 'features';
if(/project-status/.test(id))return 'field_essence';
if(/description-wrap|preview-description|full-description/.test(id))return 'field_description';
return null;
}
function legacyField(id,entry){
if(/project-title|\/h1[.:]/.test(id)&&entry.text)return ['name',entry.text.join('')];
if(/project-status/.test(id)&&entry.text)return ['essence',entry.text.join('')];
if(/project-logo/.test(id)&&entry.src)return ['logo',entry.src];
if(/preview-description\/span:0$|full-description$/.test(id)&&entry.text)return ['description',entry.text.join('')];
const coin=/section\.currency-group:(\d+)\/div\.currency-row:0\/span\.currency-item:(\d+)/.exec(id);
if(coin&&entry.src)return [(coin[1]==='0'?'coins':'internalCurrencies')+'.'+coin[2]+'.icon',entry.src];
return null;
}
function normalize(raw,theme='dark'){
if(!raw)return null;const out=clone(raw);if(out.architectureVersion===1){out.styles=styleMap(out.styles,geometryKeys);out.palette='';out.themeStyles=null;return out}
const branch=raw.themeStyles?.[theme]||raw.themeStyles?.dark||raw.themeStyles?.light||raw;
// Geometry is independent of theme. Keep every original branch for recovery.
out.legacySnapshot=clone(raw);out.architectureVersion=1;
out.styles=styleMap(branch.styles||raw.styles,geometryKeys);
out.palette='';out.themeStyles=null;out.appearanceOverrides={};
for(const entries of Object.values(out.content||{}))for(const [id,entry]of Object.entries(entries))if(legacyField(id,entry))delete entries[id];
out.nodeRoles={...(raw.nodeRoles||{})};for(const id of Object.keys(branch.styles||{}))out.nodeRoles[id]||=inferRole(id);
return out;
}
function migrate(configs,common){
const data=clone(common||{}),conflicts=[],result={};
function put(project,path,value,origin){const fields=(data[project]||={fields:{}}).fields;
for(const ancestor of Object.keys(fields))if(path.startsWith(ancestor+'.')){const existing=path.slice(ancestor.length+1).split('.').reduce((v,k)=>v?.[k],fields[ancestor]);if(existing!==undefined){if(JSON.stringify(existing)!==JSON.stringify(value))conflicts.push({project,path,origin,kept:clone(existing),legacy:clone(value)});return}}
if(!own(fields,path)){fields[path]=clone(value);return}
if(JSON.stringify(fields[path])!==JSON.stringify(value))conflicts.push({project,path,origin,kept:clone(fields[path]),legacy:clone(value)});
}
for(const [key,raw]of Object.entries(configs||{})){
const match=/^zz-v5-editor-config-(.+)-(detail|cards|list)-(desktop|tablet|phone)-3$/.exec(key);if(!match||!raw)continue;
const project=match[1];result[key]=normalize(raw);
const legacy=raw.legacySnapshot||raw;
for(const [id,entry]of Object.entries(legacy.content?.[project]||{})){const mapped=legacyField(id,entry);if(mapped)put(project,...mapped,key)}
for(const theme of ['dark','light']){const branch=legacy.themeStyles?.[theme]||legacy;
for(const [id,styles]of Object.entries(branch.styles||{})){const shared=pick(styles,appearanceKeys),role=legacy.nodeRoles?.[id]||inferRole(id);if(!role||!Object.keys(shared).length)continue;
for(const [property,value]of Object.entries(shared)){if(project==='hashgarden-test-02'&&((role==='card'&&property==='backgroundColor'&&value==='#102334')||(role==='card'&&property==='color'&&value==='#e5f2ff')||(role==='actions'&&property==='backgroundColor'&&value==='#4397bf')))continue;put(project,'appearance.'+theme+'.'+role+'.'+property,value,key);}
}
if(branch.palette&&!(project==='hashgarden-test-02'&&branch.palette==='ocean')){const palettes={ocean:['#102334','#e5f2ff','#4397bf'],forest:['#142820','#e8fff0','#59b78c'],light:['#f4f7fa','#172c3d','#537b96']},p=palettes[branch.palette];if(p)for(const [role,property,value]of [['card','backgroundColor',p[0]],['card','color',p[1]],['actions','backgroundColor',p[2]]])put(project,'appearance.'+theme+'.'+role+'.'+property,value,key)}
}
}

// Retire only the complete old Ocean palette that masked the Subterra preset.
// The source configurations/legacySnapshot remain intact for recovery.
const fields=data['hashgarden-test-02']?.fields;
if(fields&&!fields['appearance.subterraPresetRepair']){
const locate=path=>{if(own(fields,path))return {owner:fields,key:path};for(const prefix of Object.keys(fields).sort((a,b)=>b.length-a.length))if(path.startsWith(prefix+'.')){const parts=path.slice(prefix.length+1).split('.');let owner=fields[prefix];for(const key of parts.slice(0,-1))owner=owner?.[key];if(owner&&typeof owner==='object'&&own(owner,parts.at(-1)))return {owner,key:parts.at(-1)}}return null};
let repaired=false;
for(const theme of ['dark','light']){const entries=[['card.backgroundColor','#102334'],['card.color','#e5f2ff'],['actions.backgroundColor','#4397bf']].map(([suffix,value])=>({slot:locate('appearance.'+theme+'.'+suffix),value}));if(entries.every(({slot,value})=>slot&&slot.owner[slot.key]===value)){for(const {slot}of entries)delete slot.owner[slot.key];repaired=true}}
if(repaired)fields['appearance.subterraPresetRepair']=1;
}

return {configs:result,sharedData:data,conflicts};
}
function copyGeometry(source,target,selectedGroups){
const from=normalize(source),to=normalize(target)||normalize({styles:{},content:{},hidden:{},moves:[],templateView:from?.templateView});if(!from)throw Error('Нет исходной геометрии');
const requested=new Set(selectedGroups),keys=new Set([...requested].flatMap(g=>groups[g]||[]));if(!keys.size&&!requested.has('visibility')&&!requested.has('order'))throw Error('Выберите параметры');
const next=clone(to),unmatched=[],mapping=new Map(),roles=new Map();next.geometryRoles||={};
for(const id of new Set([...Object.keys(to.nodeRoles||{}),...Object.keys(to.styles||{})])){const role=to.nodeRoles?.[id]||inferRole(id);if(role){const list=roles.get(role)||[];list.push(id);roles.set(role,list)}}
// Stable root roles exist even in an untouched target layout.
if(!roles.has('card'))roles.set('card',[to.templateView==='detail'?'id:top':'id:ve-card']);
const same=from.templateView===to.templateView;
for(const id of new Set([...Object.keys(from.styles||{}),...Object.keys(from.hidden||{}),...Object.keys(from.removed||{})])){
let dest=same?id:null;const role=from.nodeRoles?.[id]||inferRole(id);if(!dest&&role&&roles.get(role)?.length===1)dest=roles.get(role)[0];
const values=pick(from.styles?.[id],keys);
if(!Object.keys(values).length&&!requested.has('visibility')&&!requested.has('order'))continue;
if(!dest){if(role&&!roles.has(role)&&Object.keys(values).length)next.geometryRoles[role]={...(next.geometryRoles[role]||{}),...clone(values)};else unmatched.push(id);continue}mapping.set(id,dest);
if(Object.keys(values).length)next.styles[dest]={...(next.styles[dest]||{}),...clone(values)};
if(requested.has('visibility'))for(const k of ['hidden','removed'])if(own(from[k],id)){next[k]||={};next[k][dest]=from[k][id]}
}
if(requested.has('order')){const moves=[];for(const m of from.moves||[]){const id=mapping.get(m.id),target=mapping.get(m.target);if(id&&target)moves.push({...m,id,target});else unmatched.push(m.id)}next.moves=moves}
return {state:next,unmatched:[...new Set(unmatched)]};
}
function copyProperties(source,target,id,properties){
const next=clone(target),role=source.nodeRoles?.[id]||inferRole(id),same=source.templateView===target.templateView;
const matches=Object.entries(target.nodeRoles||{}).filter(([,r])=>r===role).map(([id])=>id);
const dest=role==='card'?(target.templateView==='detail'?'id:top':'id:ve-card'):matches.length===1?matches[0]:same?id:null;
if(!dest)throw Error('Нет однозначного соответствия выбранного элемента в получателе');
next.styles||={};next.styles[dest]||={};
for(const k of properties){if(!geometryKeys.has(k))throw Error('Неизвестный параметр геометрии');if(own(source.styles?.[id],k))next.styles[dest][k]=source.styles[id][k];else delete next.styles[dest][k];if(role&&next.geometryRoles?.[role])delete next.geometryRoles[role][k]}
for(const [min,max]of [['minWidth','maxWidth'],['minHeight','maxHeight']]){const s=next.styles[dest];if(s[max]>0&&s[min]>s[max])throw Error('Минимальный размер получателя больше максимального')}
return next;
}
function transaction(storage,entries,reason='Сохранение архитектуры V5',durableBackup=null){
const before={};for(const [key,value]of Object.entries(entries)){if(value!==null&&typeof value!=='string')throw Error('Запись должна быть сериализована заранее');before[key]=storage.getItem(key)}
const backup='zz-v5-editor-architecture-backup-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);
// If making the backup fails, do not begin writing any user settings.
if(!durableBackup)storage.setItem(backup,JSON.stringify({version:1,created:new Date().toISOString(),reason,entries:before}));
try{for(const [key,value]of Object.entries(entries)){if(value===null)storage.removeItem(key);else storage.setItem(key,value)}}catch(error){for(const key of Object.keys(before))if(storage.getItem(key)!==before[key])storage.removeItem(key);for(const [key,value]of Object.entries(before)){if(value===null)storage.removeItem(key);else storage.setItem(key,value)}throw error}
return durableBackup||backup;
}
// Backups have their own database: saving must not duplicate a workspace inside
// localStorage's small quota. Existing local backups are never removed.
function backupDatabase(){return new Promise((resolve,reject)=>{const request=scope.indexedDB.open('zetta-v5-editor-recovery',1);request.onupgradeneeded=()=>request.result.createObjectStore('backups',{keyPath:'id',autoIncrement:true});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
async function archive(snapshot){const db=await backupDatabase();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('backups','readwrite'),request=tx.objectStore('backups').add(snapshot);tx.oncomplete=()=>resolve(request.result);tx.onabort=()=>reject(tx.error||Error('Не удалось создать резервную копию'));tx.onerror=()=>{}})}finally{db.close()}}
let saving=false;
async function saveTransaction(storage,entries,reason='Сохранение архитектуры V5'){
if(saving)throw Error('Сохранение уже выполняется');saving=true;
try{const before={};for(const [key,value]of Object.entries(entries)){if(value!==null&&typeof value!=='string')throw Error('Запись должна быть сериализована заранее');before[key]=storage.getItem(key)}
const snapshot={schema:'zetta-zone/editor-backup',version:1,created:new Date().toISOString(),reason,entries:before};
const id=await archive(snapshot);
// Do not overwrite a change made by another tab while the backup was written.
for(const [key,value]of Object.entries(before))if(storage.getItem(key)!==value)throw Error('Настройки изменены в другой вкладке. Экспортируйте текущие изменения перед повторным сохранением');
return transaction(storage,entries,reason,'indexeddb:'+id);
}finally{saving=false}}
async function recoveryBackup(storage){let durable=null;try{const db=await backupDatabase();try{durable=await new Promise((resolve,reject)=>{const tx=db.transaction('backups'),request=tx.objectStore('backups').openCursor(null,'prev');request.onsuccess=()=>resolve(request.result?.value||null);request.onerror=()=>reject(request.error)})}finally{db.close()}}catch{}
const local=latestBackup(storage);return !local||durable&&durable.created>=local.created?durable:local}
function latestBackup(storage){let found=null,time=-1;for(let i=0;i<storage.length;i++){const key=storage.key(i);if(!key.startsWith('zz-v5-editor-architecture-backup-'))continue;try{const item=JSON.parse(storage.getItem(key));const created=Number(key.split('backup-')[1].split('-')[0]);if(item?.entries&&created>=time){found=item;time=created}}catch{}}return found}
const api={appearanceKeys,geometryKeys,groups,pick,styleMap,inferRole,legacyField,normalize,migrate,copyGeometry,copyProperties,transaction,latestBackup,saveTransaction,recoveryBackup,archive};
if(typeof module!=='undefined')module.exports=api;scope.V5Architecture=api;
if(typeof window==='undefined')return;
let cache=null;
api.workspace=function(){if(cache)return clone(cache);const configs=clone(window.V5PublishedWorkspace?.configs||{});let data={};
try{data=JSON.parse(localStorage.getItem('zz-v5-editor-project-data-51')||'{}');for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^zz-v5-editor-config-.+-3$/.test(k))try{configs[k]=JSON.parse(localStorage.getItem(k))}catch{}}}catch{}
try{const drafts=JSON.parse(sessionStorage.getItem('zz-v5-editor-drafts-3')||'{}');for(const [key,draft]of Object.entries(drafts))if(key.startsWith('zz-v5-editor-config-')&&draft?.state)configs[key]=draft.state;if(drafts['zz-v5-editor-project-data-51']?.state)data=drafts['zz-v5-editor-project-data-51'].state}catch{}
data=window.V5PublishedWorkspace?.common(data)||data;cache=migrate(configs,data);return clone(cache)};
api.invalidate=()=>{cache=null};addEventListener('storage',api.invalidate);
})(typeof globalThis!=='undefined'?globalThis:this);
