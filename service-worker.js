const CACHE = 'cache-v1';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    'index.html',
    './', // Alias for index.html
    'css/main.css',
    'assets/cover.jpg'
];

// Pre-cache all the things on install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            // .then(self.skipWaiting())
    );
});

// This API though :|
self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                const fetchResponse = caches.open(CACHE).then(cache => {
                    return fetch(event.request).then(response => {
                        // Put a copy of the response in the runtime cache.
                        return cache.put(event.request, response.clone()).then(() => {
                            return response;
                        });
                    });
                });

                return cachedResponse || fetchResponse;
            })
        );
    }
});