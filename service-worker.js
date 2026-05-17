// Ursinus-WebIDE offline shell.
//
// Strategy:
//   - Cache-first for the IDE shell (HTML, /assets/*) so a warm IDE
//     keeps booting even on flaky WiFi.
//   - Network-first with cache fallback for Pyodide WASM and the other
//     language-runtime CDN bundles, since those are version-pinned and
//     we want updates as soon as the network comes back.
//   - Pass-through for everything else (POSTs to Google Forms, GitHub
//     API, etc.).
//
// Bump CACHE_VERSION when any shipped asset changes so old clients
// re-download.

const CACHE_VERSION = 'webide-v1';
const SHELL_CACHE   = 'webide-shell-' + CACHE_VERSION;
const RUNTIME_CACHE = 'webide-runtime-' + CACHE_VERSION;

// The shell is everything under the same origin we always want offline.
// We don't enumerate URLs at install time (the site has hundreds of
// exercise pages); instead we cache lazily as the user navigates.
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const names = await caches.keys();
        await Promise.all(names
            .filter(n => n.startsWith('webide-') && !n.endsWith(CACHE_VERSION))
            .map(n => caches.delete(n)));
        await self.clients.claim();
    })());
});

function isShellRequest(url) {
    if (url.origin !== self.location.origin) return false;
    return url.pathname.endsWith('.html') ||
           url.pathname.endsWith('/')     ||
           url.pathname.startsWith('/assets/');
}
function isRuntimeBundle(url) {
    return /(?:cdn\.jsdelivr|unpkg\.com)/.test(url.host) ||
           /pyodide|brython|biwascheme|swipl|sql\.js|ace|xterm/.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    // Never intercept non-GET — POSTs (Google Forms submission, GitHub API)
    // must pass straight through.
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    if (isShellRequest(url)) {
        // Cache-first
        event.respondWith((async () => {
            const cache  = await caches.open(SHELL_CACHE);
            const cached = await cache.match(req);
            if (cached) {
                // Refresh in the background so the next load is current
                fetch(req).then(r => { if (r && r.ok) cache.put(req, r.clone()); }).catch(() => {});
                return cached;
            }
            try {
                const fresh = await fetch(req);
                if (fresh && fresh.ok) cache.put(req, fresh.clone());
                return fresh;
            } catch (e) {
                // Offline + first-visit miss — surface a tiny offline page
                return new Response('Offline (not yet cached). Open this page once while online to enable offline access.',
                    { status: 503, headers: { 'Content-Type': 'text/plain' } });
            }
        })());
        return;
    }

    if (isRuntimeBundle(url)) {
        // Network-first
        event.respondWith((async () => {
            const cache = await caches.open(RUNTIME_CACHE);
            try {
                const fresh = await fetch(req);
                if (fresh && fresh.ok) cache.put(req, fresh.clone());
                return fresh;
            } catch (e) {
                const cached = await cache.match(req);
                if (cached) return cached;
                throw e;
            }
        })());
        return;
    }
    // Anything else — pass through. The browser's HTTP cache applies.
});
