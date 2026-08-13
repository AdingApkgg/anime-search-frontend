'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  /** 移动端全屏模式 */
  fullscreenOnMobile?: boolean
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const contentVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20
  }
}

const mobileContentVariants = {
  hidden: { 
    opacity: 0,
    y: '100%'
  },
  visible: { 
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: '100%'
  }
}

const fullscreenMobileVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    scale: 1
  },
  exit: {
    opacity: 0,
    scale: 0.95
  }
}

export function Modal({ open, onClose, children, className, fullscreenOnMobile = false }: ModalProps) {
  const [mounted, setMounted] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Content */}
          <div className={cn(
            'fixed inset-0 flex items-center justify-center pointer-events-none',
            fullscreenOnMobile ? 'max-sm:p-0 p-4 sm:p-6' : 'p-4 sm:p-6'
          )}>
            <motion.div
              className={cn(
                'relative w-full pointer-events-auto',
                'glass-bg-strong border border-border/50 shadow-2xl',
                fullscreenOnMobile
                  ? 'max-sm:fixed max-sm:inset-0 max-sm:rounded-none max-sm:border-0 rounded-2xl'
                  : 'rounded-2xl max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:rounded-b-none max-sm:rounded-t-3xl',
                className
              )}
              variants={isMobile ? (fullscreenOnMobile ? fullscreenMobileVariants : mobileContentVariants) : contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

interface ModalHeaderProps {
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

export function ModalHeader({ children, onClose, className }: ModalHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between p-4 sm:p-6 border-b', className)}>
      <div className="text-lg font-semibold">{children}</div>
      {onClose && (
        <motion.button
          className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={18} />
        </motion.button>
      )}
    </div>
  )
}

interface ModalContentProps {
  children: React.ReactNode
  className?: string
}

export function ModalContent({ children, className }: ModalContentProps) {
  return (
    <div className={cn('p-4 sm:p-6', className)}>
      {children}
    </div>
  )
}
