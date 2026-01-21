'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBgSettings } from '@/stores/ui'

type KenBurnsType = 'kb-zoom-in' | 'kb-zoom-out' | 'kb-pan-left' | 'kb-pan-right' | 'kb-pan-up' | 'kb-pan-down'

const KEN_BURNS_EFFECTS: KenBurnsType[] = [
  'kb-zoom-in', 'kb-zoom-out', 'kb-pan-left', 'kb-pan-right', 'kb-pan-up', 'kb-pan-down'
]

const CONFIG = {
  TRANSITION_DURATION: 1.5,
  REFRESH_INTERVAL: 30000,
  INITIAL_DELAY: 1000
}

function preloadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = reject
    img.src = url
  })
}

function getRandomKenBurns(): KenBurnsType {
  return KEN_BURNS_EFFECTS[Math.floor(Math.random() * KEN_BURNS_EFFECTS.length)]
}

export function Background() {
  const settings = getBgSettings()
  const bgApi = settings.apiUrl

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageKey, setImageKey] = useState(0)
  const [kenBurns, setKenBurns] = useState<KenBurnsType>('kb-zoom-in')

  const isLoadingRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isMounted = useRef(true)

  const loadNewImage = useCallback(async () => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true

    try {
      const url = `${bgApi}?t=${Date.now()}`
      await preloadImage(url)

      if (!isMounted.current) return

      setKenBurns(getRandomKenBurns())
      setImageUrl(url)
      setImageKey(prev => prev + 1)
    } catch {
      // 加载失败，静默处理
    } finally {
      isLoadingRef.current = false
    }
  }, [bgApi])

  useEffect(() => {
    isMounted.current = true
    void loadNewImage()

    const startTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        void loadNewImage()
      }, CONFIG.REFRESH_INTERVAL)
    }, CONFIG.INITIAL_DELAY)

    return () => {
      isMounted.current = false
      clearTimeout(startTimer)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [loadNewImage])

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-30">
        <AnimatePresence mode="popLayout">
          {imageUrl && (
            <motion.div
              key={imageKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: CONFIG.TRANSITION_DURATION, ease: 'easeInOut' }}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform ${kenBurns}`}
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Overlay - 仅深色模式 */}
      <div className="fixed inset-0 pointer-events-none -z-20 dark:bg-background/70" />

      {/* Gradient Overlay */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, hsl(var(--primary) / 0.1), transparent),
            radial-gradient(ellipse 40% 30% at 10% 60%, hsl(var(--primary) / 0.08), transparent)
          `
        }}
      />
    </>
  )
}
