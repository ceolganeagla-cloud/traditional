self.addEventListener('install',e=>{e.waitUntil(caches.open('cge-react-v1').then(c=>c.addAll(['./','./index.html','./manifest.webmanifest'])));self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
