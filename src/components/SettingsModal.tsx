import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Monitor, Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { playToggle, playTransitionUp, playTransitionDown } from '@/lib/sound'
import { useUIStore } from '@/store/ui'
import type { Theme } from '@/lib/theme'

export function SettingsModal() {
  const { showSettings, closeSettings, theme, setTheme, soundEnabled, setSoundEnabled } =
    useUIStore()

  useEffect(() => {
    if (showSettings) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showSettings])

  const handleClose = () => {
    playTransitionDown()
    closeSettings()
  }

  const handleThemeChange = (newTheme: Theme) => {
    playToggle()
    setTheme(newTheme)
  }

  const handleSoundChange = (enabled: boolean) => {
    setSoundEnabled(enabled)
    if (enabled) {
      playTransitionUp()
    }
  }

  return createPortal(
    <AnimatePresence>
      {showSettings && (
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
                ⚙️ 设置
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
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {/* Theme */}
              <div>
                <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  主题
                </div>
                <div className="flex flex-wrap gap-2">
                  <SettingsOption
                    active={theme === 'system'}
                    onClick={() => { handleThemeChange('system') }}
                  >
                    <Monitor size={16} />
                    跟随系统
                  </SettingsOption>
                  <SettingsOption
                    active={theme === 'light'}
                    onClick={() => { handleThemeChange('light') }}
                  >
                    <Sun size={16} />
                    浅色
                  </SettingsOption>
                  <SettingsOption
                    active={theme === 'dark'}
                    onClick={() => { handleThemeChange('dark') }}
                  >
                    <Moon size={16} />
                    深色
                  </SettingsOption>
                </div>
              </div>

              {/* Sound */}
              <div>
                <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  音效
                </div>
                <div className="flex flex-wrap gap-2">
                  <SettingsOption
                    active={soundEnabled}
                    onClick={() => { handleSoundChange(true) }}
                  >
                    <Volume2 size={16} />
                    开启
                  </SettingsOption>
                  <SettingsOption
                    active={!soundEnabled}
                    onClick={() => { handleSoundChange(false) }}
                  >
                    <VolumeX size={16} />
                    关闭
                  </SettingsOption>
                </div>
              </div>

              {/* About */}
              <div>
                <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  关于
                </div>
                <div className="space-y-2 text-sm text-[var(--text-primary)]">
                  <p>
                    <strong>动漫聚搜</strong> - 聚合多个动漫资源站的搜索引擎
                  </p>
                  <p className="text-[var(--text-muted)] text-xs">
                    版本 2.0.0 · 基于 React + Vite + Tailwind 构建
                  </p>
                  <p className="text-[var(--text-muted)] text-xs">
                    <a
                      href="https://github.com/Moe-Sakura"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:underline"
                    >
                      GitHub
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

interface SettingsOptionProps {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}

function SettingsOption({ children, active, onClick }: SettingsOptionProps) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer',
        'bg-[var(--glass-bg)] border border-[var(--border-color)] text-[var(--text-muted)]',
        'hover:bg-orange-500/10 hover:text-[var(--text-primary)]',
        active && 'bg-orange-500/15 border-orange-500/40 text-orange-500'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
