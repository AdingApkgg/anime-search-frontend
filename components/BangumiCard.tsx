'use client'

import { memo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Star, Trophy, Calendar, Play, Heart, Eye, Bookmark, Tv, Info, X } from 'lucide-react'
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
  const [detailInfo, setDetailInfo] = useState<BangumiInfo | null>(null)

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

      {/* 滚动容器 */}
      <div className="overflow-x-auto pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40">
        <motion.div
          className="flex gap-2.5 sm:gap-3 px-3 sm:px-4 snap-x snap-mandatory"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {bangumiList.map((info) => (
            <BangumiCardItem
              key={info.id}
              info={info}
              onOpenDetail={() => setDetailInfo(info)}
            />
          ))}
        </motion.div>
      </div>

      {/* 详情模态框 */}
      <DetailModal info={detailInfo} onClose={() => setDetailInfo(null)} />
    </div>
  )
}

// 简化的卡片组件
const BangumiCardItem = memo(function BangumiCardItem({
  info,
  onOpenDetail
}: {
  info: BangumiInfo
  onOpenDetail: () => void
}) {
  const { name, name_cn, image, score, rank, air_date, eps } = info
  const { setQuery, isSearching } = useSearchStore()
  const displayName = name_cn ?? name

  // 点击卡片：填入动漫名并聚焦搜索框
  const handleCardClick = () => {
    if (isSearching) return
    playTap()
    setQuery(displayName)
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="搜索"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
      searchInput.setSelectionRange(displayName.length, displayName.length)
    }
  }

  // 点击详情按钮：打开模态框
  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    playTap()
    onOpenDetail()
  }

  // 评分徽章样式
  const getScoreBadge = (s: number) => {
    if (s >= 8.5) return 'bg-gradient-to-r from-amber-400 to-orange-500'
    if (s >= 8) return 'bg-gradient-to-r from-emerald-400 to-teal-500'
    if (s >= 7) return 'bg-gradient-to-r from-blue-400 to-indigo-500'
    if (s >= 6) return 'bg-gradient-to-r from-slate-400 to-slate-500'
    return 'bg-gradient-to-r from-slate-500 to-slate-600'
  }

  return (
    <motion.div
      className={cn(
        "group relative flex-shrink-0 w-[120px] sm:w-[150px] snap-start",
        isSearching ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
      variants={item}
      whileHover={isSearching ? {} : { y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      whileTap={isSearching ? {} : { scale: 0.97 }}
      onClick={handleCardClick}
    >
      <div className="relative rounded-xl overflow-hidden glass-muted border border-white/10 shadow-lg transition-all duration-200 sm:group-hover:border-primary/30 sm:group-hover:shadow-xl">
        {/* 封面图 */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={displayName}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="10">No Image</text></svg>'
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Tv size={28} className="text-muted-foreground/40" />
            </div>
          )}

          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* 左上角评分 */}
          {score && (
            <div className={cn(
              "absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-white text-[10px] font-bold shadow-lg flex items-center gap-0.5",
              getScoreBadge(score)
            )}>
              <Star size={9} className="fill-current" />
              <span>{score.toFixed(1)}</span>
            </div>
          )}

          {/* 右上角详情按钮 */}
          <button
            className="absolute top-1.5 right-1.5 size-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white active:bg-black/70 hover:bg-black/70 transition-colors"
            onClick={handleDetailClick}
          >
            <Info size={13} />
          </button>

          {/* 底部信息 */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h3 className="text-[11px] sm:text-xs font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
              {displayName}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-[9px] text-white/70">
              {air_date && (
                <span className="flex items-center gap-0.5 bg-white/10 rounded px-1 py-0.5">
                  <Calendar size={8} />
                  {air_date.slice(0, 4)}
                </span>
              )}
              {eps && (
                <span className="flex items-center gap-0.5 bg-white/10 rounded px-1 py-0.5">
                  <Play size={8} className="fill-current" />
                  {eps}话
                </span>
              )}
              {rank && rank <= 500 && (
                <span className="flex items-center gap-0.5 bg-amber-500/20 text-amber-300 rounded px-1 py-0.5">
                  <Trophy size={8} className="fill-current" />
                  #{rank}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

// 详情模态框
function DetailModal({ info, onClose }: { info: BangumiInfo | null; onClose: () => void }) {
  if (typeof window === 'undefined') return null

  const handleBangumiClick = () => {
    if (info?.url) {
      playTap()
      window.open(info.url, '_blank', 'noopener,noreferrer')
    }
  }

  const getScoreBadge = (s: number) => {
    if (s >= 8.5) return { bg: 'bg-gradient-to-r from-amber-400 to-orange-500', text: '神作' }
    if (s >= 8) return { bg: 'bg-gradient-to-r from-emerald-400 to-teal-500', text: '力荐' }
    if (s >= 7) return { bg: 'bg-gradient-to-r from-blue-400 to-indigo-500', text: '推荐' }
    if (s >= 6) return { bg: 'bg-gradient-to-r from-slate-400 to-slate-500', text: '还行' }
    return { bg: 'bg-gradient-to-r from-slate-500 to-slate-600', text: '' }
  }

  return createPortal(
    <AnimatePresence>
      {info && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* 背景遮罩 */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 模态框内容 */}
          <motion.div
            className="relative w-full max-w-md max-h-[85vh] overflow-hidden rounded-2xl glass border border-white/15 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部：封面和基本信息 */}
            <div className="relative">
              {/* 背景模糊图 */}
              {info.image && (
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-xl opacity-30"
                  style={{ backgroundImage: `url(${info.image})` }}
                />
              )}
              
              <div className="relative flex gap-4 p-4">
                {/* 封面 */}
                <div className="flex-shrink-0 w-24 sm:w-28 rounded-xl overflow-hidden shadow-lg">
                  {info.image ? (
                    <img src={info.image} alt={info.name_cn ?? info.name} className="w-full aspect-[2/3] object-cover" />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                      <Tv size={32} className="text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* 基本信息 */}
                <div className="flex-1 min-w-0 py-1">
                  <h2 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 leading-snug">
                    {info.name_cn ?? info.name}
                  </h2>
                  {info.name_cn && info.name !== info.name_cn && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{info.name}</p>
                  )}

                  {/* 评分 */}
                  {info.score && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className={cn(
                        "px-2 py-1 rounded-lg text-white text-sm font-bold flex items-center gap-1",
                        getScoreBadge(info.score).bg
                      )}>
                        <Star size={12} className="fill-current" />
                        {info.score.toFixed(1)}
                      </div>
                      {getScoreBadge(info.score).text && (
                        <span className="text-xs text-muted-foreground">{getScoreBadge(info.score).text}</span>
                      )}
                      {info.rank && info.rank <= 500 && (
                        <span className="text-xs text-amber-400 flex items-center gap-0.5">
                          <Trophy size={10} className="fill-current" />
                          #{info.rank}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 标签 */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[10px]">
                    {info.air_date && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        <Calendar size={9} />
                        {info.air_date}
                      </span>
                    )}
                    {info.eps && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        <Play size={9} className="fill-current" />
                        {info.eps}话
                      </span>
                    )}
                  </div>
                </div>

                {/* 关闭按钮 */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 size-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="px-4 pb-4 max-h-[40vh] overflow-y-auto">
              {/* 简介 */}
              {info.summary && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">简介</h3>
                  <p className="text-sm text-foreground/90 leading-relaxed">{info.summary}</p>
                </div>
              )}

              {/* 收藏统计 */}
              {info.collection && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">收藏统计</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <StatCard icon={Heart} value={info.collection.wish} label="想看" color="text-pink-400" />
                    <StatCard icon={Bookmark} value={info.collection.collect} label="看过" color="text-emerald-400" />
                    <StatCard icon={Eye} value={info.collection.doing} label="在看" color="text-blue-400" />
                  </div>
                </div>
              )}

              {/* 跳转 Bangumi 按钮 */}
              <button
                onClick={handleBangumiClick}
                className="w-full py-3 rounded-xl bg-primary/90 hover:bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink size={16} />
                在 Bangumi 查看
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// 统计卡片
function StatCard({ icon: Icon, value, label, color }: { icon: typeof Heart; value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
      <div className={cn("flex items-center gap-1", color)}>
        <Icon size={12} className="fill-current" />
        <span className="text-sm font-semibold tabular-nums">{formatNumber(value)}</span>
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}
