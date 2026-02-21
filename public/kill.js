// --- EMERGENCY CACHE BREAKER ---
// This file is served exclusively to browsers trapped in the old Vite ghost cache.
// It assassinates the old Service Worker, clears all caches, and forcefully reloads.

console.log("[KILL SWITCH] Ghost cache detected. Initiating self-destruct sequence.");

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister();
            console.log("[KILL SWITCH] Unregistered ghost service worker.");
        }

        // Nuke all caches
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log("[KILL SWITCH] Deleting cache:", cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            console.log("[KILL SWITCH] Cache cleared. Reloading true HTML.");
            // Hard reload bypassing cache
            window.location.reload(true);
        });
    });
} else {
    // Fallback if SW API is unavailable (unlikely if they have a SW ghost cache)
    window.location.reload(true);
}
