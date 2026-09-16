const CACHE_NAME='word-steps-v1';
const CORE=[
  './','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./css/app.css',
  './js/app.js','./js/router.js','./js/data.js','./js/db.js','./js/stats.js','./js/ui.js','./js/today.js','./js/random.js','./js/audio.js','./js/session.js','./js/mastery.js','./js/review-engine.js','./js/word-list.js','./js/parent.js','./js/backup.js',
  './games/listen-find.js','./games/break-blend.js','./games/fix-word.js','./games/word-picture.js','./games/build-word.js','./games/word-hunt.js','./data/words.json'
];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE_NAME);
  await cache.addAll(CORE);
  const response=await fetch(new URL('./data/words.json',self.registration.scope));
  const words=await response.json();
  const assets=new Set();
  for(const w of words){assets.add('./'+w.audioPath);for(const p of w.chunkAudioPaths||[])assets.add('./'+p);for(const p of w.imagePaths||[])assets.add('./'+p);}
  await cache.addAll([...assets]);
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key!==CACHE_NAME)await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached)return cached;
    try{const res=await fetch(event.request);if(res&&res.ok){const cache=await caches.open(CACHE_NAME);cache.put(event.request,res.clone());}return res;}catch(err){if(event.request.mode==='navigate')return caches.match('./index.html');throw err;}
  })());
});
