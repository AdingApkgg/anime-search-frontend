'use client'

import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, AlertTriangle, ChevronDown, Play, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { playTap } from '@/lib/sound'
import { useSearchStore } from '@/stores/search'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { Platform, SearchResult, EpisodeRoad } from '@/api/search'

export function SearchResults() {
  const { platforms, isSearching, error } = useSearchStore()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [displayedCounts, setDisplayedCounts] = useState<Map<string, number>>(new Map())

  const toggleExpand = (key: string) => {
    playTap()
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const loadMore = (platformName: string) => {
    playTap()
    setDisplayedCounts(prev => {
      const current = prev.get(platformName) ?? 10
      return new Map(prev).set(platformName, current + 20)
    })
  }

  if (error) {
    return (
      <motion.div
        className="max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center gap-3 p-4 rounded-2xl glass-bg border border-destructive/30">
          <div className="size-10 flex items-center justify-center rounded-xl bg-destructive/20 text-destructive">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-destructive">搜索出错</div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">{error}</div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (platforms.length === 0 && !isSearching) {
    return null
  }

  return (
    <div id="results" className="w-full max-w-5xl mx-auto px-2 sm:px-4 flex flex-col gap-3 sm:gap-4 pb-8">
      <AnimatePresence mode="popLayout">
        {platforms.map((platform, index) => (
          <PlatformCard
            key={platform.name}
            platform={platform}
            index={index}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            displayedCount={displayedCounts.get(platform.name) ?? 10}
            onLoadMore={() => loadMore(platform.name)}
          />
        ))}
      </AnimatePresence>
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

const PlatformCard = memo(function PlatformCard({ platform, index, expandedItems, toggleExpand, displayedCount, onLoadMore }: PlatformCardProps) {
  const items = platform.items.slice(0, displayedCount)
  const hasMore = platform.items.length > displayedCount

  return (
    <motion.div
      data-platform={platform.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
      className="glass-bg rounded-2xl border border-border/50 overflow-hidden shadow-sm"
    >
      {/* 平台头部 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-primary/5">
        <div className="size-8 rounded-lg flex items-center justify-center bg-primary text-primary-foreground shadow-sm">
          <Layers size={16} />
        </div>
        <span className="text-sm font-bold truncate flex-1 text-foreground">
          {platform.name}
        </span>
        <Badge 
          variant="secondary" 
          className="font-medium tabular-nums"
        >
          {platform.items.length}
        </Badge>
      </div>

      {/* 结果列表 */}
      <div className="p-2 sm:p-3">
        {platform.items.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {items.map((item, i) => (
              <ResultItem
                key={`${platform.name}-${i}`}
                item={item}
                index={i}
                platformName={platform.name}
                expanded={expandedItems.has(`${platform.name}-${i}`)}
                onToggle={() => toggleExpand(`${platform.name}-${i}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">暂无结果</div>
        )}

        {hasMore && (
          <div className="flex justify-center pt-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onLoadMore}
              className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ChevronDown size={14} />
              加载更多 ({platform.items.length - displayedCount})
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
})

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

  // 无剧集的简单链接
  if (!hasEpisodes) {
    return (
      <motion.a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 rounded-xl',
          'bg-muted/30 hover:bg-primary/10',
          'text-foreground transition-all duration-200 group'
        )}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex-shrink-0 size-6 sm:size-7 flex items-center justify-center rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-sm">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0 text-xs sm:text-sm font-medium truncate">
          {item.name}
        </div>
        <ExternalLink 
          size={14} 
          className="flex-shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" 
        />
      </motion.a>
    )
  }

  // 有剧集的可展开项
  return (
    <Collapsible open={expanded} onOpenChange={onToggle}>
      <motion.div
        className={cn(
          'flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 rounded-xl',
          'bg-muted/30 transition-all duration-200',
          expanded ? 'bg-primary/10 rounded-b-none' : 'hover:bg-primary/10'
        )}
        whileHover={expanded ? undefined : { x: 3 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex-shrink-0 size-6 sm:size-7 flex items-center justify-center rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-sm">
          {index + 1}
        </div>
        
        <CollapsibleTrigger asChild>
          <button className="flex-1 min-w-0 text-left text-xs sm:text-sm font-medium truncate cursor-pointer">
            {item.name}
          </button>
        </CollapsibleTrigger>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Badge 
            variant="secondary" 
            className="gap-1 text-xs font-medium tabular-nums"
          >
            <Play size={10} />
            {epCount}
          </Badge>
          
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="size-7 p-0 text-muted-foreground hover:text-foreground"
            >
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} />
              </motion.span>
            </Button>
          </CollapsibleTrigger>
          
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="size-7 flex items-center justify-center rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </motion.div>

      <CollapsibleContent>
        <motion.div
          className="px-3 py-2.5 bg-primary/5 rounded-b-xl border-t border-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <div className="pl-8 sm:pl-10 space-y-2.5">
            {episodes.map((road, i) => (
              <EpisodeRoadView key={i} road={road} />
            ))}
          </div>
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function EpisodeRoadView({ road }: { road: EpisodeRoad }) {
  if (road.episodes.length === 0) return null

  return (
    <div className="last:mb-0">
      {road.name && (
        <div className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 font-medium">
          {road.name}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {road.episodes.map((ep, i) => (
          <motion.a
            key={i}
            href={ep.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium',
              'bg-background/60 border border-border/30 text-muted-foreground',
              'hover:bg-primary hover:text-primary-foreground hover:border-transparent',
              'transition-all duration-200'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            {ep.name}
          </motion.a>
        ))}
      </div>
    </div>
  )
}
