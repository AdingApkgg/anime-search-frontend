import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AnimeSearch - 动漫聚合搜索',
        short_name: 'AnimeSearch',
        description: '在线动漫聚合搜索引擎',
        theme_color: '#f97316',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // 字体不预缓存（体积大），走下方运行时缓存
        globPatterns: ['**/*.{js,css,html}', '*.{svg,png,ico}'],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        // SPA 导航回退：所有页面导航由预缓存的 index.html 响应（离线可用）
        navigateFallback: '/index.html',
        runtimeCaching: [
          // API 请求 - 网络优先，离线时使用缓存
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api/') || url.hostname.includes('anime-search'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60, // 1小时
                purgeOnQuotaError: true
              }
            }
          },
          // 字体 - 缓存优先，长期有效
          {
            urlPattern: /\.(?:woff2?|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30天
                purgeOnQuotaError: true
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src')
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心
          'react-vendor': ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
          // 动画库
          'framer-motion': ['framer-motion'],
          // UI 组件库
          'radix-ui': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-dialog',
            '@radix-ui/react-switch',
            '@radix-ui/react-tooltip'
          ],
          // 评论系统
          'artalk': ['artalk']
        }
      }
    }
  }
})
