/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist, CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

// 自定义缓存策略
const customCache = [
  ...defaultCache,
  // 图片缓存 - 优先使用缓存
  {
    matcher: ({ request }: { request: Request }) => 
      request.destination === 'image',
    handler: new CacheFirst({
      cacheName: 'images-cache',
      matchOptions: { ignoreVary: true },
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
    }),
  },
  // 静态资源 - 后台更新
  {
    matcher: ({ request }: { request: Request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font',
    handler: new StaleWhileRevalidate({
      cacheName: 'static-cache',
    }),
  },
]

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: false, // 由用户控制更新时机
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: customCache,
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

// 监听来自客户端的消息
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

serwist.addEventListeners()
