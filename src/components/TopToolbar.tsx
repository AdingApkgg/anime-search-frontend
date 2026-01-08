import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Keyboard, Share2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { playTap, playSuccess } from '@/lib/sound'
import { useUIStore } from '@/store/ui'

// GitHub SVG icon (simpleicons.org)
function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

export function TopToolbar() {
  const { openSettings, openKeyboardHelp } = useUIStore()
  const [showCopiedTip, setShowCopiedTip] = useState(false)

  const handleShare = () => {
    const url = window.location.href

    navigator.clipboard.writeText(url).then(
      () => {
        playSuccess()
        setShowCopiedTip(true)
        setTimeout(() => { setShowCopiedTip(false) }, 2000)
      },
      () => {
        // 降级方案：创建隐藏文本区域并选中
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.cssText = 'position:fixed;opacity:0'
        document.body.appendChild(textarea)
        textarea.select()
        // 注: 虽然 execCommand 已弃用，但这是 clipboard API 失败时的降级方案
        try {
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          document.execCommand('copy')
          playSuccess()
          setShowCopiedTip(true)
          setTimeout(() => { setShowCopiedTip(false) }, 2000)
        } catch {
          // 复制失败，静默处理
        }
        document.body.removeChild(textarea)
      }
    )
  }

  const handleSettings = () => {
    playTap()
    openSettings()
  }

  const handleKeyboardHelp = () => {
    playTap()
    openKeyboardHelp()
  }

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 flex items-center gap-2 sm:gap-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {/* Share */}
      <ToolbarButton
        title={showCopiedTip ? '已复制' : '分享搜索'}
        onClick={handleShare}
        className={cn(showCopiedTip && 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-500/50')}
      >
        {showCopiedTip ? <Check size={20} /> : <Share2 size={20} />}
      </ToolbarButton>

      {/* GitHub */}
      <a
        href="https://github.com/AdingApkgg/anime-search-frontend"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full',
          'bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] text-orange-500',
          'shadow-lg transition-all duration-300',
          'hover:-translate-y-0.5 hover:scale-110 hover:border-orange-500/50 hover:shadow-orange-500/25',
          'active:translate-y-0 active:scale-95'
        )}
        title="访问 GitHub"
      >
        <GithubIcon size={20} />
      </a>

      {/* Keyboard Help */}
      <ToolbarButton title="键盘快捷键" onClick={handleKeyboardHelp}>
        <Keyboard size={20} />
      </ToolbarButton>

      {/* Settings */}
      <ToolbarButton title="设置" onClick={handleSettings}>
        <Settings size={20} />
      </ToolbarButton>
    </motion.div>
  )
}

interface ToolbarButtonProps {
  children: React.ReactNode
  title: string
  onClick: () => void
  className?: string
}

function ToolbarButton({ children, title, onClick, className }: ToolbarButtonProps) {
  return (
    <button
      className={cn(
        'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full',
        'bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] text-orange-500',
        'shadow-lg cursor-pointer transition-all duration-300',
        'hover:-translate-y-0.5 hover:scale-110 hover:border-orange-500/50 hover:shadow-orange-500/25',
        'active:translate-y-0 active:scale-95',
        className
      )}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
