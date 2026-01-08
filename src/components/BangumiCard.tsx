import { motion } from 'framer-motion'
import { ExternalLink, Star, Hash, Calendar, Play, Heart, Eye, Bookmark } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { useSearchStore } from '@/store/search'
import type { BangumiInfo } from '@/api/bangumi'

export function BangumiCard() {
  const { bangumiList } = useSearchStore()

  if (bangumiList.length === 0) return null

  return (
    <div className="w-full mb-4 sm:mb-6">
      {/* 标题 */}
      <div className="flex items-center gap-2 px-3 sm:px-4 mb-3">
        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />
        <span className="text-sm font-semibold text-white/80">Bangumi 匹配</span>
        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
          {bangumiList.length}
        </span>
      </div>

      {/* 卡片滚动容器 */}
      <div className="flex gap-3 px-3 sm:px-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-orange-500/30 hover:scrollbar-thumb-orange-500/50">
        {bangumiList.map((info, index) => (
          <BangumiCardItem key={info.id ?? index} info={info} index={index} />
        ))}
      </div>
    </div>
  )
}

function BangumiCardItem({ info, index }: { info: BangumiInfo; index: number }) {
  const {
    name,
    name_cn,
    image,
    score,
    rank,
    air_date,
    summary,
    url,
    eps,
    collection
  } = info

  const displayName = name_cn ?? name

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex-shrink-0 w-[200px] sm:w-[220px] rounded-2xl overflow-hidden snap-start cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
    >
      {/* 封面背景 */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {image ? (
        <img
          src={image}
            alt={displayName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="12">No Image</text></svg>'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <Play size={32} className="text-slate-600" />
          </div>
        )}

        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* 评分徽章 */}
          {score && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">{score.toFixed(1)}</span>
          </div>
          )}

        {/* 排名徽章 */}
          {rank && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/80 backdrop-blur-sm">
            <Hash size={10} className="text-white" />
            <span className="text-xs font-bold text-white">{rank}</span>
          </div>
        )}

        {/* 外部链接指示 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink size={20} className="text-white" />
        </div>

        {/* 底部信息区 */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          {/* 标题 */}
          <h3 className="text-sm font-bold text-white line-clamp-2 mb-1.5 group-hover:text-orange-300 transition-colors">
            {displayName}
          </h3>

          {/* 元信息行 */}
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            {air_date && (
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {air_date.slice(0, 4)}
            </span>
          )}
          {eps && (
              <span className="flex items-center gap-1">
              <Play size={10} />
                {eps}话
            </span>
          )}
        </div>

          {/* 收藏统计 */}
        {collection && (
            <div className="flex items-center gap-2 mt-1.5 text-[10px]">
              <span className="flex items-center gap-0.5 text-pink-400">
                <Heart size={9} className="fill-pink-400" />
                {formatNumber(collection.wish)}
            </span>
              <span className="flex items-center gap-0.5 text-emerald-400">
                <Bookmark size={9} className="fill-emerald-400" />
                {formatNumber(collection.collect)}
            </span>
              <span className="flex items-center gap-0.5 text-blue-400">
                <Eye size={9} />
                {formatNumber(collection.doing)}
              </span>
          </div>
        )}
        </div>
      </div>

      {/* 简介 tooltip (仅桌面端) */}
        {summary && (
        <div className="hidden sm:block absolute inset-x-0 bottom-0 p-3 bg-black/95 backdrop-blur-xl translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <p className="text-[11px] text-white/80 line-clamp-4 leading-relaxed">
            {summary}
          </p>
          {name_cn && name_cn !== name && (
            <p className="mt-2 text-[10px] text-white/50 truncate">
              {name}
            </p>
        )}
      </div>
      )}
    </motion.a>
  )
}

