// Bangumi API 类型
import { getApiBaseUrl } from '@/store/ui'

// 用于显示的简化信息
export interface BangumiInfo {
  id: number
  name: string
  name_cn?: string
  image?: string
  score?: number
  rank?: number
  total?: number // 评分人数
  air_date?: string
  summary?: string
  url?: string
  eps?: number // 集数
  tags?: string[] // 标签
  collection?: {
    // 收藏统计
    wish: number
    collect: number
    doing: number
  }
}

export interface BangumiSubject {
  id: number
  name: string
  name_cn?: string
  summary?: string
  date?: string
  images?: {
    large?: string
    common?: string
    medium?: string
    small?: string
    grid?: string
  }
  rating?: {
    rank: number
    total: number
    count: Record<string, number>
    score: number
  }
  collection?: {
    wish: number
    collect: number
    doing: number
    on_hold: number
    dropped: number
  }
  tags?: {
    name: string
    count: number
  }[]
  eps?: number
  volumes?: number
  type?: number
}

export interface CalendarItem {
  weekday: {
    en: string
    cn: string
    ja: string
    id: number
  }
  items: BangumiSubject[]
}

// v0 搜索响应
interface V0SearchResponse {
  total: number
  limit: number
  offset: number
  data: BangumiSubject[]
}

// 动态获取 Bangumi API 代理 URL
// 使用 /bgm/* 通用代理，透传到 api.bgm.tv/*
function getBgmProxyBase(): string {
  return `${getApiBaseUrl()}/bgm`
}

/**
 * 使用 v0 API 搜索动漫
 * 通过 /bgm/v0/search/subjects 直接调用 Bangumi API
 */
export async function searchBangumi(keyword: string, limit = 20): Promise<BangumiSubject[]> {
  const response = await fetch(`${getBgmProxyBase()}/v0/search/subjects?limit=${limit.toString()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      keyword,
      filter: { type: [2] } // type 2 = 动画
    })
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status.toString()}`)
  }

  const data = (await response.json()) as V0SearchResponse
  return data.data
}

/**
 * 获取条目详情
 */
export async function getBangumiSubject(id: number): Promise<BangumiSubject> {
  const response = await fetch(`${getBgmProxyBase()}/v0/subjects/${id.toString()}`)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status.toString()}`)
  }

  return response.json() as Promise<BangumiSubject>
}

/**
 * 获取每日放送
 */
export async function getBangumiCalendar(): Promise<CalendarItem[]> {
  const response = await fetch(`${getBgmProxyBase()}/calendar`)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status.toString()}`)
  }

  return response.json() as Promise<CalendarItem[]>
}

/**
 * 将 Bangumi API 返回的 Subject 转换为简化的 BangumiInfo
 */
function toBangumiInfo(subject: BangumiSubject): BangumiInfo {
  return {
    id: subject.id,
    name: subject.name,
    name_cn: subject.name_cn,
    // 优先使用 large 尺寸图片
    image: subject.images?.large ?? subject.images?.common ?? subject.images?.medium,
    score: subject.rating?.score,
    rank: subject.rating?.rank,
    total: subject.rating?.total,
    air_date: subject.date,
    summary: subject.summary,
    url: `https://bgm.tv/subject/${subject.id.toString()}`,
    eps: subject.eps,
    tags: subject.tags?.slice(0, 6).map((t) => t.name),
    collection: subject.collection
      ? {
          wish: subject.collection.wish,
          collect: subject.collection.collect,
          doing: subject.collection.doing
        }
      : undefined
  }
}

/**
 * 搜索并获取多个结果的信息
 * 使用 v0 API 直接搜索，获取完整数据（包括 large 尺寸图片）
 * @param limit 返回结果数量，默认 12
 */
export async function fetchBangumiInfoList(keyword: string, limit = 12): Promise<BangumiInfo[]> {
  try {
    const subjects = await searchBangumi(keyword, limit)
    return subjects.map(toBangumiInfo)
  } catch {
    return []
  }
}

/**
 * 搜索并获取第一个结果的信息（向后兼容）
 */
export async function fetchBangumiInfo(keyword: string): Promise<BangumiInfo | null> {
  const list = await fetchBangumiInfoList(keyword, 1)
  return list[0] ?? null
}
