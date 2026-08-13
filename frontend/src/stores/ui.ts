import { create } from 'zustand'
import { setSoundEnabled as setSoundModule } from '@/lib/sound'

// SSR 安全的 localStorage 访问
const isBrowser = typeof window !== 'undefined'

// ============ API 设置 ============
const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://anime-search.saop.cc'
const API_URL_STORAGE_KEY = 'anime-search-api-url'

function getSavedApiUrl(): string {
  if (!isBrowser) return ''
  return localStorage.getItem(API_URL_STORAGE_KEY) ?? ''
}

function saveApiUrl(url: string): void {
  if (!isBrowser) return
  if (url.trim()) {
    localStorage.setItem(API_URL_STORAGE_KEY, url.trim())
  } else {
    localStorage.removeItem(API_URL_STORAGE_KEY)
  }
}

export function getApiBaseUrl(): string {
  if (!isBrowser) return DEFAULT_API_URL
  const custom = localStorage.getItem(API_URL_STORAGE_KEY)
  return custom?.trim() ? custom.trim() : DEFAULT_API_URL
}

// ============ 背景设置 ============
const BG_STORAGE_KEY = 'anime-search-bg-api'
export const DEFAULT_BG_API = 'https://www.loliapi.com/acg/'
const DEFAULT_BG_REFRESH = 30 * 1000
const DEFAULT_BG_TRANSITION = 1500
const DEFAULT_BG_DELAY = 1000

export interface BackgroundSettings {
  apiUrl: string
  refreshInterval: number
  transitionDuration: number
  initialDelay: number
}

function getSavedBgApiUrl(): string {
  if (!isBrowser) return ''
  return localStorage.getItem(BG_STORAGE_KEY) ?? ''
}

function saveBgApiUrl(url: string): void {
  if (!isBrowser) return
  if (url.trim()) {
    localStorage.setItem(BG_STORAGE_KEY, url.trim())
  } else {
    localStorage.removeItem(BG_STORAGE_KEY)
  }
}

export function getBgSettings(): BackgroundSettings {
  const savedApi = getSavedBgApiUrl()
  return {
    apiUrl: savedApi.trim() || DEFAULT_BG_API,
    refreshInterval: DEFAULT_BG_REFRESH,
    transitionDuration: DEFAULT_BG_TRANSITION,
    initialDelay: DEFAULT_BG_DELAY
  }
}

// ============ 音效设置 ============
const SOUND_STORAGE_KEY = 'anime-search-sound'

function getSavedSoundEnabled(): boolean {
  if (!isBrowser) return true
  const saved = localStorage.getItem(SOUND_STORAGE_KEY)
  return saved !== 'false'
}

function saveSoundEnabled(enabled: boolean): void {
  if (!isBrowser) return
  localStorage.setItem(SOUND_STORAGE_KEY, String(enabled))
}

// ============ 主题色设置 ============
const THEME_HUE_STORAGE_KEY = 'anime-search-theme-hue'
const DEFAULT_THEME_HUE = 41 // 橙色

function getSavedThemeHue(): number {
  if (!isBrowser) return DEFAULT_THEME_HUE
  const saved = localStorage.getItem(THEME_HUE_STORAGE_KEY)
  if (saved) {
    const num = parseInt(saved, 10)
    if (!isNaN(num) && num >= 0 && num <= 360) {
      return num
    }
  }
  return DEFAULT_THEME_HUE
}

function saveThemeHue(hue: number): void {
  if (!isBrowser) return
  localStorage.setItem(THEME_HUE_STORAGE_KEY, String(hue))
}

function applyThemeHue(hue: number): void {
  if (!isBrowser) return
  document.documentElement.style.setProperty('--theme-hue', String(hue))
}

// ============ 透明度设置 ============
const OPACITY_STORAGE_KEY = 'anime-search-opacity'
const DEFAULT_OPACITY = 80

function getSavedOpacity(): number {
  if (!isBrowser) return DEFAULT_OPACITY
  const saved = localStorage.getItem(OPACITY_STORAGE_KEY)
  if (saved) {
    const num = parseInt(saved, 10)
    if (!isNaN(num) && num >= 20 && num <= 100) {
      return num
    }
  }
  return DEFAULT_OPACITY
}

