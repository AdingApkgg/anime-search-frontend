'use client'

import { useEffect, useRef } from 'react'
import Artalk from 'artalk'
import 'artalk/dist/Artalk.css'
import { MessageCircle } from 'lucide-react'
import { playTransitionDown } from '@/lib/sound'
import { useUIStore } from '@/stores/ui'
import { Modal, ModalHeader, ModalContent } from '@/components/ui/modal'

export function CommentsModal() {
  const { showComments, closeComments } = useUIStore()
  const artalkRef = useRef<Artalk | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showComments) {
      const timer = setTimeout(() => {
        if (containerRef.current && !artalkRef.current) {
          const isDark = document.documentElement.classList.contains('dark')
          artalkRef.current = Artalk.init({
            el: containerRef.current,
            pageKey: 'https://as.saop.cc/',
            server: 'https://artalk.saop.cc',
            site: '动漫聚搜',
            darkMode: isDark
          })
        }
      }, 200)

      return () => clearTimeout(timer)
    }

    if (artalkRef.current) {
      artalkRef.current.destroy()
      artalkRef.current = null
    }
  }, [showComments])

  useEffect(() => {
    return () => {
      if (artalkRef.current) {
        artalkRef.current.destroy()
        artalkRef.current = null
      }
    }
  }, [])

  const handleClose = () => {
    playTransitionDown()
    closeComments()
  }

  return (
    <Modal
      open={showComments}
      onClose={handleClose}
      className="max-w-2xl max-h-[85vh] flex flex-col max-sm:max-h-full"
      fullscreenOnMobile
    >
      <ModalHeader onClose={handleClose}>
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-primary" />
          评论区
        </div>
      </ModalHeader>
      <ModalContent className="flex-1 overflow-y-auto">
        <div ref={containerRef} id="artalk-comments" />
      </ModalContent>
    </Modal>
  )
}
