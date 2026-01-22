'use client'

import { useEffect, useState, createContext, useContext, useCallback } from 'react'

interface SerwistContextType {
  isReady: boolean
  registration: ServiceWorkerRegistration | null
  hasUpdate: boolean
  update: () => Promise<void>
}

const SerwistContext = createContext<SerwistContextType>({
  isReady: false,
  registration: null,
  hasUpdate: false,
  update: async () => {}
})

export function useSerwist() {
  return useContext(SerwistContext)
}

interface SerwistProviderProps {
  children: React.ReactNode
}

export function SerwistProvider({ children }: SerwistProviderProps) {
  const [isReady, setIsReady] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [hasUpdate, setHasUpdate] = useState(false)

  useEffect(() => {
    // 仅在生产环境且浏览器支持 Service Worker 时注册
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV === 'development'
    ) {
      return
    }

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        })

        setRegistration(reg)
        setIsReady(true)

        // 检测更新
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 有新版本可用
                setHasUpdate(true)
              }
            })
          }
        })

        // 定期检查更新（每小时）
        setInterval(() => {
          reg.update()
        }, 60 * 60 * 1000)

      } catch (err) {
        console.error('Service Worker 注册失败:', err)
      }
    }

    registerSW()
  }, [])

  const update = useCallback(async () => {
    if (registration?.waiting) {
      // 通知 waiting worker 接管
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      // 刷新页面以使用新版本
      window.location.reload()
    }
  }, [registration])

  return (
    <SerwistContext.Provider value={{ isReady, registration, hasUpdate, update }}>
      {children}
    </SerwistContext.Provider>
  )
}
