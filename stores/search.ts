import { create } from 'zustand'
import { fetchRules, searchAnime, type Platform, type Rule } from '@/api/search'
import { fetchBangumiInfoList, type BangumiInfo } from '@/api/bangumi'

interface SearchState {
  // 搜索状态
  query: string
  isSearching: boolean
  progress: { current: number; total: number }
  platforms: Platform[]
  error: string

  // 规则
  rules: Rule[]
  selectedRules: Set<string>
  rulesLoading: boolean
  rulesError: string

  // Bangumi 信息
  bangumiList: BangumiInfo[]

  // 搜索控制器
  abortController: AbortController | null

  // Actions
  setQuery: (query: string) => void
  toggleRule: (name: string) => void
  selectAllRules: () => void
  clearAllRules: () => void
  loadRules: () => Promise<void>
  search: () => Promise<void>
  cancelSearch: () => void
  reset: () => void
}

export const useSearchStore = create<SearchState>((set, get) => ({
  // 初始状态
  query: '',
  isSearching: false,
  progress: { current: 0, total: 0 },
  platforms: [],
  error: '',
  rules: [],
  selectedRules: new Set(),
  rulesLoading: true,
  rulesError: '',
  bangumiList: [],
  abortController: null,

  // Actions
  setQuery: (query) => { set({ query }) },

  toggleRule: (name) => {
    const { selectedRules } = get()
    const newSelected = new Set(selectedRules)
    if (newSelected.has(name)) {
      newSelected.delete(name)
    } else {
      newSelected.add(name)
    }
    set({ selectedRules: newSelected })
  },

  selectAllRules: () => {
    const { rules } = get()
    set({ selectedRules: new Set(rules.map((r) => r.name)) })
  },

  clearAllRules: () => {
    set({ selectedRules: new Set() })
  },

  loadRules: async () => {
    set({ rulesLoading: true, rulesError: '' })
    try {
      const rules = await fetchRules()
      set({
        rules,
        selectedRules: new Set(rules.map((r) => r.name)),
        rulesLoading: false
      })
    } catch (err) {
      console.error('加载规则失败:', err)
      set({
        rulesError: err instanceof Error ? err.message : '加载失败',
        rulesLoading: false
      })
    }
  },

  search: async () => {
    const { query, selectedRules, abortController: oldController } = get()

    if (!query.trim()) return

    // 取消之前的搜索
    if (oldController) {
      oldController.abort()
    }

    const newController = new AbortController()

    // 重置状态
    set({
      platforms: [],
      isSearching: true,
      error: '',
      progress: { current: 0, total: 0 },
      bangumiList: [],
      abortController: newController
    })

    // 15 秒超时：自动断开搜索
    const timeoutId = setTimeout(() => {
      const { isSearching } = get()
      if (isSearching) {
        console.log('搜索超时 (15s)，自动断开')
        newController.abort()
        set({ isSearching: false })
      }
    }, 15000)

    // 标记是否已请求 Bangumi
    let bangumiRequested = false

    const rulesArray = Array.from(selectedRules)
    if (rulesArray.length === 0) {
      clearTimeout(timeoutId)
      set({ error: '请至少选择一个搜索源', isSearching: false })
      return
    }

    try {
      await searchAnime(query, rulesArray, {}, {
        signal: newController.signal,
        onTotal: (total) => {
          set({ progress: { current: 0, total } })
        },
        onProgress: (current, total) => {
          set({ progress: { current, total } })
        },
        onPlatformResult: (platform) => {
          const { platforms } = get()
          set({ platforms: [...platforms, platform] })
          
          // 第一个结果到来时请求 Bangumi 信息
          if (!bangumiRequested) {
            bangumiRequested = true
            void fetchBangumiInfoList(query, 20).then((list) => {
              set({ bangumiList: list })
            })
          }
        },
        onComplete: () => {
          clearTimeout(timeoutId)
          set({ isSearching: false })
        },
        onError: (error) => {
          clearTimeout(timeoutId)
          set({ error, isSearching: false })
        }
      })
    } catch (err) {
      clearTimeout(timeoutId)
      if ((err as Error).name !== 'AbortError') {
        set({
          error: err instanceof Error ? err.message : '搜索失败',
          isSearching: false
        })
      } else {
        // AbortError 时也确保状态正确
        set({ isSearching: false })
      }
    }
  },

  cancelSearch: () => {
    const { abortController } = get()
    if (abortController) {
      abortController.abort()
    }
    set({ isSearching: false, abortController: null })
  },

  reset: () => {
    const { abortController } = get()
    if (abortController) {
      abortController.abort()
    }
    set({
      query: '',
      platforms: [],
      error: '',
      progress: { current: 0, total: 0 },
      bangumiList: [],
      isSearching: false,
      abortController: null
    })
  }
}))
