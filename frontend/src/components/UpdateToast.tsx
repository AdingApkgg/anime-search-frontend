'use client'

import { useEffect } from 'react'

/**
 * SW 更新处理组件
 * - skipWaiting: true - 新 SW 安装后立即激活
 * - clientsClaim: false - 不立即接管，等用户刷新页面
 * 用户刷新页面或下次访问时自动使用新版本
 */
export function UpdateToast() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    // 定期检查更新 (每 30 分钟)
    const checkInterval = setInterval(() => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.update().catch(() => {})
      })
    }, 30 * 60 * 1000)

    return () => clearInterval(checkInterval)
  }, [])

  // 不显示任何 UI，静默更新
  return null
}
