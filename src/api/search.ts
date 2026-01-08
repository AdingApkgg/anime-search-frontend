// API 配置 - 动态获取
import { getApiBaseUrl } from '@/store/ui'

// 类型定义
export interface Episode {
  name: string
  url: string
}

export interface EpisodeRoad {
  name?: string
  episodes: Episode[]
}

export interface SearchResult {
  name: string
  url: string
  episodes?: EpisodeRoad[]
  tags?: string[]
}

export interface Platform {
  name: string
  color?: string
  url?: string
  tags?: string[]
  items: SearchResult[]
}

export interface SearchCallbacks {
  signal?: AbortSignal
  onTotal?: (total: number) => void
  onProgress?: (current: number, total: number) => void
  onPlatformResult?: (platform: Platform) => void
  onComplete?: () => void
  onError?: (error: string) => void
}

// 规则信息
export interface Rule {
  name: string
  color?: string
  tags?: string[]
}

// SSE 流数据类型
interface SSEData {
  total?: number
  progress?: { completed: number; total: number }
  result?: {
    name: string
    color?: string
    url?: string
    tags?: string[]
    items?: SearchResult[]
    error?: string
  }
  done?: boolean
  error?: string
}

// API 响应类型
interface ApiInfo {
  version: string
  rules_count: number
  endpoints: string[]
}

/**
 * 获取规则列表
 */
export async function fetchRules(): Promise<Rule[]> {
  const response = await fetch(`${getApiBaseUrl()}/rules`)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status.toString()}`)
  }

  return response.json() as Promise<Rule[]>
}

/**
 * 流式搜索动漫
 */
export async function searchAnime(
  query: string,
  rules: string[],
  _options: Record<string, unknown> = {},
  callbacks: SearchCallbacks = {}
): Promise<void> {
  const { signal, onTotal, onProgress, onPlatformResult, onComplete, onError } = callbacks

  if (rules.length === 0) {
    onError?.('请至少选择一个搜索源')
    return
  }

  const formData = new FormData()
  formData.append('anime', query)
  formData.append('rules', rules.join(','))

  try {
    const response = await fetch(`${getApiBaseUrl()}/api`, {
      method: 'POST',
      body: formData,
      signal
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status.toString()}: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('响应体为空')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    for (;;) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.trim()) continue

        try {
          const data = JSON.parse(line) as SSEData

          // 总数
          if (data.total !== undefined) {
            onTotal?.(data.total)
          }

          // 进度 + 平台结果
          if (data.progress && data.result) {
            onProgress?.(data.progress.completed, data.progress.total)

            // 有错误的站点只打印到控制台，不显示在 UI
            if (data.result.error) {
              console.warn(`[${data.result.name}] 请求异常:`, data.result.error)
              // 如果没有结果，跳过这个站点
              if (!data.result.items?.length) {
                continue
              }
            }

            const platform: Platform = {
              name: data.result.name,
              color: data.result.color,
              url: data.result.url,
              tags: data.result.tags ?? [],
              items: data.result.items ?? []
            }

            onPlatformResult?.(platform)
          }

          // 仅进度（无结果）
          if (data.progress && !data.result) {
            onProgress?.(data.progress.completed, data.progress.total)
          }

          // 完成
          if (data.done) {
            onComplete?.()
          }

          // 错误
          if (data.error) {
            onError?.(data.error)
          }
        } catch {
          // 忽略 JSON 解析错误（可能是不完整的行）
        }
      }
    }

    // 处理剩余的 buffer
    if (buffer.trim()) {
      try {
        const data = JSON.parse(buffer) as SSEData
        if (data.done) {
          onComplete?.()
        }
      } catch {
        // 忽略
      }
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw error
    }

    const message = error instanceof Error ? error.message : '搜索失败'
    onError?.(message)
    throw error
  }
}

/**
 * 获取 API 信息
 */
export async function fetchApiInfo(): Promise<ApiInfo> {
  const response = await fetch(`${getApiBaseUrl()}/info`)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status.toString()}`)
  }

  return response.json() as Promise<ApiInfo>
}
