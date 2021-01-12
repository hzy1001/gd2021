const staticAssets=[
    './',
    './css/style.css',
    './index.html',
    './play.html',
    './stage01.js',    
    './end.js',        
    './sound/intro.ogg',     
    './sound/intro01.ogg',     
    './sound/laser.ogg',     
    './sound/laser01.ogg',    
    './sound/explosion01.ogg',
    './sound/sound01.ogg',
    './sound/warp01.ogg',
    './sound/end.ogg',
    './sound/bonus.ogg',
    './sound/start.ogg',
    './sound/appear.ogg'   
];
 
self.addEventListener('install', async event=>{
    const cache = await caches.open('static-cache');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin === location.url){
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(newtorkFirst(req));
    }
});

async function cacheFirst(req){
    const cachedResponse = caches.match(req);
    return cachedResponse || fetch(req);
}

async function newtorkFirst(req){
    const cache = await caches.open('dynamic-cache');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        return await cache.match(req);
    }
}

