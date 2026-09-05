// Service Worker - Auto-cleanup to ensure fresh modules in dev and preview
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Always fetch directly from network without caching dev scripts
  event.respondWith(fetch(event.request));
});

