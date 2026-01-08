import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBgSettings } from '@/store/ui'

// Ken Burns 动画效果类型
type KenBurnsType = 
  | 'kb-zoom-in' 
  | 'kb-zoom-out' 
  | 'kb-pan-left' 
  | 'kb-pan-right' 
  | 'kb-pan-up' 
  | 'kb-pan-down'

// Ken Burns 效果列表
const KEN_BURNS_EFFECTS: KenBurnsType[] = [
  'kb-zoom-in',
  'kb-zoom-out',
  'kb-pan-left',
  'kb-pan-right',
  'kb-pan-up',
  'kb-pan-down',
]

// 配置
const CONFIG = {
  TRANSITION_DURATION: 1.5,  // 过渡时长（秒）
  REFRESH_INTERVAL: 30000,   // 刷新间隔（毫秒）
  INITIAL_DELAY: 1000,       // 初始延迟（毫秒）
  ANIMATION_DURATION: 12,    // Ken Burns 动画时长（秒）
}

// 预加载图片，返回 Promise
function preloadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => { resolve(url) }
    img.onerror = reject
    img.src = url
  })
}

// 随机选择 Ken Burns 效果
function getRandomKenBurns(): KenBurnsType {
  return KEN_BURNS_EFFECTS[Math.floor(Math.random() * KEN_BURNS_EFFECTS.length)]
}

export function Background() {
  const settings = getBgSettings()
  const bgApi = settings.apiUrl

  // 当前显示的图片 URL、key（用于触发动画）、Ken Burns 效果
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageKey, setImageKey] = useState(0)
  const [kenBurns, setKenBurns] = useState<KenBurnsType>('kb-zoom-in')
  
  const isLoadingRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isMounted = useRef(true)

  // 加载并显示新图片
  const loadNewImage = useCallback(async () => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true

    try {
      const url = `${bgApi}?t=${Date.now()}`
      await preloadImage(url)
      
      if (!isMounted.current) return

      // 随机选择 Ken Burns 效果
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

    // 初始加载
    void loadNewImage()

    // 进场动画完成后开始定时刷新
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* 背景容器 - overflow-hidden 防止 Ken Burns 动画溢出产生滚动条 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -21 }}>
        <AnimatePresence mode="popLayout">
          {imageUrl && (
            <motion.div
              key={imageKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: CONFIG.TRANSITION_DURATION, ease: 'easeInOut' }}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform ${kenBurns}`}
        style={{
                backgroundImage: `url(${imageUrl})`,
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Dark Overlay for readability */}
      <div 
        className="fixed inset-0 pointer-events-none bg-black/40 dark:bg-black/60"
        style={{ zIndex: -15 }}
      />

      {/* Gradient Overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249, 115, 22, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(245, 158, 11, 0.1), transparent),
            radial-gradient(ellipse 40% 30% at 10% 60%, rgba(249, 115, 22, 0.08), transparent)
          `
        }}
      />
    </>
  )
}
