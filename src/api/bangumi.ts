// Bangumi API 类型

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

// 搜索结果响应类型
interface SearchResponse {
  list?: (FlatBangumiInfo | BangumiSubject)[]
}

const BANGUMI_API_BASE =
  import.meta.env.VITE_BANGUMI_API_URL ?? 'https://anime-search.saop.cc/bangumi'

/**
 * 搜索动漫
 */
export async function searchBangumi(keyword: string): Promise<BangumiSubject[]> {
  const response = await fetch(`${BANGUMI_API_BASE}/search/${encodeURIComponent(keyword)}`)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status.toString()}`)
  }

  const data = (await response.json()) as SearchResponse | BangumiSubject[]
  if (Array.isArray(data)) {
    return data
  }
  return data.list as BangumiSubject[] | undefined ?? []
}

/**
 * 获取条目详情
 */
export async function getBangumiSubject(id: number): Promise<BangumiSubject> {
  const response = await fetch(`${BANGUMI_API_BASE}/subject/${id.toString()}`)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status.toString()}`)
  }

  return response.json() as Promise<BangumiSubject>
}

/**
 * 获取每日放送
 */
export async function getBangumiCalendar(): Promise<CalendarItem[]> {
  const response = await fetch(`${BANGUMI_API_BASE}/calendar`)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status.toString()}`)
  }

  return response.json() as Promise<CalendarItem[]>
}

/**
 * 后端返回的扁平化格式
 */
interface FlatBangumiInfo {
  id?: number
  name: string
  name_cn?: string
  image?: string // 后端已扁平化
  score?: number // 后端已扁平化
  rank?: number
  air_date?: string
  summary?: string
  url?: string
  eps?: number
  tags?: string[]
  collection?: {
    wish: number
    collect: number
    doing: number
  }
}

/**
 * 将后端返回的数据转换为 BangumiInfo
 * 支持扁平化格式（后端代理）和嵌套格式（原始 API）
 */
function toBangumiInfo(data: FlatBangumiInfo | BangumiSubject): BangumiInfo {
  // 检测是否为扁平化格式（后端返回）还是嵌套格式（原始 API）
  const isFlat = 'image' in data && typeof data.image === 'string'

  if (isFlat) {
    // 后端已扁平化的格式
    const flat = data
    return {
      id: flat.id ?? 0,
      name: flat.name,
      name_cn: flat.name_cn,
      image: flat.image,
      score: flat.score,
      rank: flat.rank,
      air_date: flat.air_date,
      summary: flat.summary,
      url: flat.url ?? (flat.id ? `https://bgm.tv/subject/${flat.id.toString()}` : undefined),
      eps: flat.eps,
      tags: flat.tags,
      collection: flat.collection
    }
  }

  // 原始 Bangumi API 的嵌套格式
  const subject = data as BangumiSubject
  return {
    id: subject.id,
    name: subject.name,
    name_cn: subject.name_cn,
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
 * 后端 /bangumi/search 已返回扁平化的完整数据
 * @param limit 返回结果数量，默认 3
 */
export async function fetchBangumiInfoList(keyword: string, limit = 3): Promise<BangumiInfo[]> {
  try {
    const response = await fetch(`${BANGUMI_API_BASE}/search/${encodeURIComponent(keyword)}`)
    if (!response.ok) return []

    const data = (await response.json()) as SearchResponse | (FlatBangumiInfo | BangumiSubject)[]
    // 支持 { list: [...] } 或直接数组格式
    const results: (FlatBangumiInfo | BangumiSubject)[] = Array.isArray(data)
      ? data
      : (data.list ?? [])

    return results.slice(0, limit).map(toBangumiInfo)
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
