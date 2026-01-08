import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Eye, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatsCorner() {
  const [pv, setPv] = useState(0)
  const [uv, setUv] = useState(0)
  const [displayPv, setDisplayPv] = useState(0)
  const [displayUv, setDisplayUv] = useState(0)
  const [visible, setVisible] = useState(false)

  const animationFrameRef = useRef<number | null>(null)

  const animateNumbers = useCallback((targetPv: number, targetUv: number) => {
    const duration = 1500
    const startTime = performance.now()
    const startPv = displayPv
    const startUv = displayUv

    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4)

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuart(progress)

      setDisplayPv(Math.round(startPv + (targetPv - startPv) * eased))
      setDisplayUv(Math.round(startUv + (targetUv - startUv) * eased))

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayPv(targetPv)
        setDisplayUv(targetUv)
        animationFrameRef.current = null
      }
    }

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [displayPv, displayUv])

  useEffect(() => {
    const checkBusuanziData = () => {
      const pvElement = document.getElementById('busuanzi_value_site_pv')
      const uvElement = document.getElementById('busuanzi_value_site_uv')

      if (pvElement && uvElement) {
        const pvText = pvElement.textContent
        const uvText = uvElement.textContent
        const pvValue = parseInt(pvText || '0', 10)
        const uvValue = parseInt(uvText || '0', 10)

        if (pvValue > 0 || uvValue > 0) {
          setPv(pvValue)
          setUv(uvValue)
          setVisible(true)
          return true
        }
      }
      return false
    }

    // Initial check
    if (checkBusuanziData()) return

    // Polling
    let attempts = 0
    const maxAttempts = 40
    const interval = setInterval(() => {
      attempts++
      if (checkBusuanziData() || attempts >= maxAttempts) {
        clearInterval(interval)
      }
    }, 500)

    // Observer
    const pvElement = document.getElementById('busuanzi_value_site_pv')
    const uvElement = document.getElementById('busuanzi_value_site_uv')

    const observer = new MutationObserver(checkBusuanziData)

    if (pvElement) {
      observer.observe(pvElement, { childList: true, characterData: true, subtree: true })
    }
    if (uvElement) {
      observer.observe(uvElement, { childList: true, characterData: true, subtree: true })
    }

    return () => {
      clearInterval(interval)
      observer.disconnect()
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Animate when data changes
  useEffect(() => {
    if (pv > 0 || uv > 0) {
      animateNumbers(pv, uv)
    }
  }, [pv, uv, animateNumbers])

  if (!visible) return null

  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 sm:gap-4 px-3 py-1.5 sm:px-4 sm:py-2',
        'rounded-full bg-white/80 dark:bg-slate-800/80',
        'border border-slate-200 dark:border-white/10 shadow-sm',
        'text-xs sm:text-sm'
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1.5" title="总访问量 (PV)">
        <Eye size={14} className="text-orange-400" />
        <span className="font-semibold text-[var(--text-primary)] tabular-nums">
          {displayPv}
        </span>
      </div>
      <div className="w-px h-3 bg-slate-300 dark:bg-white/20" />
      <div className="flex items-center gap-1.5" title="独立访客 (UV)">
        <Users size={14} className="text-orange-400" />
        <span className="font-semibold text-[var(--text-primary)] tabular-nums">
          {displayUv}
        </span>
      </div>
    </motion.div>
  )
}
