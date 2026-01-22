'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Check, X, Settings2, CornerDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { playTap, playButton, playToggle } from '@/lib/sound'
import { useSearchStore } from '@/stores/search'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { StatsCorner } from './StatsCorner'
import { BangumiCard } from './BangumiCard'

export function SearchHeader() {
  const {
    query, setQuery, isSearching, progress,
    rules, selectedRules, rulesLoading, rulesError,
    toggleRule, selectAllRules, clearAllRules, loadRules, search,
    platforms, bangumiList
  } = useSearchStore()

  // 只有当有实际结果时才移动搜索框
  const hasResults = platforms.length > 0 || bangumiList.length > 0

  const [showRules, setShowRules] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void loadRules()
  }, [loadRules])

  // 点击外部关闭面板
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowRules(false)
      }
    }
    if (showRules) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showRules])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isSearching) {
      playButton()
      setShowRules(false)
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
    <header className={cn(
      "flex flex-col items-center justify-center px-2 sm:px-4 transition-all duration-500",
      hasResults ? "py-6 sm:py-8" : "py-8 sm:py-12 min-h-svh"
    )}>
      {/* Bangumi 卡片 - 显示在标题上方 */}
      <BangumiCard />

      {/* Brand */}
      <motion.h1
        className="font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 text-white"
        style={{ 
          textShadow: '0 0 30px var(--primary), 0 0 60px var(--primary), 0 0 90px color-mix(in oklch, var(--primary) 50%, transparent)'
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        动漫聚搜
      </motion.h1>

      {/* Search Box with Rules */}
      <motion.div
        ref={containerRef}
        className="relative w-full max-w-lg px-2 sm:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 blur-lg transition-opacity duration-500" />

            <div 
              className={cn(
                'relative flex items-center rounded-xl overflow-visible',
                'glass-bg border border-border/50 shadow-lg',
                isSearching && 'border-primary/50',
                showRules && 'border-primary/30'
              )}
            >
              {/* 搜索图标 */}
              <div className="absolute left-4 sm:left-5 z-20 pointer-events-none">
                {isSearching ? (
                  <Loader2 size={22} className="text-primary animate-spin" />
                ) : (
                  <Search
                    size={22}
                    className={cn(
                      'text-muted-foreground',
                      'group-hover:text-primary/70',
                      'group-focus-within:text-primary group-focus-within:scale-110',
                      'transition-all duration-300'
                    )}
                  />
                )}
              </div>

              {/* 输入框 */}
              <input
                ref={inputRef}
                type="search"
                className={cn(
                  'relative z-10 w-full pl-12 sm:pl-14 pr-32 sm:pr-40 py-4 sm:py-5',
                  'text-base sm:text-lg rounded-xl',
                  'text-foreground placeholder:text-muted-foreground',
                  'bg-transparent outline-none',
                  'font-medium tracking-wide',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
                placeholder="输入动漫名称..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isSearching}
                onFocus={() => setShowRules(false)}
              />

              {/* 右侧按钮组 */}
              <div className="absolute right-2 sm:right-3 z-20 flex items-center gap-1 sm:gap-1.5">
                {/* 清除按钮 */}
                {query && !isSearching && (
                  <button
                    type="button"
                    className="size-7 flex items-center justify-center rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={handleClear}
                  >
                    <X size={15} />
                  </button>
                )}

                {/* 搜索源按钮 */}
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all',
                    showRules
                      ? 'bg-primary/15 text-primary'
                      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                  )}
                  onClick={handleToggleRules}
                >
                  <Settings2 size={14} />
                  <span className="tabular-nums">{selectedRules.size}</span>
                </button>

                {/* 分隔线 */}
                <div className="w-px h-5 bg-border/50" />

                {/* Enter 提示或进度 */}
                {isSearching ? (
                  <Badge variant="secondary" className="tabular-nums text-xs">
                    {progress.current}/{progress.total}
                  </Badge>
                ) : (
                  <kbd className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
                    'bg-muted/50 text-muted-foreground border border-border/50',
                    'group-focus-within:bg-primary/10 group-focus-within:text-primary group-focus-within:border-primary/30',
                    'transition-all duration-200'
                  )}>
                    <CornerDownLeft size={12} />
                    <span className="hidden sm:inline">Enter</span>
                  </kbd>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* 搜索源面板 */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              className="absolute left-0 right-0 top-full mt-2 rounded-xl z-30 overflow-hidden glass-bg-strong border border-border/50 shadow-xl"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {/* 快捷操作 */}
              <div className="flex border-b border-border/30">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  onClick={() => { playTap(); selectAllRules() }}
                >
                  <Check size={12} />
                  全选
                </button>
                <div className="w-px bg-border/30" />
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                  onClick={() => { playTap(); clearAllRules() }}
                >
                  <X size={12} />
                  清除
                </button>
              </div>

              {/* 搜索源列表 */}
              <div className="p-3 max-h-64 overflow-y-auto">
                {rulesLoading ? (
                  <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                    <Loader2 size={16} className="animate-spin" />
                    加载中...
                  </div>
                ) : rulesError ? (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <span className="text-sm text-destructive">加载失败</span>
                    <Button variant="outline" size="sm" onClick={() => void loadRules()}>
                      重试
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {rules.map((rule) => {
                      const selected = selectedRules.has(rule.name)
                      return (
                        <label
                          key={rule.name}
                          className={cn(
                            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer',
                            'transition-all border',
                            selected
                              ? 'bg-primary/15 border-primary/40 text-primary'
                              : 'border-border/50 text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                          )}
                        >
                          <Checkbox
                            checked={selected}
                            onCheckedChange={() => { playTap(); toggleRule(rule.name) }}
                            className="size-3.5"
                          />
                          {rule.name}
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mt-4 sm:mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <StatsCorner />
      </motion.div>
    </header>
  )
}
