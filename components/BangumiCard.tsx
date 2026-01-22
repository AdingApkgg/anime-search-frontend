'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Star, Trophy, Calendar, Play, Heart, Eye, Bookmark, Search, Tv } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { playTap } from '@/lib/sound'
import { useSearchStore } from '@/stores/search'
import type { BangumiInfo } from '@/api/bangumi'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  }
}

export function BangumiCard() {
  const { bangumiList } = useSearchStore()

  if (bangumiList.length === 0) return null

  return (
    <div className="w-full mb-4 sm:mb-6">
      <motion.div
        className="flex items-center gap-2 px-3 sm:px-4 mb-3"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="size-6 rounded-lg bg-gradient-to-br from-pink-500 via-rose-500 to-primary flex items-center justify-center shadow-sm">
          <Tv size={13} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-foreground">Bangumi</span>
        <div className="h-4 w-px bg-border/60" />
        <span className="text-xs text-muted-foreground tabular-nums">{bangumiList.length} 条匹配</span>
      </motion.div>

      <motion.div
        className="flex gap-3 px-3 sm:px-4 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {bangumiList.map((info) => (
          <BangumiCardItem key={info.id} info={info} />
        ))}
      </motion.div>
    </div>
  )
}

const BangumiCardItem = memo(function BangumiCardItem({ info }: { info: BangumiInfo }) {
  const { name, name_cn, image, score, rank, air_date, summary, url, eps, collection } = info
  const { setQuery, isSearching } = useSearchStore()
  const displayName = name_cn ?? name

  // 点击卡片：填入动漫名并聚焦搜索框（搜索中禁用）
  const handleCardClick = () => {
    if (isSearching) return
    
    playTap()
    setQuery(displayName)
    // 聚焦搜索框
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="搜索"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
      searchInput.setSelectionRange(displayName.length, displayName.length)
    }
  }

  // 点击外链按钮：跳转到 Bangumi
  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    playTap()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // 评分徽章样式
  const getScoreBadge = (s: number) => {
    if (s >= 8.5) return { bg: 'bg-gradient-to-r from-amber-400 to-orange-500', text: '神作', icon: '🏆' }
    if (s >= 8) return { bg: 'bg-gradient-to-r from-emerald-400 to-teal-500', text: '', icon: '' }
    if (s >= 7) return { bg: 'bg-gradient-to-r from-blue-400 to-indigo-500', text: '', icon: '' }
    if (s >= 6) return { bg: 'bg-gradient-to-r from-slate-400 to-slate-500', text: '', icon: '' }
    return { bg: 'bg-gradient-to-r from-slate-500 to-slate-600', text: '', icon: '' }
  }

  const scoreBadge = score ? getScoreBadge(score) : null

  return (
    <motion.div
      className={cn(
        "group relative flex-shrink-0 w-[160px] sm:w-[180px] snap-start",
        isSearching ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
      variants={item}
      whileHover={isSearching ? {} : { y: -6, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      whileTap={isSearching ? {} : { scale: 0.97 }}
      onClick={handleCardClick}
    >
      {/* 卡片容器 - 使用 glass 效果 */}
      <div className="relative rounded-2xl overflow-hidden glass-muted border border-white/10 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/10 group-hover:border-primary/30 transition-all duration-300">
        {/* 封面图 */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={displayName}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="10">No Image</text></svg>'
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Tv size={32} className="text-muted-foreground/40" />
            </div>
          )}

          {/* 渐变遮罩 - 更柔和 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* 左上角评分 */}
          {score && scoreBadge && (
            <div className={cn(
              "absolute top-2 left-2 px-2 py-1 rounded-lg text-white text-xs font-bold shadow-lg flex items-center gap-1",
              scoreBadge.bg
            )}>
              <Star size={11} className="fill-current" />
              <span>{score.toFixed(1)}</span>
            </div>
          )}

          {/* 右上角排名 */}
          {rank && rank <= 500 && (
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-amber-400 text-[10px] font-bold shadow-md flex items-center gap-0.5">
              <Trophy size={10} className="fill-current" />
              <span>#{rank}</span>
            </div>
          )}

          {/* 悬浮操作层 */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/20 backdrop-blur-[2px]">
            <motion.div
              className="size-11 rounded-full bg-primary shadow-lg flex items-center justify-center"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
            >
              <Search size={18} className="text-primary-foreground" />
            </motion.div>
            <motion.button
              className="size-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              onClick={handleExternalClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="在 Bangumi 查看"
            >
              <ExternalLink size={14} />
            </motion.button>
          </div>

          {/* 底部标题信息 */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
              {displayName}
            </h3>

            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-white/70">
              {air_date && (
                <span className="flex items-center gap-0.5 bg-white/10 rounded px-1.5 py-0.5">
                  <Calendar size={9} />
                  {air_date.slice(0, 4)}
                </span>
              )}
              {eps && (
                <span className="flex items-center gap-0.5 bg-white/10 rounded px-1.5 py-0.5">
                  <Play size={9} className="fill-current" />
                  {eps}话
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 底部收藏统计 - 更简洁 */}
        {collection && (
          <div className="grid grid-cols-3 gap-1 p-2 bg-background/60 backdrop-blur-sm">
            <CollectionStat icon={Heart} value={collection.wish} color="text-pink-400" label="想看" />
            <CollectionStat icon={Bookmark} value={collection.collect} color="text-emerald-400" label="看过" />
            <CollectionStat icon={Eye} value={collection.doing} color="text-blue-400" label="在看" />
          </div>
        )}
      </div>

      {/* 悬浮简介卡片 */}
      {summary && (
        <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 bottom-0 w-[calc(100%+24px)] p-3 rounded-xl glass border border-white/10 shadow-xl translate-y-[calc(100%+4px)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-20 pointer-events-none">
          <p className="text-[11px] text-foreground/80 line-clamp-3 leading-relaxed">
            {summary}
          </p>
          {name_cn && name_cn !== name && (
            <p className="mt-2 text-[10px] text-muted-foreground truncate font-medium">{name}</p>
          )}
        </div>
      )}
    </motion.div>
  )
})

// 收藏统计小组件
function CollectionStat({ 
  icon: Icon, 
  value, 
  color,
  label 
}: { 
  icon: typeof Heart
  value: number
  color: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={cn("flex items-center gap-0.5", color)}>
        <Icon size={10} className="fill-current" />
        <span className="text-[10px] font-semibold tabular-nums">{formatNumber(value)}</span>
      </div>
      <span className="text-[8px] text-muted-foreground">{label}</span>
    </div>
  )
}
