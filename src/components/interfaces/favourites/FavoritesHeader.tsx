'use client'

import React from 'react'
import { Button } from '@nextui-org/react'
import { Heart, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface FavoritesHeaderProps {
  totalItems: number
}

export default function FavoritesHeader({ totalItems }: FavoritesHeaderProps) {
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
          >
            Clear All
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
