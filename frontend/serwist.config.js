// @ts-check

/** @type {import("@serwist/build").InjectManifestOptions} */
const config = {
  swSrc: 'src/sw.ts',
  swDest: 'dist/sw.js',
  injectionPoint: 'self.__SW_MANIFEST',

  // 扫描 Vite 构建输出的 dist 目录
  globDirectory: 'dist',
  globPatterns: [
    // HTML 页面
    '**/*.html',
    // Vite 静态资源 (JS/CSS)
    'assets/**/*.{js,css}',
    // 公共资源
    '*.{svg,png,ico,json}',
  ],
  globIgnores: [
    '**/sw.js',
    '**/sw.js.map',
    '**/*.map',
    // 字体不预缓存，使用运行时缓存
    '**/*.{woff,woff2}',
  ],

  // 最大文件大小 2MB
  maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
}

export default config
