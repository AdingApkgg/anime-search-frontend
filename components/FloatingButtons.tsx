'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Navigation, X, MessageCircle, Settings } from 'lucide-react'
import { playTap, playTransitionUp } from '@/lib/sound'
import { useSearchStore } from '@/stores/search'
import { useUIStore } from '@/stores/ui'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const buttonVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 }
}

export function FloatingButtons() {
  const { platforms } = useSearchStore()
  const { showNavPanel, toggleNavPanel, closeNavPanel, openComments, openSettings } = useUIStore()
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToPlatform = useCallback((name: string) => {
    const element = document.querySelector(`[data-platform="${name}"]`)
    if (element) {
      const offset = 80
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    closeNavPanel()
  }, [closeNavPanel])

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

  const handleOpenSettings = () => {
    playTransitionUp()
    openSettings()
  }

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3">
      {/* Nav Panel */}
      <AnimatePresence>
        {showNavPanel && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 w-56 max-h-96 overflow-y-auto rounded-2xl glass-bg-strong border border-border/50 shadow-xl p-2"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Navigation size={14} className="text-primary" />
                站点导航
              </span>
              <motion.button
                className="size-6 flex items-center justify-center rounded-md hover:bg-muted"
                onClick={() => { playTap(); closeNavPanel() }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>
            </div>
            <div className="flex flex-col gap-1">
              {platforms.map((platform, index) => (
                <motion.button
                  key={platform.name}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-left"
                  onClick={() => { playTap(); scrollToPlatform(platform.name) }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ x: 4 }}
                >
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="flex-1 truncate">{platform.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {platform.items.length}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button Group */}
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence>
          {showBackToTop && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                >
                  <Button
                    size="icon"
                    className="size-12 sm:size-13 rounded-full shadow-lg"
                    onClick={scrollToTop}
                  >
                    <ArrowUp size={20} />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>返回顶部</TooltipContent>
            </Tooltip>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {platforms.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-12 sm:size-13 rounded-full shadow-lg"
                    onClick={handleToggleNav}
                  >
                    <motion.div
                      animate={{ rotate: showNavPanel ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Navigation size={20} />
                    </motion.div>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>站点导航</TooltipContent>
            </Tooltip>
          )}
        </AnimatePresence>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="size-12 sm:size-13 rounded-full shadow-lg"
                onClick={handleOpenComments}
              >
                <MessageCircle size={20} />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>评论</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', damping: 10, stiffness: 200 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="size-12 sm:size-13 rounded-full shadow-lg"
                onClick={handleOpenSettings}
              >
                <Settings size={20} />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>设置</TooltipContent>
        </Tooltip>
      </motion.div>
    </div>
  )
}
