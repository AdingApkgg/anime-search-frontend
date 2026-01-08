import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Navigation, ChevronUp, ChevronDown, X, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { playTap, playTransitionUp } from '@/lib/sound'
import { useSearchStore } from '@/store/search'
import { useUIStore } from '@/store/ui'

export function FloatingButtons() {
  const { platforms } = useSearchStore()
  const { showNavPanel, toggleNavPanel, closeNavPanel, openComments } = useUIStore()
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => { window.removeEventListener('scroll', handleScroll) }
  }, [])

  const findPlatformElement = useCallback((name: string): Element | null => {
    return document.querySelector(`[data-platform="${name}"]`)
  }, [])

  const scrollToPlatform = useCallback(
    (name: string) => {
      const element = findPlatformElement(name)
      if (element) {
        const offset = 80
        const top = element.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
      closeNavPanel()
    },
    [findPlatformElement, closeNavPanel]
  )

  const getCurrentPlatformIndex = useCallback((): number => {
    const scrollY = window.scrollY + 200
    let currentIndex = -1

    platforms.forEach((platform, index) => {
      const element = findPlatformElement(platform.name)
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY
        if (scrollY >= top) {
          currentIndex = index
        }
      }
    })

    return currentIndex
  }, [platforms, findPlatformElement])

  const scrollPrevPlatform = () => {
    playTap()
    const currentIndex = getCurrentPlatformIndex()
    if (currentIndex > 0) {
      scrollToPlatform(platforms[currentIndex - 1].name)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollNextPlatform = () => {
    playTap()
    const currentIndex = getCurrentPlatformIndex()
    if (currentIndex < platforms.length - 1) {
      scrollToPlatform(platforms[currentIndex + 1].name)
    }
  }

  const scrollToTop = () => {
    playTap()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenComments = () => {
    playTransitionUp()
    openComments()
  }

  const handleToggleNav = () => {
    playTap()
    toggleNavPanel()
  }

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3">
      {/* Nav Panel */}
      <AnimatePresence>
        {showNavPanel && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 w-56 max-h-96 overflow-y-auto rounded-2xl bg-[var(--modal-bg)] backdrop-blur-xl border border-[var(--glass-border)] shadow-lg p-2"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <span>站点导航</span>
              <button
                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-orange-500/15 hover:text-orange-500 transition-colors"
                onClick={() => {
                  playTap()
                  closeNavPanel()
                }}
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-orange-500/15 hover:text-orange-500 transition-all text-left"
                  onClick={() => {
                    playTap()
                    scrollToPlatform(platform.name)
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="flex-1 truncate">{platform.name}</span>
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">
                    {platform.items.length}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button Group */}
      <div className="flex flex-col gap-2">
        {platforms.length > 0 && (
          <>
            <FAB title="上一个站点" onClick={scrollPrevPlatform}>
              <ChevronUp size={20} />
            </FAB>
            <FAB title="站点导航" onClick={handleToggleNav}>
              <Navigation size={20} />
            </FAB>
            <FAB title="下一个站点" onClick={scrollNextPlatform}>
              <ChevronDown size={20} />
            </FAB>
          </>
        )}

        <FAB title="评论" onClick={handleOpenComments}>
          <MessageCircle size={20} />
        </FAB>

        <FAB
          title="返回顶部"
          onClick={scrollToTop}
          className={cn(
            'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-500/50 shadow-orange-500/40',
            !showBackToTop && 'opacity-0 invisible scale-50'
          )}
          primary
        >
          <ArrowUp size={20} />
        </FAB>
      </div>
    </div>
  )
}

interface FABProps {
  children: React.ReactNode
  title: string
  onClick: () => void
  className?: string
  primary?: boolean
}

function FAB({ children, title, onClick, className, primary }: FABProps) {
  return (
    <button
      className={cn(
        'w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center rounded-full',
        'backdrop-blur-xl border shadow-lg cursor-pointer',
        'transition-all duration-300',
        'hover:-translate-y-0.5 hover:scale-110 hover:border-orange-500/50',
        'active:translate-y-0 active:scale-95',
        primary
          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-500/50 shadow-orange-500/40'
          : 'bg-[var(--glass-bg)] border-[var(--glass-border)] text-orange-500',
        className
      )}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
