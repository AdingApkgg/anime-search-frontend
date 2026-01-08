import { motion } from 'framer-motion'
import { ExternalLink, Star, Users, Play, Heart, Eye, Bookmark } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { useSearchStore } from '@/store/search'
import type { BangumiInfo } from '@/api/bangumi'

export function BangumiCard() {
  const { bangumiList } = useSearchStore()

  if (bangumiList.length === 0) return null

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 mb-3 sm:mb-4">
      <div className="flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-orange-500/30">
        {bangumiList.map((info, index) => (
          <BangumiCardItem key={info.id || index} info={info} index={index} />
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
    total,
    air_date,
    summary,
    url,
    eps,
    tags,
    collection
  } = info

  return (
    <motion.div
      className="flex gap-3.5 p-3.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-orange-500/10 shadow-lg snap-start flex-shrink-0 min-w-[280px] max-w-[360px] md:min-w-[320px] md:max-w-[400px]"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {/* Cover */}
      {image && (
        <img
          src={image}
          alt={name_cn ?? name}
          className="flex-shrink-0 w-[90px] h-[128px] rounded-lg object-cover bg-slate-100 dark:bg-slate-900/50 shadow-lg"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      )}

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="text-lg font-bold text-slate-900 dark:text-white truncate">{name_cn ?? name}</div>
        {name_cn && <div className="text-xs text-slate-500 dark:text-white/50 truncate">{name}</div>}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs">
          {score && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-400/15 text-yellow-400 font-semibold">
              <Star size={11} />
              {score.toFixed(1)}
            </span>
          )}
          {rank && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 font-semibold">
              #{rank}
            </span>
          )}
          {eps && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-semibold">
              <Play size={10} />
              {eps} 话
            </span>
          )}
          {air_date && <span className="text-slate-500 dark:text-white/50">{air_date}</span>}
          {total && (
            <span className="text-slate-400 dark:text-white/40 text-[11px]">
              <Users size={10} className="inline mr-1" />
              {formatNumber(total)} 人评
            </span>
          )}
        </div>

        {/* Collection Stats */}
        {collection && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="flex items-center gap-1 text-pink-400">
              <Heart size={10} />
              想看 {formatNumber(collection.wish)}
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Bookmark size={10} />
              看过 {formatNumber(collection.collect)}
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <Eye size={10} />
              在看 {formatNumber(collection.doing)}
            </span>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="text-xs text-slate-500 dark:text-white/50 line-clamp-2 mt-1">{summary}</div>
        )}

        {/* Link */}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-auto pt-2 text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors"
          >
            Bangumi
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.div>
  )
}
