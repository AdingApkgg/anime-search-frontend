import { useEffect } from 'react'
import { Background } from '@/components/Background'
import { TopToolbar } from '@/components/TopToolbar'
import { SearchHeader } from '@/components/SearchHeader'
import { BangumiCard } from '@/components/BangumiCard'
import { SearchResults } from '@/components/SearchResults'
import { FloatingButtons } from '@/components/FloatingButtons'
import { StatsCorner } from '@/components/StatsCorner'
import { CommentsModal } from '@/components/CommentsModal'
import { SettingsModal } from '@/components/SettingsModal'
import { KeyboardHelpModal } from '@/components/KeyboardHelpModal'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useUIStore } from '@/store/ui'

function App() {
  const { initSettings } = useUIStore()

  // Initialize theme and sound settings
  useEffect(() => {
    initSettings()
  }, [initSettings])

  // Setup keyboard shortcuts
  useKeyboardShortcuts()

  return (
    <>
      <Background />

      <main className="flex flex-col min-h-screen">
        <TopToolbar />
        <SearchHeader />
        <BangumiCard />
        <SearchResults />
        <FloatingButtons />
        <StatsCorner />
      </main>

      {/* Modals */}
      <CommentsModal />
      <SettingsModal />
      <KeyboardHelpModal />
    </>
  )
}

export default App
