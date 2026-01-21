import withSerwistInit from '@serwist/next'
import type { NextConfig } from 'next'

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV !== 'production'
})

// 抑制 Turbopack 警告
process.env.SERWIST_SUPPRESS_TURBOPACK_WARNING = '1'

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  poweredByHeader: false,
  // Silence Turbopack migration warning
  turbopack: {}
}

export default withSerwist(config)
