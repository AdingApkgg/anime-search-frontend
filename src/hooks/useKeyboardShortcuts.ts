import { useEffect } from 'react'
import { useUIStore } from '@/store/ui'
import { playButton } from '@/lib/sound'

export function useKeyboardShortcuts() {
  const { 
    showComments, 
    showSettings, 
    showKeyboardHelp,
    closeComments,
    closeSettings,
    closeKeyboardHelp,
    openKeyboardHelp
  } = useUIStore()

  useEffect(() => {
    const isInputFocused = (): boolean => {
      const activeElement = document.activeElement
      return (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.getAttribute('contenteditable') === 'true'
      )
    }

    const focusSearchInput = () => {
      const input = document.querySelector('input[type="search"]')
      if (input instanceof HTMLInputElement) {
        input.focus()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // ? 显示快捷键帮助
      if (e.key === '?' && !isInputFocused()) {
        e.preventDefault()
        playButton()
        openKeyboardHelp()
      }

      // / 聚焦搜索框
      if (e.key === '/' && !isInputFocused()) {
        e.preventDefault()
        playButton()
        focusSearchInput()
      }

      // Esc 关闭模态框
      if (e.key === 'Escape') {
        if (showKeyboardHelp) {
          closeKeyboardHelp()
        } else if (showSettings) {
          closeSettings()
        } else if (showComments) {
          closeComments()
        }
      }

      // Home 返回顶部
      if (e.key === 'Home' && !isInputFocused()) {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => { document.removeEventListener('keydown', handleKeyDown); }
  }, [
    showComments,
    showSettings,
    showKeyboardHelp,
    closeComments,
    closeSettings,
    closeKeyboardHelp,
    openKeyboardHelp
  ])
}
