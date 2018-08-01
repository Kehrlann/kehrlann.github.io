const CACHE = 'cache-v6';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    'index.html',
    './', // Alias for index.html
    '/talks',
    '/blog',
    'css/main.css',
    'assets/cover.jpg',
    'assets/talks.jpg'
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
          fetch(event.request)
              .then(response => {
                  const clonedResponse = response.clone();
                  caches.open(CACHE).then(cache => cache.put(event.request, clonedResponse));
                  return response;
              })
              .catch(_ => {
                  return caches.match(event.request);
              })
        );
    }
});
