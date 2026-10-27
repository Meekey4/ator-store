/* ATOR offline support: pages you visit are kept so they still open without a connection.
   Checkout, account, admin and API calls always need the network and are never cached. */
const CACHE = 'ator-v2';
const OFFLINE = '/offline.html';
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll([OFFLINE, '/brand/ator-symbol.svg']))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
const NEVER = /\/(api|admin|checkout|account|orders)(\/|$|\?)/;
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin || NEVER.test(new URL(r.url).pathname)) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy)); return res; })
      .catch(() => caches.match(r).then((hit) => hit || caches.match(OFFLINE))));
    return;
  }
  // Build files never change (their names include a hash), so the saved copy is always right.
  if (r.url.includes('/_next/static/')) {
    e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy)); return res; })));
    return;
  }
  // Photos and brand files can be replaced: always ask the server first, use the saved copy only when offline.
  if (/\/(products|brand)\//.test(r.url)) {
    e.respondWith(fetch(r).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy)); return res; }).catch(() => caches.match(r)));
  }
});
