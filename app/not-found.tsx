'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-sm text-muted-foreground">正在跳转...</p>
      </div>
    </div>
  )
}
