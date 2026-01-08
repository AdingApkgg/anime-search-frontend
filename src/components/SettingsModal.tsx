import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Monitor, Moon, Sun, Volume2, Server, RotateCcw, Image, ListVideo } from 'lucide-react'
import { cn } from '@/lib/utils'
import { playToggle, playTransitionUp, playTransitionDown, playTap } from '@/lib/sound'
import { useUIStore, DEFAULT_BG_API } from '@/store/ui'
import { useSearchStore } from '@/store/search'
import type { Theme } from '@/lib/theme'

const DEFAULT_API_URL = 'https://anime-search.saop.cc'

export function SettingsModal() {
  const { 
    showSettings, closeSettings, 
    theme, setTheme, 
    soundEnabled, setSoundEnabled, 
    customApiUrl, setCustomApiUrl,
    bgSettings, setBgSettings
  } = useUIStore()
  
  const { getEpisodes, setGetEpisodes } = useSearchStore()
  
  const [apiUrlInput, setApiUrlInput] = useState(customApiUrl)
  const [bgApiInput, setBgApiInput] = useState(bgSettings.apiUrl)

  const handleEpisodesChange = (enabled: boolean) => {
    playToggle()
    setGetEpisodes(enabled)
  }

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

  const handleApiUrlSave = () => {
    playTap()
    setCustomApiUrl(apiUrlInput)
  }

  const handleApiUrlReset = () => {
    playTap()
    setApiUrlInput('')
    setCustomApiUrl('')
  }

  // 背景设置处理
  const handleBgSettingsSave = () => {
    playTap()
    setBgSettings({ ...bgSettings, apiUrl: bgApiInput })
  }

  const handleBgSettingsReset = () => {
    playTap()
    setBgApiInput('')
    setBgSettings({ ...bgSettings, apiUrl: '' })
  }

  // 同步 store 中的值到本地状态
  useEffect(() => {
    setApiUrlInput(customApiUrl)
    setBgApiInput(bgSettings.apiUrl)
  }, [customApiUrl, bgSettings, showSettings])

  return createPortal(
    <AnimatePresence>
      {showSettings && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div
            className={cn(
              'w-[92%] max-w-md max-h-[80vh] flex flex-col',
              'rounded-2xl overflow-hidden',
              'bg-white dark:bg-slate-900',
              'shadow-2xl shadow-black/20',
              'max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:max-h-none max-sm:rounded-none'
            )}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                设置
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={handleClose}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* 外观设置组 */}
              <SettingsGroup title="外观">
                <SettingsRow 
                  icon={<Monitor size={18} />}
                  label="主题"
                >
                  <SegmentedControl
                    options={[
                      { value: 'system', label: '自动' },
                      { value: 'light', label: '浅色', icon: <Sun size={14} /> },
                      { value: 'dark', label: '深色', icon: <Moon size={14} /> }
                    ]}
                    value={theme}
                    onChange={(v) => { handleThemeChange(v as Theme) }}
                  />
                </SettingsRow>
              </SettingsGroup>

              {/* 搜索设置组 */}
              <SettingsGroup title="搜索">
                <SettingsRow
                  icon={<ListVideo size={18} />}
                  label="获取集数"
                  description="显示每个资源的集数列表"
                >
                  <ToggleSwitch 
                    checked={getEpisodes} 
                    onChange={handleEpisodesChange} 
                  />
                </SettingsRow>
                <SettingsRow
                  icon={<Volume2 size={18} />}
                  label="音效"
                  description="交互音效反馈"
                >
                  <ToggleSwitch 
                    checked={soundEnabled} 
                    onChange={handleSoundChange} 
                  />
                </SettingsRow>
              </SettingsGroup>

              {/* 高级设置组 */}
              <SettingsGroup title="高级">
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Server size={14} />
                    <span>API 后端地址</span>
                </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={apiUrlInput}
                      onChange={(e) => { setApiUrlInput(e.target.value) }}
                      placeholder={DEFAULT_API_URL}
                      className={cn(
                        'flex-1 px-3 py-2 rounded-lg text-sm',
                        'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white',
                        'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                        'border border-transparent',
                        'focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20',
                        'transition-all'
                      )}
                    />
                    <button
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium',
                        'bg-orange-500 text-white',
                        'hover:bg-orange-400 active:scale-95 transition-all',
                        apiUrlInput === customApiUrl && 'opacity-40 pointer-events-none'
                      )}
                      onClick={handleApiUrlSave}
                      disabled={apiUrlInput === customApiUrl}
                    >
                      保存
                    </button>
                    {customApiUrl && (
                      <button
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={handleApiUrlReset}
                        title="重置"
                  >
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4" />

                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Image size={14} />
                    <span>背景图 API</span>
                </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={bgApiInput}
                      onChange={(e) => { setBgApiInput(e.target.value) }}
                      placeholder={DEFAULT_BG_API}
                      className={cn(
                        'flex-1 px-3 py-2 rounded-lg text-sm',
                        'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white',
                        'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                        'border border-transparent',
                        'focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20',
                        'transition-all'
                      )}
                    />
                    <button
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium',
                        'bg-orange-500 text-white',
                        'hover:bg-orange-400 active:scale-95 transition-all',
                        bgApiInput === bgSettings.apiUrl && 'opacity-40 pointer-events-none'
                      )}
                      onClick={handleBgSettingsSave}
                      disabled={bgApiInput === bgSettings.apiUrl}
                    >
                      保存
                    </button>
                    {bgSettings.apiUrl && (
                      <button
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={handleBgSettingsReset}
                        title="重置"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    修改后需刷新页面生效
                  </p>
                </div>
              </SettingsGroup>

              {/* 关于 */}
              <SettingsGroup title="关于">
                <div className="p-4 space-y-2">
                  <RepoCard repo="AdingApkgg/anime-search-frontend" />
                  <RepoCard repo="AdingApkgg/anime-search-api" />
              </div>
              </SettingsGroup>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// ==================== 子组件 ====================

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
      <div className="px-4 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        {title}
      </div>
      <div className="bg-white dark:bg-slate-800/80">
        {children}
      </div>
    </div>
  )
}

