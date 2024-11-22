'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/helpers/utils'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  placement?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  title?: string
}

const sizes = {
  sm: 'w-[280px]',
  md: 'w-[380px]',
  lg: 'w-[440px]',
}

export default function Drawer({
  isOpen,
  onClose,
  children,
  placement = 'left',
  size = 'sm',
  header,
  footer,
  className,
  title,
}: DrawerProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: placement === 'left' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: placement === 'left' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className={cn(
              'fixed inset-y-0 w-full xs:w-[80vw] sm:w-[385px] bg-background flex flex-col z-[61]',
              placement === 'left' ? 'left-0' : 'right-0',
              className
            )}
          >
            {/* Header */}
            {header ? (
              <div className="p-4 border-b">
                {header}
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border-b">
                <div className="font-medium">{title}</div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-4 border-t bg-background">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
