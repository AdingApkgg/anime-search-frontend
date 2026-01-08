import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Artalk from 'artalk'
import 'artalk/dist/Artalk.css'
import { playTransitionDown } from '@/lib/sound'
import { useUIStore, useActualTheme } from '@/store/ui'

export function CommentsModal() {
  const { showComments, closeComments } = useUIStore()
  const artalkRef = useRef<Artalk | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const actualTheme = useActualTheme()

  useEffect(() => {
    if (showComments) {
      document.body.style.overflow = 'hidden'

      // Initialize Artalk
      const timer = setTimeout(() => {
        if (containerRef.current && !artalkRef.current) {
          artalkRef.current = Artalk.init({
            el: containerRef.current,
            pageKey: 'https://as.saop.cc',
            pageTitle: '动漫聚搜',
            server: 'https://artalk.saop.cc',
            site: '动漫聚搜',
            darkMode: actualTheme === 'dark'
          })
        }
      }, 100)

      return () => {
        clearTimeout(timer)
      }
    } else {
      document.body.style.overflow = ''

      // Destroy Artalk
      if (artalkRef.current) {
        artalkRef.current.destroy()
        artalkRef.current = null
      }
    }
  }, [showComments, actualTheme])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
      if (artalkRef.current) {
        artalkRef.current.destroy()
        artalkRef.current = null
      }
    }
  }, [])

  const handleClose = () => {
    playTransitionDown()
    closeComments()
  }

  return createPortal(
    <AnimatePresence>
      {showComments && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div
            className="w-[90%] max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-[var(--glass-border)] shadow-2xl max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:max-h-none max-sm:rounded-none"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
                💬 评论区
              </div>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-orange-500/15 hover:text-orange-500 transition-colors"
                onClick={handleClose}
                title="关闭"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div ref={containerRef} id="artalk-comments" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
