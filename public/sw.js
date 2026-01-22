// Placeholder Service Worker for development
// Will be replaced by serwist build in production

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((names) =>
        Promise.all(names.map((name) => caches.delete(name)))
      ),
      self.clients.claim()
    ])
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
