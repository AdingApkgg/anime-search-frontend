import { create } from 'zustand'
import { type Theme, getSavedTheme, setTheme as applyTheme, getActualTheme } from '@/lib/theme'
import { isSoundEnabled, setSoundEnabled as applySoundEnabled } from '@/lib/sound'

// ============ API 设置 ============
// 根据环境变量配置 API 地址
// 开发环境: http://localhost:3000
// 生产环境: https://anime-search.saop.cc
const DEFAULT_API_URL = import.meta.env.VITE_API_BASE_URL as string || 'https://anime-search.saop.cc'
const API_URL_STORAGE_KEY = 'anime-search-api-url'

function getSavedApiUrl(): string {
  return localStorage.getItem(API_URL_STORAGE_KEY) ?? ''
}

function saveApiUrl(url: string): void {
  if (url.trim()) {
    localStorage.setItem(API_URL_STORAGE_KEY, url.trim())
  } else {
    localStorage.removeItem(API_URL_STORAGE_KEY)
  }
}

export function getApiBaseUrl(): string {
  const custom = localStorage.getItem(API_URL_STORAGE_KEY)
  return custom?.trim() || DEFAULT_API_URL
}

// ============ 背景设置 ============
const BG_STORAGE_KEY = 'anime-search-bg-api'

// 默认值
export const DEFAULT_BG_API = 'https://www.loliapi.com/acg/'
const DEFAULT_BG_REFRESH = 30 * 1000 // 30 秒，单位毫秒
const DEFAULT_BG_TRANSITION = 1500 // 毫秒
const DEFAULT_BG_DELAY = 1000 // 毫秒

export interface BackgroundSettings {
  apiUrl: string
  refreshInterval: number // 毫秒
  transitionDuration: number // 毫秒
  initialDelay: number // 毫秒
}

function getSavedBgApiUrl(): string {
  return localStorage.getItem(BG_STORAGE_KEY) ?? ''
}

function saveBgApiUrl(url: string): void {
  if (url.trim()) {
    localStorage.setItem(BG_STORAGE_KEY, url.trim())
  } else {
    localStorage.removeItem(BG_STORAGE_KEY)
  }
}

// 导出获取当前背景设置的函数（供 Background 组件使用）
export function getBgSettings(): BackgroundSettings {
  const savedApi = getSavedBgApiUrl()
  return {
    apiUrl: savedApi.trim() || DEFAULT_BG_API,
    refreshInterval: DEFAULT_BG_REFRESH,
    transitionDuration: DEFAULT_BG_TRANSITION,
    initialDelay: DEFAULT_BG_DELAY
  }
}

interface UIState {
  // 模态框状态
  showComments: boolean
  showSettings: boolean
  showNavPanel: boolean

  // 设置
  theme: Theme
  soundEnabled: boolean
  customApiUrl: string
  bgSettings: BackgroundSettings

  // Actions
  openComments: () => void
  closeComments: () => void
  openSettings: () => void
  closeSettings: () => void
  toggleNavPanel: () => void
  closeNavPanel: () => void
  setTheme: (theme: Theme) => void
  setSoundEnabled: (enabled: boolean) => void
  setCustomApiUrl: (url: string) => void
  setBgSettings: (settings: BackgroundSettings) => void
  closeAllModals: () => void
  initSettings: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // 初始状态
  showComments: false,
  showSettings: false,
  showNavPanel: false,
  theme: 'dark',
  soundEnabled: true,
  customApiUrl: '',
  bgSettings: {
    apiUrl: '',
    refreshInterval: DEFAULT_BG_REFRESH,
    transitionDuration: DEFAULT_BG_TRANSITION,
    initialDelay: DEFAULT_BG_DELAY
  } as BackgroundSettings,

  // Actions
  openComments: () => { set({ showComments: true }); },
  closeComments: () => { set({ showComments: false }); },

  openSettings: () => { set({ showSettings: true }); },
  closeSettings: () => { set({ showSettings: false }); },

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

  setCustomApiUrl: (url) => {
    saveApiUrl(url)
    set({ customApiUrl: url })
  },

  setBgSettings: (settings) => {
    saveBgApiUrl(settings.apiUrl)
    set({ bgSettings: settings })
  },

  closeAllModals: () =>
    { set({
      showComments: false,
      showSettings: false,
      showNavPanel: false
    }); },

  initSettings: () => {
    const theme = getSavedTheme()
    const soundEnabled = isSoundEnabled()
    const customApiUrl = getSavedApiUrl()
    const savedBgApi = getSavedBgApiUrl()
    applyTheme(theme)
    set({ 
      theme, 
      soundEnabled, 
      customApiUrl, 
      bgSettings: {
        apiUrl: savedBgApi,
        refreshInterval: DEFAULT_BG_REFRESH,
        transitionDuration: DEFAULT_BG_TRANSITION,
        initialDelay: DEFAULT_BG_DELAY
      }
    })
  }
}))

// 获取实际显示的主题（用于组件判断暗色/亮色）
export function useActualTheme(): 'light' | 'dark' {
  return getActualTheme()
}
