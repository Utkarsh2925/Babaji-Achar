// --- EMERGENCY SERVICE WORKER KILL SWITCH ---
// This file replaces the previous SW to forcefully rescue users from ghost caches.
// It instantly activates, deletes ALL caches, unregisters itself, and reloads the page.

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('[SW Kill Switch] Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            return self.registration.unregister();
        }).then(() => {
            return self.clients.matchAll({ type: 'window' });
        }).then((clients) => {
            for (const client of clients) {
                client.navigate(client.url);
            }
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request));
});
