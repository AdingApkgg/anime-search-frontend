// 开发环境占位 SW
// 生产环境会被 serwist build 覆盖为完整版本

// 立即激活
self.addEventListener('install', () => {
  self.skipWaiting()
})

// 接管所有客户端
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // 清除旧缓存
      caches.keys().then((names) =>
        Promise.all(names.map((name) => caches.delete(name)))
      ),
      // 接管客户端
      self.clients.claim()
    ])
  )
})

// 网络直通，不缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
