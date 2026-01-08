import { useEffect } from 'react'
import { Background } from '@/components/Background'
import { SearchHeader } from '@/components/SearchHeader'
import { BangumiCard } from '@/components/BangumiCard'
import { SearchResults } from '@/components/SearchResults'
import { FloatingButtons } from '@/components/FloatingButtons'
import { CommentsModal } from '@/components/CommentsModal'
import { SettingsModal } from '@/components/SettingsModal'
import { useUIStore } from '@/store/ui'

function App() {
  const { initSettings } = useUIStore()

  // Initialize theme and sound settings
  useEffect(() => {
    initSettings()
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

      {/* Modals */}
      <CommentsModal />
      <SettingsModal />
    </>
  )
}

export default App
