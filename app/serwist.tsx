'use client'

import { useEffect } from 'react'

interface SerwistProviderProps {
  swUrl: string
  children: React.ReactNode
}

export function SerwistProvider({ swUrl, children }: SerwistProviderProps) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    // 注册 Service Worker (不使用 module 类型)
    navigator.serviceWorker
      .register(swUrl, { scope: '/' })
      .then((registration) => {
        console.log('SW registered:', registration.scope)
      })
      .catch((error) => {
        console.error('SW registration failed:', error)
      })
  }, [swUrl])

  return <>{children}</>
}
