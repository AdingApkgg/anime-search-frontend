import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { playTransitionDown } from '@/lib/sound'
import { useUIStore } from '@/store/ui'

interface ShortcutItem {
  keys: string[]
  description: string
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['/'], description: '聚焦搜索框' },
  { keys: ['Enter'], description: '搜索' },
  { keys: ['Esc'], description: '关闭面板 / 取消' },
  { keys: ['↑', '↓'], description: '上/下一个站点' },
  { keys: ['Home'], description: '返回顶部' },
  { keys: ['?'], description: '显示快捷键帮助' }
]

export function KeyboardHelpModal() {
  const { showKeyboardHelp, closeKeyboardHelp } = useUIStore()

  useEffect(() => {
    if (showKeyboardHelp) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showKeyboardHelp])

  const handleClose = () => {
    playTransitionDown()
    closeKeyboardHelp()
  }

  return createPortal(
    <AnimatePresence>
      {showKeyboardHelp && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div
            className="w-[90%] max-w-lg max-h-[85vh] flex flex-col rounded-2xl bg-[var(--modal-bg)] backdrop-blur-2xl border border-[var(--glass-border)] shadow-2xl max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:max-h-none max-sm:rounded-none"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
                ⌨️ 键盘快捷键
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
              <div className="flex flex-col gap-3">
                {SHORTCUTS.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--border-color)]"
                  >
                    <div className="flex gap-1.5">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] font-mono text-xs font-semibold text-[var(--text-primary)] shadow"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
