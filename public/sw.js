const CACHE_NAME = 'accounticca-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      }).catch(async (error) => {
        // Return cached response if network fails
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If it's a navigation request (like /article/3) and we're offline, 
        // fallback to /index.html for the SPA router to handle
        if (event.request.mode === 'navigate') {
          const cache = await caches.open(CACHE_NAME);
          const indexHtml = await cache.match('/index.html') || await cache.match('/');
          if (indexHtml) return indexHtml;
        }
        
        throw error;
      });

      // Return cached response immediately if available, while fetching in background (Stale-while-revalidate)
      return cachedResponse || fetchPromise;
    })
  );
});
