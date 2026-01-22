'use client'

import { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Star, Trophy, Calendar, Play, Heart, Eye, Bookmark, Search, Tv, Info, X } from 'lucide-react'
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
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 }
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

      {/* 滚动容器 - 桌面端预留 tooltip 空间 */}
      <div className="sm:-mt-24 overflow-x-auto pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40">
        <motion.div
          className="flex gap-2.5 sm:gap-3 px-3 sm:px-4 sm:pt-24 snap-x snap-mandatory"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {bangumiList.map((info) => (
            <BangumiCardItem key={info.id} info={info} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const BangumiCardItem = memo(function BangumiCardItem({ info }: { info: BangumiInfo }) {
  const { name, name_cn, image, score, rank, air_date, summary, url, eps, collection } = info
  const { setQuery, isSearching } = useSearchStore()
  const displayName = name_cn ?? name
  const [showSummary, setShowSummary] = useState(false)

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

  // 移动端：点击简介按钮
  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    playTap()
    setShowSummary(!showSummary)
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
        "group relative flex-shrink-0 w-[140px] sm:w-[180px] snap-start",
        isSearching ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
      variants={item}
      whileHover={isSearching ? {} : { y: -6, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      whileTap={isSearching ? {} : { scale: 0.97 }}
      onClick={handleCardClick}
    >
      {/* 桌面端：悬浮时显示的简介 - 定位在卡片上方 */}
      {summary && (
        <div className="hidden sm:block absolute bottom-full left-0 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="glass border border-white/10 rounded-xl p-3 shadow-xl text-xs text-foreground/90 line-clamp-4 leading-relaxed">
            {summary}
          </div>
        </div>
      )}

      {/* 卡片容器 - 使用 glass 效果 */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden glass-muted border border-white/10 shadow-lg sm:group-hover:shadow-2xl sm:group-hover:shadow-primary/10 sm:group-hover:border-primary/30 transition-all duration-300">
        {/* 封面图 */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={displayName}
              className="absolute inset-0 w-full h-full object-cover sm:transition-transform sm:duration-500 sm:group-hover:scale-110"
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
              "absolute top-1.5 sm:top-2 left-1.5 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-white text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-0.5 sm:gap-1",
              scoreBadge.bg
            )}>
              <Star size={9} className="fill-current sm:size-[11px]" />
              <span>{score.toFixed(1)}</span>
            </div>
          )}

          {/* 右上角：移动端显示操作按钮组，桌面端显示排名 */}
          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex items-center gap-1">
            {/* 移动端：简介按钮（有简介时显示） */}
            {summary && (
              <button
                className="sm:hidden size-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white active:bg-black/70 transition-colors"
                onClick={handleInfoClick}
              >
                {showSummary ? <X size={12} /> : <Info size={12} />}
              </button>
            )}
            {/* 移动端：外链按钮 */}
            <button
              className="sm:hidden size-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white active:bg-black/70 transition-colors"
              onClick={handleExternalClick}
            >
              <ExternalLink size={12} />
            </button>
            {/* 桌面端：排名 */}
            {rank && rank <= 500 && (
              <div className="hidden sm:flex px-1.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-amber-400 text-[10px] font-bold shadow-md items-center gap-0.5">
                <Trophy size={10} className="fill-current" />
                <span>#{rank}</span>
              </div>
            )}
          </div>

          {/* 桌面端：悬浮操作层 */}
          <div className="hidden sm:flex absolute inset-0 items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/20 backdrop-blur-[2px]">
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

          {/* 移动端：简介浮层 */}
          <AnimatePresence>
            {showSummary && summary && (
              <motion.div
                className="sm:hidden absolute inset-0 bg-black/80 backdrop-blur-sm p-3 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={handleInfoClick}
              >
                <p className="text-[11px] text-white/90 leading-relaxed line-clamp-[8]">
                  {summary}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 底部标题信息 */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
            <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
              {displayName}
            </h3>

            <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] text-white/70">
              {air_date && (
                <span className="flex items-center gap-0.5 bg-white/10 rounded px-1 sm:px-1.5 py-0.5">
                  <Calendar size={8} className="sm:size-[9px]" />
                  {air_date.slice(0, 4)}
                </span>
              )}
              {eps && (
                <span className="flex items-center gap-0.5 bg-white/10 rounded px-1 sm:px-1.5 py-0.5">
                  <Play size={8} className="fill-current sm:size-[9px]" />
                  {eps}话
                </span>
              )}
              {/* 移动端：显示排名 */}
              {rank && rank <= 500 && (
                <span className="sm:hidden flex items-center gap-0.5 bg-amber-500/20 text-amber-300 rounded px-1 py-0.5">
                  <Trophy size={8} className="fill-current" />
                  #{rank}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 底部收藏统计 - 桌面端显示 */}
        {collection && (
          <div className="hidden sm:grid grid-cols-3 gap-1 p-2 bg-background/60 backdrop-blur-sm">
            <CollectionStat icon={Heart} value={collection.wish} color="text-pink-400" label="想看" />
            <CollectionStat icon={Bookmark} value={collection.collect} color="text-emerald-400" label="看过" />
            <CollectionStat icon={Eye} value={collection.doing} color="text-blue-400" label="在看" />
          </div>
        )}
      </div>

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
