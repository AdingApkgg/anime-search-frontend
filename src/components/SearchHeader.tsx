import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, ChevronDown, ChevronUp, Check, X, ListVideo, Settings2 } from 'lucide-react'
import { cn, COLORS } from '@/lib/utils'
import { playTap, playButton, playToggle } from '@/lib/sound'
import { useSearchStore } from '@/store/search'

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
    getEpisodes,
    setGetEpisodes,
    toggleRule,
    selectAllRules,
    clearAllRules,
    loadRules,
    search,
    platforms
  } = useSearchStore()
  
  // 有结果时减少 header 高度
  const hasResults = platforms.length > 0

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

  const handleToggleEpisodes = () => {
    playToggle()
    setGetEpisodes(!getEpisodes)
  }

  const handleToggleRules = () => {
    playToggle()
    setShowRules(!showRules)
  }

  return (
    <header 
      className={cn(
        "flex flex-col items-center justify-end px-2 sm:px-4 transition-all duration-500",
        hasResults ? "pt-16 sm:pt-4 pb-4 sm:pb-6" : "min-h-[45vh] sm:min-h-[50vh]"
      )}
    >
      {/* Brand */}
      <motion.h1
        className={cn(
          "font-extrabold text-[var(--text-primary)] tracking-tight transition-all duration-300",
          hasResults ? "text-2xl sm:text-3xl mb-3 sm:mb-4" : "text-3xl sm:text-4xl mb-4 sm:mb-6"
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        动漫聚搜
      </motion.h1>

      {/* Search Box */}
      <motion.div
        className={cn(
          "w-full transition-all duration-300",
          hasResults ? "max-w-xl" : "max-w-lg"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <form onSubmit={handleSubmit}>
          <div
            className={cn(
              'flex items-center rounded-xl border transition-all duration-200',
              'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-600/50 shadow-lg',
              'hover:border-slate-300 dark:hover:border-slate-500/50',
              'focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/30',
              isSearching && 'border-orange-500 ring-2 ring-orange-500/30',
              hasResults && 'shadow-md'
            )}
          >
            <div
              className={cn(
                'px-3 sm:px-4 text-[var(--text-muted)] transition-colors',
                'focus-within:text-orange-500',
                isSearching && 'animate-spin'
              )}
            >
              {isSearching ? <Loader2 size={18} /> : <Search size={18} />}
            </div>

            <input
              ref={inputRef}
              type="search"
              className="flex-1 py-3 bg-transparent border-none outline-none text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              placeholder="输入动漫名称..."
              value={query}
              onChange={(e) => { setQuery(e.target.value) }}
              disabled={isSearching}
            />

            <div className="flex items-center gap-2 pr-2">
              {query && !isSearching && (
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-colors"
                  onClick={handleClear}
                >
                  <X size={14} />
                </button>
              )}

              {isSearching ? (
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 tabular-nums">
                  {progress.current}/{progress.total}
                </span>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm font-bold hover:bg-orange-400 disabled:bg-slate-200 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed transition-colors shadow-md"
                  disabled={!query.trim()}
                >
                  搜索
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>

      {/* Options */}
      <motion.div
        className={cn(
          "flex flex-wrap items-center justify-center gap-2",
          hasResults ? "mt-2 sm:mt-3" : "mt-3 sm:mt-4"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <button
          type="button"
          className={cn(
            'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all border',
            'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-200 shadow-sm sm:shadow-md',
            'hover:bg-slate-200 dark:hover:bg-slate-600 hover:border-slate-400',
            getEpisodes && 'bg-orange-100 dark:bg-orange-900 border-orange-400 dark:border-orange-500 text-orange-600 dark:text-orange-300'
          )}
          onClick={handleToggleEpisodes}
        >
          <ListVideo size={14} />
          <span className="hidden xs:inline">获取</span>集数
        </button>

        <button
          type="button"
          className={cn(
            'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all border',
            'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-200 shadow-sm sm:shadow-md',
            'hover:bg-slate-200 dark:hover:bg-slate-600 hover:border-slate-400',
            showRules && 'bg-orange-100 dark:bg-orange-900 border-orange-400 dark:border-orange-500 text-orange-600 dark:text-orange-300'
          )}
          onClick={handleToggleRules}
        >
          <Settings2 size={14} />
          搜索源
          <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-400">
            {selectedRules.size}
          </span>
          {showRules ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </motion.div>

      {/* Rules Panel */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            className="w-full max-w-lg mt-3 p-4 rounded-xl border bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">选择搜索源</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
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
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
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
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Loader2 size={14} className="animate-spin" />
                  加载中...
                </div>
              ) : rulesError ? (
                <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
                  加载失败
                  <button
                    type="button"
                    className="px-2 py-0.5 rounded text-xs border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    onClick={() => { void loadRules() }}
                  >
                    重试
                  </button>
                </div>
              ) : (
                rules.map((rule) => {
                  const selected = selectedRules.has(rule.name)
                  const color = COLORS[rule.color ?? 'white'] ?? COLORS.white

                  return (
                    <button
                      key={rule.name}
                      type="button"
                      className={cn(
                        'flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border',
                        'bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400',
                        'hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-800 dark:hover:text-slate-300',
                        selected && 'bg-orange-100 dark:bg-orange-500/15 border-orange-400 dark:border-orange-500/30 text-orange-700 dark:text-slate-200'
                      )}
                      onClick={() => {
                        playTap()
                        toggleRule(rule.name)
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {rule.name}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
