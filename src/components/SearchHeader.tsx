import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, ChevronDown, ChevronUp, Check, X, Settings2, CornerDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { playTap, playButton, playToggle } from '@/lib/sound'
import { useSearchStore } from '@/store/search'
import { StatsCorner } from './StatsCorner'

export function SearchHeader() {
  const {
    query,
    setQuery,
    isSearching,
    progress,
    rules,
    selectedRules,
    rulesLoading,
    rulesError,
    toggleRule,
    selectAllRules,
    clearAllRules,
    loadRules,
    search
  } = useSearchStore()

  const [showRules, setShowRules] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void loadRules()
  }, [loadRules])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isSearching) {
      playButton()
      void search()
    }
  }

  const handleClear = () => {
    playTap()
    setQuery('')
    inputRef.current?.focus()
  }

  const handleToggleRules = () => {
    playToggle()
    setShowRules(!showRules)
  }

  return (
    <header 
      className="flex flex-col items-center justify-end px-2 sm:px-4 pt-16 sm:pt-4 pb-4 sm:pb-6 min-h-[45vh] sm:min-h-[50vh]"
    >
      {/* Brand - 白色标题带橙色光晕 */}
      <motion.h1
        className="font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 text-white drop-shadow-[0_2px_8px_rgba(249,115,22,0.6)] dark:drop-shadow-[0_2px_12px_rgba(251,146,60,0.8)]"
        style={{ textShadow: '0 0 30px rgba(249,115,22,0.4), 0 0 60px rgba(251,146,60,0.2)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        动漫聚搜
      </motion.h1>

      {/* Search Box - 液态玻璃风格 */}
      <motion.div
        className="w-full max-w-lg px-2 sm:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="group relative">
            {/* 渐变光晕效果 */}
            <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 bg-gradient-to-r from-orange-500/30 via-amber-500/20 to-orange-400/30 blur-lg transition-opacity duration-500" />
            
            {/* 搜索框主体 */}
            <div className={cn(
              'relative flex items-center rounded-2xl overflow-hidden',
              'bg-white/85 dark:bg-slate-800/85',
              'border border-gray-200/50 dark:border-slate-600/50',
              'shadow-lg shadow-black/5 dark:shadow-black/20',
              isSearching && 'border-orange-500/50'
            )}>
              {/* 搜索图标 */}
              <div className="absolute left-4 sm:left-5 z-20 pointer-events-none">
                {isSearching ? (
                  <Loader2 
                    size={22} 
                    className="text-orange-500 animate-spin" 
                  />
                ) : (
                  <Search 
                    size={22} 
                    className={cn(
                      'text-orange-500/50 dark:text-orange-400/60',
                      'group-hover:text-orange-500/70 dark:group-hover:text-orange-400/80',
                      'group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400',
                      'group-focus-within:scale-110 transition-all duration-300'
                    )}
                  />
                )}
              </div>

              {/* 输入框 */}
              <input
                ref={inputRef}
                type="search"
                className={cn(
                  'relative z-10 w-full pl-12 sm:pl-14 pr-14 sm:pr-24 py-4 sm:py-5',
                  'text-base sm:text-lg rounded-2xl',
                  'text-gray-800 dark:text-slate-100',
                  'placeholder:text-gray-400/80 dark:placeholder:text-slate-400/70',
                  'bg-transparent outline-none',
                  'font-medium tracking-wide',
                  'disabled:cursor-not-allowed'
                )}
                placeholder="输入动漫名称..."
                value={query}
                onChange={(e) => { setQuery(e.target.value) }}
                disabled={isSearching}
              />

              {/* 右侧操作区 */}
              <div className="absolute right-3 sm:right-4 z-20 flex items-center gap-2">
                {query && !isSearching && (
                  <button
                    type="button"
                    className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                    onClick={handleClear}
                  >
                    <X size={16} />
                  </button>
                )}

                {isSearching ? (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 tabular-nums">
                    {progress.current}/{progress.total}
                  </span>
                ) : (
                  <kbd className={cn(
                    'inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-medium',
                    'bg-gray-100/80 dark:bg-slate-700/60 text-gray-500 dark:text-slate-400',
                    'border border-gray-200/50 dark:border-slate-600/50',
                    'group-focus-within:bg-orange-500/10 group-focus-within:text-orange-500',
                    'dark:group-focus-within:bg-orange-400/15 dark:group-focus-within:text-orange-400',
                    'group-focus-within:border-orange-500/30 dark:group-focus-within:border-orange-400/30',
                    'transition-all duration-200'
                  )}>
                    <CornerDownLeft size={14} />
                    <span className="hidden sm:inline">Enter</span>
                  </kbd>
                )}
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mt-3 sm:mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <StatsCorner />
      </motion.div>

      {/* Options + Rules Panel Container */}
      <motion.div
        className="relative w-full max-w-lg mt-2 sm:mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Options - 液态玻璃按钮 */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className={cn(
              'flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all',
              'bg-white/80 dark:bg-slate-800/80',
              'border border-gray-200/50 dark:border-slate-600/50',
              'text-gray-700 dark:text-slate-200 shadow-sm',
              'hover:bg-white/90 dark:hover:bg-slate-700/70 hover:border-gray-300/50',
              showRules && 'bg-orange-50/80 dark:bg-orange-900/40 border-orange-300/50 dark:border-orange-500/40 text-orange-600 dark:text-orange-300'
            )}
            onClick={handleToggleRules}
          >
            <Settings2 size={14} />
            搜索源
            <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-500 dark:text-orange-400">
              {selectedRules.size}
            </span>
            {showRules ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Rules Panel - 始终渲染，用 CSS 控制显示 */}
        <div
          className={cn(
            'absolute left-0 right-0 top-full mt-2 p-4 rounded-2xl z-20',
            'bg-white/95 dark:bg-slate-900/95',
            'border border-gray-200/50 dark:border-white/10',
            'shadow-xl shadow-black/10 dark:shadow-black/30',
            'origin-top transition-all duration-150 ease-out',
            showRules 
              ? 'opacity-100 scale-100 pointer-events-auto' 
              : 'opacity-0 scale-y-95 pointer-events-none'
          )}
        >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">选择搜索源</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100/80 dark:bg-slate-700/60 text-gray-600 dark:text-slate-400 hover:bg-gray-200/80 dark:hover:bg-slate-600/60 transition-colors"
                    onClick={() => {
                      playTap()
                      selectAllRules()
                    }}
                  >
                    <Check size={10} />
                    全选
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100/80 dark:bg-slate-700/60 text-gray-600 dark:text-slate-400 hover:bg-gray-200/80 dark:hover:bg-slate-600/60 transition-colors"
                    onClick={() => {
                      playTap()
                      clearAllRules()
                    }}
                  >
                    <X size={10} />
                    清除
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {rulesLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                    <Loader2 size={14} className="animate-spin" />
                    加载中...
                  </div>
                ) : rulesError ? (
                  <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
                    加载失败
                    <button
                      type="button"
                      className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                      onClick={() => { void loadRules() }}
                    >
                      重试
                    </button>
                  </div>
                ) : (
                  rules.map((rule) => {
                    const selected = selectedRules.has(rule.name)

                    return (
                      <label
                        key={rule.name}
                        className={cn(
                          'flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
                          'bg-gray-50/80 dark:bg-slate-800/60 text-gray-600 dark:text-slate-400',
                          'border border-gray-200/50 dark:border-slate-600/30',
                          'hover:bg-gray-100/80 dark:hover:bg-slate-700/60 hover:text-gray-800 dark:hover:text-slate-300',
                          selected && 'bg-orange-50/80 dark:bg-orange-500/15 border-orange-300/50 dark:border-orange-500/30 text-orange-600 dark:text-orange-300'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {
                            playTap()
                            toggleRule(rule.name)
                          }}
                          className="w-3.5 h-3.5 cursor-pointer appearance-none rounded border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-700 checked:bg-orange-500 checked:border-orange-500 checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M9%2016.17L4.83%2012l-1.42%201.41L9%2019%2021%207l-1.41-1.41z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat checked:bg-[length:12px_12px] transition-all"
                        />
                        {rule.name}
                      </label>
                    )
                  })
                )}
              </div>
        </div>
      </motion.div>
    </header>
  )
}
