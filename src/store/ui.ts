import { create } from 'zustand'
import { type Theme, getSavedTheme, setTheme as applyTheme, getActualTheme } from '@/lib/theme'
import { isSoundEnabled, setSoundEnabled as applySoundEnabled } from '@/lib/sound'

interface UIState {
  // 模态框状态
  showComments: boolean
  showSettings: boolean
  showKeyboardHelp: boolean
  showNavPanel: boolean

  // 设置
  theme: Theme
  soundEnabled: boolean

  // Actions
  openComments: () => void
  closeComments: () => void
  openSettings: () => void
  closeSettings: () => void
  openKeyboardHelp: () => void
  closeKeyboardHelp: () => void
  toggleNavPanel: () => void
  closeNavPanel: () => void
  setTheme: (theme: Theme) => void
  setSoundEnabled: (enabled: boolean) => void
  closeAllModals: () => void
  initSettings: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // 初始状态
  showComments: false,
  showSettings: false,
  showKeyboardHelp: false,
  showNavPanel: false,
  theme: 'dark',
  soundEnabled: true,

  // Actions
  openComments: () => { set({ showComments: true }); },
  closeComments: () => { set({ showComments: false }); },

  openSettings: () => { set({ showSettings: true }); },
  closeSettings: () => { set({ showSettings: false }); },

  openKeyboardHelp: () => { set({ showKeyboardHelp: true }); },
  closeKeyboardHelp: () => { set({ showKeyboardHelp: false }); },

  toggleNavPanel: () => { set((state) => ({ showNavPanel: !state.showNavPanel })); },
  closeNavPanel: () => { set({ showNavPanel: false }); },

  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },

  setSoundEnabled: (enabled) => {
    applySoundEnabled(enabled)
    set({ soundEnabled: enabled })
  },

  closeAllModals: () =>
    { set({
      showComments: false,
      showSettings: false,
      showKeyboardHelp: false,
      showNavPanel: false
    }); },

  initSettings: () => {
    const theme = getSavedTheme()
    const soundEnabled = isSoundEnabled()
    applyTheme(theme)
    set({ theme, soundEnabled })
  }
}))

// 获取实际显示的主题（用于组件判断暗色/亮色）
export function useActualTheme(): 'light' | 'dark' {
  return getActualTheme()
}
