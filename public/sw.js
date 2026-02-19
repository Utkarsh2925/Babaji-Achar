// Version: v3 - bump to force old cache deletion
const CACHE_NAME = 'babaji-achar-v3';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/images/logo.jpg'
];

// INSTALL: cache static assets
self.addEventListener('install', (event) => {
    self.skipWaiting(); // activate immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
});

// ACTIVATE: delete ALL old caches so users always get new JS/CSS
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        ).then(() => self.clients.claim()) // take control immediately
    );
});

// FETCH: Network-first strategy — always try network first
// Falls back to cache only when offline
self.addEventListener('fetch', (event) => {
    // Skip non-GET and cross-origin requests
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Update cache with fresh response
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                }
                return response;
            })
            .catch(() => {
                // Offline fallback: serve from cache
                return caches.match(event.request).then((cached) => cached || caches.match('/'));
            })
    );
});
