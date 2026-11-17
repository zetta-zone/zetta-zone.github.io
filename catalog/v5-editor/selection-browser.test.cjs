/* Run with PLAYWRIGHT_PATH pointing to the installed playwright package. */
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const server=http.createServer((req,res)=>{try{const f=path.join(root,decodeURI(req.url.split('?')[0]));res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.svg')?'image/svg+xml':f.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(f))}catch{res.statusCode=404;res.end()}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
for(const project of ['hashgarden-test-02','hashgarden-test-03','rollercoin'])for(const view of ['cards','list','detail']){
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto(`http://127.0.0.1:${server.address().port}/catalog/v5-editor/editor.html?project=${project}&view=${view}&device=desktop`);await page.waitForSelector('#v51-tree');
 const frame=page.frames().find(f=>/ve-preview/.test(f.url()));
 const initial=await frame.evaluate(()=>{const c=V5EditorController;return {html:document.querySelector('.dossier,.project-item').innerHTML,styles:JSON.stringify(c.capture().state.styles),names:[...c.panel.querySelectorAll('#ve-node option')].map(n=>n.textContent)}});
 assert.ok(initial.names.every(n=>!/HashGarden|Hash Garden| · \d+$/.test(n)),initial.names.join('\n'));
 const id=await frame.evaluate(()=>{const c=V5EditorController,entries=[...V5EditorSupport.map(document.querySelector('.dossier,.project-item'))];return entries.find(([,n])=>n.matches('.platforms,.platform-icons,.demo-platforms'))?.[0]});assert.ok(id);
 await page.evaluate(id=>V5EditorHost.select(id),id);await page.waitForTimeout(100);
 for(const zoom of [50,100,135]){await page.locator('#host-zoom').fill(String(zoom));await page.waitForTimeout(600);const m=await page.evaluate(()=>{const c=V5EditorHost.selection()[0],f=document.querySelector('#host-preview'),fr=f.getBoundingClientRect(),r=c.node.getBoundingClientRect(),box=document.querySelector('.ve-highlight-box[data-level="0"]'),b=box.getBoundingClientRect();return {name:c.name,caption:document.querySelector('.ve-highlight-label[data-level="0"]').textContent,panel:document.querySelector('.ve-selection').textContent,dx:Math.abs(b.left-(fr.left+r.left*fr.width/f.clientWidth)),dy:Math.abs(b.top-(fr.top+r.top*fr.height/f.clientHeight)),dw:Math.abs(b.width-r.width*fr.width/f.clientWidth),fill:getComputedStyle(box).backgroundColor,parents:[...document.querySelectorAll('.ve-highlight-box')].slice(1).map(n=>getComputedStyle(n).backgroundColor)}});assert.equal(m.caption,m.name);assert.ok(m.panel.endsWith(m.name));assert.ok(m.dx<1&&m.dy<1&&m.dw<1,JSON.stringify(m));assert.ok(m.fill.endsWith('0.18)'));assert.ok(m.parents.every(c=>c==='rgba(0, 0, 0, 0)'))}
 assert.equal(await frame.evaluate(()=>JSON.stringify(V5EditorController.capture().state.styles)),initial.styles);
 // Scrolling may update gallery/navigation classes; project geometry and paint must remain untouched.
 assert.ok(await frame.evaluate(()=>!document.querySelector('.dossier .ve-highlight-box,.project-item .ve-highlight-box')));
 await page.locator('[data-pane-tab="blocks"]').click();await page.locator('#v51-node-name').fill('Мои платформы');await page.getByRole('button',{name:'Переименовать узел',exact:true}).click();
 await page.locator('[data-action="save"]').click();await page.reload();await page.waitForSelector('#v51-tree');await page.evaluate(id=>V5EditorHost.select(id),id);assert.equal(await page.evaluate(()=>V5EditorHost.selection()[0].name),'Мои платформы');
 if(project==='hashgarden-test-02'&&view==='cards'&&process.env.SCREENSHOT)await page.screenshot({path:process.env.SCREENSHOT});
 assert.deepEqual(errors,[]);console.log(`${project} ${view}: stable names, exact overlay at 3 zooms, no project mutation, rename/save/reload passed`);await context.close();
}
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
