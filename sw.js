/* VeriTrip service worker — precaches the app shell, pdf.js and the offline OCR engine + eng/fra models. */
const VERSION = "b44c423640";
const CACHE = 'veritrip-' + VERSION;
const PRECACHE = [
 "./",
 "icons/apple-touch-icon.png",
 "icons/favicon-32.png",
 "icons/favicon-64.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/icon-maskable-192.png",
 "icons/icon-maskable-512.png",
 "index.html",
 "manifest.webmanifest",
 "vendor/jspdf/jspdf.umd.min.js",
 "vendor/pdfjs/pdf.min.js",
 "vendor/pdfjs/pdf.worker.min.js",
 "vendor/tessdata/eng.traineddata.gz",
 "vendor/tessdata/fra.traineddata.gz",
 "vendor/tesseract-core/tesseract-core-simd-lstm.wasm.js",
 "vendor/tesseract/tesseract.min.js",
 "vendor/tesseract/worker.min.js"
];
const scopeURL = new URL(self.registration.scope);
const abs = p => new URL(p, scopeURL).href;

self.addEventListener('install', event => {
  // No automatic skipWaiting: an update waits until the user taps "Update" (first install activates immediately anyway).
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(PRECACHE.map(p => new Request(abs(p), { cache: 'reload' })));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('veritrip-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
    const st = await status();
    for (const c of await self.clients.matchAll({ type: 'window' })) c.postMessage({ type: 'READY', ...st });
  })());
});

async function status() {
  const cache = await caches.open(CACHE); let cached = 0;
  for (const p of PRECACHE) if (await cache.match(abs(p))) cached++;
  return { version: VERSION, cached, total: PRECACHE.length, complete: cached === PRECACHE.length };
}

self.addEventListener('message', event => {
  const d = event.data || {};
  if (d.type === 'SKIP_WAITING') self.skipWaiting();
  if (d.type === 'STATUS') event.waitUntil(status().then(st => event.source && event.source.postMessage({ type: 'STATUS', ...st })));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.href.startsWith(scopeURL.href)) return; // exchange rates, AI APIs: straight to network
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (req.mode === 'navigate') {
      const hit = await cache.match(abs('./')) || await cache.match(abs('index.html'));
      if (hit) return hit;
      return fetch(req);
    }
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') cache.put(req, res.clone()); // e.g. non-SIMD OCR core, iOS splash images
      return res;
    } catch (e) {
      return new Response('Offline and not cached: ' + url.pathname, { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});