interface SettingsRowProps {
  icon: React.ReactNode
  label: string
  description?: string
  children: React.ReactNode
}

function SettingsRow({ icon, label, description, children }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-orange-500">{icon}</div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-900 dark:text-white">{label}</div>
          {description && (
            <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{description}</div>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

interface SegmentedControlProps {
  options: { value: string; label: string; icon?: React.ReactNode }[]
  value: string
  onChange: (value: string) => void
}

function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-700">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
            value === opt.value
              ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          )}
          onClick={() => { 
            playToggle()
            onChange(opt.value) 
          }}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-200',
        checked ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-600'
      )}
      onClick={() => {
        playToggle()
        onChange(!checked)
      }}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
          checked && 'translate-x-5'
      )}
      />
    </button>
  )
}

// GitHub API 响应类型
interface GitHubRepo {
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
}

// 语言颜色映射 (GitHub 官方颜色)
const LANGUAGE_DOT_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Rust: '#dea584',
  Python: '#3572A5',
  Go: '#00ADD8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  default: '#8b949e'
}

interface RepoCardProps {
  repo: string // 格式: owner/repo
}

function RepoCard({ repo }: RepoCardProps) {
  const [data, setData] = useState<GitHubRepo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    
    const fetchRepo = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`)
        if (!response.ok) throw new Error('Failed to fetch')
        const json = (await response.json()) as GitHubRepo
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      }
    }

    void fetchRepo()
    return () => { cancelled = true }
  }, [repo])

  const langColor = data?.language 
    ? (LANGUAGE_DOT_COLORS[data.language] ?? LANGUAGE_DOT_COLORS.default)
    : LANGUAGE_DOT_COLORS.default

  return (
    <a
      href={data?.html_url ?? `https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'block p-4 rounded-xl transition-all duration-200',
        'bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm',
        'border border-slate-200 dark:border-slate-700/50',
        'hover:border-slate-300 dark:hover:border-slate-600',
        'hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50',
        'group'
      )}
    >
      {/* Header: Icon + Full Name */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <svg 
          width={16} 
          height={16} 
          viewBox="0 0 16 16" 
          fill="currentColor"
          className="text-slate-500 dark:text-slate-400 flex-shrink-0"
        >
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
        </svg>
        <span className="text-sm font-semibold text-blue-500 dark:text-blue-400 group-hover:underline truncate">
          {loading ? repo : data?.full_name ?? repo}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 min-h-[2.5em]">
        {loading ? (
          <span className="inline-block w-3/4 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        ) : error ? (
          '加载失败'
        ) : (
          data?.description ?? '暂无描述'
        )}
      </p>

      {/* Footer: Language + Stars + Forks */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        {/* Language */}
        {(loading || data?.language) && (
          <span className="flex items-center gap-1.5">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: loading ? '#8b949e' : langColor }}
            />
            <span>{loading ? '...' : data?.language}</span>
          </span>
        )}
        
        {/* Stars */}
        <span className="flex items-center gap-1">
          <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
          <span>{loading ? '-' : data?.stargazers_count.toLocaleString()}</span>
        </span>
        
        {/* Forks */}
        <span className="flex items-center gap-1">
          <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
          </svg>
          <span>{loading ? '-' : data?.forks_count.toLocaleString()}</span>
        </span>
      </div>
    </a>
  )
}
