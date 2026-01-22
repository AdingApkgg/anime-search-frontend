/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist, CacheFirst, NetworkFirst, StaleWhileRevalidate, ExpirationPlugin } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

// 自定义缓存策略
const runtimeCaching = [
  // 字体缓存 - 优先缓存，长期有效
  {
    matcher: ({ request }: { request: Request }) => 
      request.destination === 'font',
    handler: new CacheFirst({
      cacheName: 'fonts-cache',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1年
        }),
      ],
    }),
  },
  
  // 图片缓存 - 优先使用缓存，限制数量
  {
    matcher: ({ request }: { request: Request }) => 
      request.destination === 'image',
    handler: new CacheFirst({
      cacheName: 'images-cache',
      matchOptions: { ignoreVary: true },
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30天
        }),
      ],
    }),
  },
  
  // API 请求 - 网络优先，离线时使用缓存
  {
    matcher: ({ url }: { url: URL }) => 
      url.pathname.startsWith('/api/') || 
      url.hostname.includes('anime-search'),
    handler: new NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1天
        }),
      ],
    }),
  },
  
  // 静态资源 (JS/CSS) - 后台更新
  {
    matcher: ({ request }: { request: Request }) =>
      request.destination === 'script' ||
      request.destination === 'style',
    handler: new StaleWhileRevalidate({
      cacheName: 'static-cache',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7天
        }),
      ],
    }),
  },
]

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true, // 新版本立即激活，刷新页面后生效
  clientsClaim: false, // 不立即接管，等用户刷新页面
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: '/offline/',
        matcher({ request }) {
          return request.destination === 'document'
        },
      },
    ],
  },
})

serwist.addEventListeners()
