import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { SerwistProvider } from './serwist'
import { UpdateToast } from '@/components/UpdateToast'
import './globals.css'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f97316' },
    { media: '(prefers-color-scheme: dark)', color: '#ea580c' }
  ],
  width: 'device-width',
  initialScale: 1
}

export const metadata: Metadata = {
  title: 'AnimeSearch - 动漫聚合搜索',
  description: 'AnimeSearch - 在线动漫聚合搜索引擎，一站式搜索多个动漫资源站点',
  metadataBase: new URL('https://as.saop.cc'),
  openGraph: {
    type: 'website',
    title: 'AnimeSearch - 动漫聚合搜索',
    description: '在线动漫聚合搜索引擎，一站式搜索多个动漫资源站点',
    url: 'https://as.saop.cc',
    siteName: 'AnimeSearch',
    locale: 'zh_CN',
    images: [{ url: '/logo.svg' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnimeSearch - 动漫聚合搜索',
    description: '在线动漫聚合搜索引擎，一站式搜索多个动漫资源站点',
    images: ['/logo.svg']
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg'
  },
  manifest: '/manifest.json'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 系统主题检测脚本 - 避免闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', isDark);
              })();
            `
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <SerwistProvider swUrl="/sw.js" disable={process.env.NODE_ENV === 'development'}>
          {children}
          <UpdateToast />
        </SerwistProvider>

        {/* 不蒜子统计 */}
        <div id="busuanzi_container" style={{ display: 'none' }}>
          <span id="busuanzi_value_site_pv" />
          <span id="busuanzi_value_site_uv" />
        </div>
        <Script
          src="https://registry.npmmirror.com/js-asuna/1.0.26/files/js/bsz.pure.mini.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
