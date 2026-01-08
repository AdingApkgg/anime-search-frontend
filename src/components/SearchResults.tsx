import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, AlertTriangle, ChevronDown, ChevronUp, Play } from 'lucide-react'
import { COLORS } from '@/lib/utils'
import { playTap } from '@/lib/sound'
import { useSearchStore } from '@/store/search'
import type { Platform, SearchResult, EpisodeRoad } from '@/api/search'

export function SearchResults() {
  const { platforms, isSearching, error } = useSearchStore()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [displayedCounts, setDisplayedCounts] = useState<Map<string, number>>(new Map())

  const toggleExpand = (key: string) => {
    playTap()
    const newSet = new Set(expandedItems)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setExpandedItems(newSet)
  }

  const loadMore = (platformName: string) => {
    playTap()
    const current = displayedCounts.get(platformName) ?? 10
    setDisplayedCounts(new Map(displayedCounts).set(platformName, current + 20))
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <AlertTriangle size={18} />
          </div>
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      </div>
    )
  }

  if (platforms.length === 0 && !isSearching) {
    return null
  }

  return (
    <div id="results" className="w-full max-w-5xl mx-auto px-2 sm:px-4 flex flex-col gap-2 sm:gap-3 pb-8 overflow-hidden">
      {platforms.map((platform, index) => (
        <PlatformCard
          key={platform.name}
          platform={platform}
          index={index}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
          displayedCount={displayedCounts.get(platform.name) ?? 10}
          onLoadMore={() => { loadMore(platform.name) }}
        />
      ))}
    </div>
  )
}

interface PlatformCardProps {
  platform: Platform
  index: number
  expandedItems: Set<string>
  toggleExpand: (key: string) => void
  displayedCount: number
  onLoadMore: () => void
}

function PlatformCard({
  platform,
  index,
  expandedItems,
  toggleExpand,
  displayedCount,
  onLoadMore
}: PlatformCardProps) {
  const items = platform.items.slice(0, displayedCount)
  const hasMore = platform.items.length > displayedCount
  const color = COLORS[platform.color ?? 'white'] ?? COLORS.white

  return (
    <motion.div
      className="rounded-xl bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-white/5 shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      data-platform={platform.name}
      layout="position"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 dark:border-white/5">
        <span className="text-sm font-bold truncate" style={{ color }}>
          ● {platform.name}
        </span>
        <span className="ml-auto flex-shrink-0 px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70">
          {platform.items.length} 结果
        </span>
      </div>

      {/* Results */}
      {platform.items.length > 0 ? (
        <div className="p-1.5 sm:p-2 flex flex-col gap-1">
          {items.map((item, i) => (
            <ResultItem
              key={`${platform.name}-${String(i)}`}
              item={item}
              index={i}
              platformName={platform.name}
              expanded={expandedItems.has(`${platform.name}-${String(i)}`)}
              onToggle={() => { toggleExpand(`${platform.name}-${String(i)}`) }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500 dark:text-white/50 text-sm">暂无结果</div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-3">
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
            onClick={onLoadMore}
          >
            <ChevronDown size={16} />
            加载更多
          </button>
        </div>
      )}
    </motion.div>
  )
}

interface ResultItemProps {
  item: SearchResult
  index: number
  platformName: string
  expanded: boolean
  onToggle: () => void
}

function ResultItem({ item, index, expanded, onToggle }: ResultItemProps) {
  const hasEpisodes = item.episodes && item.episodes.length > 0
  const episodes = item.episodes ?? []
  const epCount = episodes.reduce((s, r) => s + r.episodes.length, 0)

  if (!hasEpisodes) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-transparent hover:bg-orange-500/10 hover:border-orange-500/15 text-slate-900 dark:text-white transition-all group"
      >
        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-md text-xs font-bold bg-orange-500/15 text-orange-500 dark:text-orange-400">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0 text-xs sm:text-sm font-medium truncate">{item.name}</div>
        <ExternalLink
          size={14}
          className="flex-shrink-0 text-slate-400 dark:text-white/30 group-hover:text-orange-500 transition-colors"
        />
      </a>
    )
  }

  return (
    <div className="overflow-hidden">
      <div
        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-transparent hover:bg-orange-500/10 hover:border-orange-500/15 text-slate-900 dark:text-white transition-all cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-md text-xs font-bold bg-orange-500/15 text-orange-500 dark:text-orange-400">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0 text-xs sm:text-sm font-medium truncate">{item.name}</div>
        <div className="flex-shrink-0 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-semibold bg-blue-500/15 text-blue-500 dark:text-blue-400">
          <Play size={10} className="hidden sm:block" />
          {epCount}
        </div>
        <button
          className="flex-shrink-0 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium bg-orange-500/10 text-orange-500 dark:text-orange-400 hover:bg-orange-500/20 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          <span className="hidden sm:inline">{expanded ? '收起' : '展开'}</span>
        </button>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-slate-400 dark:text-white/30 hover:text-orange-500 transition-colors"
          onClick={(e) => { e.stopPropagation() }}
        >
          <ExternalLink size={14} />
        </a>
      </div>

      <AnimatePresence mode="wait">
        {expanded && (
          <motion.div
            className="ml-7 sm:ml-9 mr-1 mt-1 mb-1 p-2 sm:p-3 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {episodes.map((road, i) => (
              <EpisodeRoadView key={i} road={road} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EpisodeRoadView({ road }: { road: EpisodeRoad }) {
  if (road.episodes.length === 0) return null

  return (
    <div className="mb-2 sm:mb-3 last:mb-0">
      {road.name && (
        <div className="text-[10px] sm:text-xs text-slate-500 dark:text-white/50 mb-1 sm:mb-1.5">{road.name}</div>
      )}
      <div className="flex flex-wrap gap-1">
        {road.episodes.map((ep, i) => (
          <a
            key={i}
            href={ep.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-white/80 hover:bg-orange-500/15 hover:border-orange-500/30 hover:text-orange-500 dark:hover:text-orange-400 transition-all"
          >
            {ep.name}
          </a>
        ))}
      </div>
    </div>
  )
}
