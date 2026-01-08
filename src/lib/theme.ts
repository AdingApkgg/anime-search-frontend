// 主题管理工具

export type Theme = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'anime-search-theme'

// 获取系统主题偏好
function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 应用主题到 DOM
function applyThemeToDOM(theme: 'light' | 'dark') {
  const root = document.documentElement

  if (theme === 'light') {
    root.classList.add('light')
    root.classList.remove('dark')
  } else {
    root.classList.add('dark')
    root.classList.remove('light')
  }
}

// 获取当前保存的主题
export function getSavedTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved
  }
  return 'system' // 默认跟随系统
}

// 获取实际显示的主题
export function getActualTheme(): 'light' | 'dark' {
  const saved = getSavedTheme()
  return saved === 'system' ? getSystemTheme() : saved
}

// 设置主题
export function setTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme)

  const actualTheme = theme === 'system' ? getSystemTheme() : theme
  applyThemeToDOM(actualTheme)
}

// 初始化主题
export function initTheme() {
  const savedTheme = getSavedTheme()
  setTheme(savedTheme)

  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = getSavedTheme()
    if (currentTheme === 'system') {
      applyThemeToDOM(getSystemTheme())
    }
  })
}
