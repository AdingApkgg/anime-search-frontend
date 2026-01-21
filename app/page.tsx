'use client'

import { useEffect } from 'react'
import { Background } from '@/components/Background'
import { SearchHeader } from '@/components/SearchHeader'
import { BangumiCard } from '@/components/BangumiCard'
import { SearchResults } from '@/components/SearchResults'
import { FloatingButtons } from '@/components/FloatingButtons'
import { CommentsModal } from '@/components/CommentsModal'
import { SettingsModal } from '@/components/SettingsModal'
import { useUIStore } from '@/stores/ui'

export default function HomePage() {
  const { initSettings } = useUIStore()

  useEffect(() => {
    initSettings()
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [initSettings])

  return (
    <>
      <Background />
      <main className="flex flex-col min-h-screen">
        <SearchHeader />
        <BangumiCard />
        <SearchResults />
        <FloatingButtons />
      </main>
      <CommentsModal />
      <SettingsModal />
    </>
  )
}
