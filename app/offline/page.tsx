'use client'

import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="size-20 mx-auto rounded-full bg-muted flex items-center justify-center">
          <WifiOff size={40} className="text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">无法连接网络</h1>
          <p className="text-muted-foreground">
            请检查您的网络连接后重试
          </p>
        </div>

        <Button onClick={handleRetry} className="gap-2">
          <RefreshCw size={16} />
          重新加载
        </Button>
      </div>
    </div>
  )
}
