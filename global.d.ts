/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// 确保 DOM 类型在所有环境中都可用
declare const window: Window & typeof globalThis
declare const document: Document
declare const localStorage: Storage
declare const sessionStorage: Storage
declare const navigator: Navigator
declare const location: Location

// MediaQueryList 相关类型
declare interface MediaQueryListEvent extends Event {
  readonly matches: boolean
  readonly media: string
}

declare interface MediaQueryList extends EventTarget {
  readonly matches: boolean
  readonly media: string
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => unknown) | null
  addListener(callback: ((this: MediaQueryList, ev: MediaQueryListEvent) => unknown) | null): void
  removeListener(callback: ((this: MediaQueryList, ev: MediaQueryListEvent) => unknown) | null): void
  addEventListener<K extends keyof MediaQueryListEventMap>(type: K, listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => unknown, options?: boolean | AddEventListenerOptions): void
  removeEventListener<K extends keyof MediaQueryListEventMap>(type: K, listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => unknown, options?: boolean | EventListenerOptions): void
}

declare interface MediaQueryListEventMap {
  "change": MediaQueryListEvent
}

declare interface Window {
  matchMedia(query: string): MediaQueryList
}
