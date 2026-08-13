/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist, NetworkFirst, ExpirationPlugin } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

// 运行时缓存策略 - 只缓存非 precache 的资源
const runtimeCaching = [
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
          maxEntries: 20,
          maxAgeSeconds: 60 * 60, // 1小时
          purgeOnQuotaError: true,
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
