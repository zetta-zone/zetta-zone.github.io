'use strict';
const CACHE='zz-screen-v1-1';
const ROOT=new URL('./',self.location.href);
const FILES=['./','index.html','test.css','app.js','icon-192.png','icon-512.png','manifest.webmanifest','full/','full/index.html','full/manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(f=>new URL(f,ROOT).href))));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zz-screen-v1-')&&k!==CACHE).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;
 event.respondWith(fetch(event.request).catch(()=>caches.match(event.request).then(hit=>hit||Response.error())));
});
