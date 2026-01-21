'use client'

import { useEffect, useRef } from 'react'
import Artalk from 'artalk'
import 'artalk/dist/Artalk.css'
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
            pageKey: 'https://as.saop.cc',
            pageTitle: '动漫聚搜',
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
      className="max-w-2xl max-h-[85vh] flex flex-col max-sm:max-h-[90vh]"
    >
      <ModalHeader onClose={handleClose}>
        💬 评论区
      </ModalHeader>
      <ModalContent className="flex-1 overflow-y-auto">
        <div ref={containerRef} id="artalk-comments" />
      </ModalContent>
    </Modal>
  )
}
