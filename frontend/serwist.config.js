// @ts-check

/** @type {import("@serwist/build").InjectManifestOptions} */
const config = {
  swSrc: 'app/sw.ts',
  swDest: 'out/sw.js',
  injectionPoint: 'self.__SW_MANIFEST',
  
  // 扫描静态导出的 out 目录
  globDirectory: 'out',
  globPatterns: [
    // HTML 页面
    '**/*.html',
    // Next.js 静态资源 (JS/CSS)
    '_next/static/**/*.{js,css}',
    // 公共资源
    '*.{svg,png,ico,json}',
  ],
  globIgnores: [
    '**/sw.js',
    '**/sw.js.map',
    '**/*.map',
    // 字体不预缓存，使用运行时缓存
    '**/*.{woff,woff2}',
    // 大型媒体文件
    '_next/static/media/**',
  ],
  
  // 最大文件大小 2MB
  maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
}

export default config
