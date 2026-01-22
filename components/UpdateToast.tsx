'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UpdateToast() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const handleUpdate = (reg: ServiceWorkerRegistration) => {
      setRegistration(reg)
      setShowUpdate(true)
    }

    // 检查是否有等待中的 SW
    navigator.serviceWorker.ready.then((reg) => {
      if (reg.waiting) {
        handleUpdate(reg)
      }

      // 监听新的 SW 安装
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            handleUpdate(reg)
          }
        })
      })
    })

    // 监听 SW 控制权变化，自动刷新页面
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })
  }, [])

  const handleRefresh = useCallback(() => {
    if (!registration?.waiting) return
    
    // 告诉等待中的 SW 立即激活
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    setShowUpdate(false)
  }, [registration])

  const handleDismiss = useCallback(() => {
    setShowUpdate(false)
  }, [])

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50"
        >
          <div className="bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <RefreshCw size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">
                  发现新版本
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  点击刷新以获取最新功能和修复
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1"
                aria-label="关闭"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleRefresh}
                size="sm"
                className="flex-1 gap-1.5"
              >
                <RefreshCw size={14} />
                立即刷新
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                稍后
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