function saveOpacity(opacity: number): void {
  if (!isBrowser) return
  localStorage.setItem(OPACITY_STORAGE_KEY, String(opacity))
}

function applyOpacity(opacity: number): void {
  if (!isBrowser) return
  document.documentElement.style.setProperty('--ui-opacity', String(opacity / 100))
}

interface UIState {
  // 模态框状态
  showComments: boolean
  showSettings: boolean
  showNavPanel: boolean

  // 设置
  soundEnabled: boolean
  customApiUrl: string
  bgSettings: BackgroundSettings
  themeHue: number
  uiOpacity: number

  // Actions
  openComments: () => void
  closeComments: () => void
  openSettings: () => void
  closeSettings: () => void
  toggleNavPanel: () => void
  closeNavPanel: () => void
  setSoundEnabled: (enabled: boolean) => void
  setCustomApiUrl: (url: string) => void
  setBgSettings: (settings: BackgroundSettings) => void
  setThemeHue: (hue: number) => void
  setUIOpacity: (opacity: number) => void
  closeAllModals: () => void
  initSettings: () => void
  resetSettings: () => void
}

export const useUIStore = create<UIState>((set) => ({
  showComments: false,
  showSettings: false,
  showNavPanel: false,
  soundEnabled: true,
  customApiUrl: '',
  bgSettings: {
    apiUrl: '',
    refreshInterval: DEFAULT_BG_REFRESH,
    transitionDuration: DEFAULT_BG_TRANSITION,
    initialDelay: DEFAULT_BG_DELAY
  },
  themeHue: DEFAULT_THEME_HUE,
  uiOpacity: DEFAULT_OPACITY,

  openComments: () => set({ showComments: true }),
  closeComments: () => set({ showComments: false }),
  openSettings: () => set({ showSettings: true }),
  closeSettings: () => set({ showSettings: false }),
  toggleNavPanel: () => set((state) => ({ showNavPanel: !state.showNavPanel })),
  closeNavPanel: () => set({ showNavPanel: false }),

  setSoundEnabled: (enabled) => {
    setSoundModule(enabled)
    saveSoundEnabled(enabled)
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

  setThemeHue: (hue) => {
    saveThemeHue(hue)
    applyThemeHue(hue)
    set({ themeHue: hue })
  },

  setUIOpacity: (opacity) => {
    saveOpacity(opacity)
    applyOpacity(opacity)
    set({ uiOpacity: opacity })
  },

  closeAllModals: () => set({
    showComments: false,
    showSettings: false,
    showNavPanel: false
  }),

  initSettings: () => {
    if (!isBrowser) return
    const soundEnabled = getSavedSoundEnabled()
    const customApiUrl = getSavedApiUrl()
    const savedBgApi = getSavedBgApiUrl()
    const themeHue = getSavedThemeHue()
    const uiOpacity = getSavedOpacity()
    
    // 同步音效模块状态
    setSoundModule(soundEnabled)
    
    applyThemeHue(themeHue)
    applyOpacity(uiOpacity)
    
    set({
      soundEnabled,
      customApiUrl,
      bgSettings: {
        apiUrl: savedBgApi,
        refreshInterval: DEFAULT_BG_REFRESH,
        transitionDuration: DEFAULT_BG_TRANSITION,
        initialDelay: DEFAULT_BG_DELAY
      },
      themeHue,
      uiOpacity
    })
  },

  resetSettings: () => {
    if (!isBrowser) return
    
    // 清除所有存储
    localStorage.removeItem(SOUND_STORAGE_KEY)
    localStorage.removeItem(API_URL_STORAGE_KEY)
    localStorage.removeItem(BG_STORAGE_KEY)
    localStorage.removeItem(THEME_HUE_STORAGE_KEY)
    localStorage.removeItem(OPACITY_STORAGE_KEY)
    
    // 应用默认值
    applyThemeHue(DEFAULT_THEME_HUE)
    applyOpacity(DEFAULT_OPACITY)
    
    set({
      soundEnabled: true,
      customApiUrl: '',
      bgSettings: {
        apiUrl: '',
        refreshInterval: DEFAULT_BG_REFRESH,
        transitionDuration: DEFAULT_BG_TRANSITION,
        initialDelay: DEFAULT_BG_DELAY
      },
      themeHue: DEFAULT_THEME_HUE,
      uiOpacity: DEFAULT_OPACITY
    })
  }
}))
