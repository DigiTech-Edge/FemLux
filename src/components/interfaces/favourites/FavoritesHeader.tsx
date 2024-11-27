'use client'

import React, { useState, useTransition } from 'react'
import { Button } from '@nextui-org/react'
import { Heart, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal'
import { clearAllFavorites } from '@/services/actions/favorite.actions'
import toast from 'react-hot-toast'

interface FavoritesHeaderProps {
  totalItems: number
}

export default function FavoritesHeader({ totalItems }: FavoritesHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleClearAll = () => {
    startTransition(async () => {
      try {
        await clearAllFavorites()
        setIsOpen(false)
        toast.success('All favorites cleared successfully')
      } catch (error) {
        toast.error('Failed to clear favorites')
        console.error('Clear favorites error:', error)
      }
    })
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            My Favorites
          </h1>
          <p className="text-gray-600 mt-1">
            {totalItems} items saved to your wishlist
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            color="danger"
            variant="flat"
            startContent={<Trash2 className="w-4 h-4" />}
            onClick={() => setIsOpen(true)}
            isDisabled={totalItems === 0}
          >
            Clear All
          </Button>
        </div>
      </motion.div>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleClearAll}
        title="Clear All Favorites"
        description="Are you sure you want to clear all your favorites? This action cannot be undone."
        loading={isPending}
      />
    </div>
  )
}
