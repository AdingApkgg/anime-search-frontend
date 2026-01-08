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
        const pvValue = parseInt(pvElement.textContent || '0', 10)
        const uvValue = parseInt(uvElement.textContent || '0', 10)

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

  return (
    <motion.div
      className={cn(
        'fixed bottom-6 left-4 sm:left-6 z-40',
        'flex flex-col gap-2 px-3 py-2 sm:px-4 sm:py-3',
        'rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl',
        'border border-[var(--glass-border)] shadow-lg',
        'transition-all duration-400',
        !visible && 'opacity-0 translate-y-2.5'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 text-sm" title="总访问量 (PV)">
        <Eye size={16} className="text-orange-400 flex-shrink-0" />
        <span className="font-semibold text-[var(--text-primary)] tabular-nums">
          {displayPv}
        </span>
      </div>
      <div className="h-px bg-[var(--border-color)]" />
      <div className="flex items-center gap-2 text-sm" title="独立访客 (UV)">
        <Users size={16} className="text-orange-400 flex-shrink-0" />
        <span className="font-semibold text-[var(--text-primary)] tabular-nums">
          {displayUv}
        </span>
      </div>
    </motion.div>
  )
}
