'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Star, Trophy, Calendar, Play, Heart, Eye, Bookmark, Search } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { playTap } from '@/lib/sound'
import { useSearchStore } from '@/stores/search'
import type { BangumiInfo } from '@/api/bangumi'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  show: { opacity: 1, scale: 1, y: 0 }
}

export function BangumiCard() {
  const { bangumiList } = useSearchStore()

  if (bangumiList.length === 0) return null

  return (
    <div className="w-full mb-4 sm:mb-6">
      <motion.div
        className="flex items-center gap-2.5 px-3 sm:px-4 mb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="size-5 rounded-md bg-gradient-to-br from-pink-500 to-primary flex items-center justify-center">
          <Star size={12} className="text-white fill-white" />
        </div>
        <span className="text-sm font-semibold text-foreground">Bangumi 匹配</span>
        <span className="text-xs text-muted-foreground tabular-nums">({bangumiList.length})</span>
      </motion.div>

      <motion.div
        className="flex gap-3 sm:gap-4 px-3 sm:px-4 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary/50"
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

  // 评分颜色
  const getScoreColor = (s: number) => {
    if (s >= 8) return 'from-emerald-500 to-emerald-600'
    if (s >= 7) return 'from-blue-500 to-blue-600'
    if (s >= 6) return 'from-amber-500 to-amber-600'
    return 'from-slate-500 to-slate-600'
  }

  return (
    <motion.div
      className={cn(
        "group relative flex-shrink-0 w-[180px] sm:w-[200px] snap-start",
        isSearching ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      )}
      variants={item}
      whileHover={isSearching ? {} : { y: -4, transition: { duration: 0.2 } }}
      whileTap={isSearching ? {} : { scale: 0.98 }}
      onClick={handleCardClick}
    >
      {/* 卡片容器 */}
      <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-lg group-hover:shadow-xl group-hover:border-primary/30 transition-all duration-300">
        {/* 封面图 */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={displayName}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="12">No Image</text></svg>'
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play size={32} className="text-muted-foreground" />
            </div>
          )}

          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

          {/* 左上角评分 */}
          {score && (
            <div className={cn(
              "absolute top-2 left-2 px-2 py-0.5 rounded-md bg-gradient-to-r text-white text-xs font-bold shadow-md",
              getScoreColor(score)
            )}>
              <Star size={10} className="inline mr-0.5 -mt-0.5 fill-current" />
              {score.toFixed(1)}
            </div>
          )}

          {/* 右上角排名 + 外链 */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {rank && rank <= 500 && (
              <div className="px-1.5 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold shadow-md flex items-center gap-0.5">
                <Trophy size={9} />
                {rank}
              </div>
            )}
            <motion.button
              className="size-6 rounded-md bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-primary transition-colors"
              onClick={handleExternalClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="在 Bangumi 查看"
            >
              <ExternalLink size={11} />
            </motion.button>
          </div>

          {/* 中心搜索提示 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="size-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Search size={18} className="text-white" />
            </div>
          </div>

          {/* 底部信息 */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {displayName}
            </h3>

            <div className="flex items-center gap-2 mt-1 text-[10px] text-white/60">
              {air_date && (
                <span className="flex items-center gap-0.5">
                  <Calendar size={9} />
                  {air_date.slice(0, 4)}
                </span>
              )}
              {eps && (
                <span className="flex items-center gap-0.5">
                  <Play size={9} />
                  {eps}话
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 底部收藏数据 */}
        {collection && (
          <div className="flex items-center justify-between px-2.5 py-2 bg-background/80 backdrop-blur-sm border-t border-border/30">
            <div className="flex items-center gap-0.5 text-[10px] text-pink-500">
              <Heart size={10} className="fill-current" />
              <span className="font-medium">{formatNumber(collection.wish)}</span>
            </div>
            <div className="flex items-center gap-0.5 text-[10px] text-emerald-500">
              <Bookmark size={10} className="fill-current" />
              <span className="font-medium">{formatNumber(collection.collect)}</span>
            </div>
            <div className="flex items-center gap-0.5 text-[10px] text-blue-500">
              <Eye size={10} />
              <span className="font-medium">{formatNumber(collection.doing)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 悬浮简介 */}
      {summary && (
        <div className="hidden sm:block absolute left-0 right-0 -bottom-1 p-2.5 rounded-b-xl bg-background/95 backdrop-blur-md border border-t-0 border-border/50 shadow-lg translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
          <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
            {summary}
          </p>
          {name_cn && name_cn !== name && (
            <p className="mt-1.5 text-[10px] text-muted-foreground/60 truncate italic">{name}</p>
          )}
        </div>
      )}
    </motion.div>
  )
})
