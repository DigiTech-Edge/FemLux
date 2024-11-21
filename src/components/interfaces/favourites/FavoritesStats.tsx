'use client'

import React from 'react'
import { Card, CardBody, Divider } from '@nextui-org/react'
import { Clock, DollarSign, Heart, ShoppingBag } from 'lucide-react'
import { FavoritesStats as FavoritesStatsType } from '@/lib/types/favorites'
import { motion } from 'framer-motion'

interface FavoritesStatsProps {
  stats: FavoritesStatsType
}

export default function FavoritesStats({ stats }: FavoritesStatsProps) {
  const statItems = [
    {
      icon: <Heart className="w-5 h-5 text-primary" />,
      label: "Total Items",
      value: stats.totalItems
    },
    {
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      label: "Recently Added",
      value: stats.recentlyAdded
    },
    {
      icon: <ShoppingBag className="w-5 h-5 text-purple-500" />,
      label: "Top Category",
      value: stats.mostViewedCategory
    },
    {
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
      label: "Price Range",
      value: `$${stats.priceRange.min.toFixed(2)} - $${stats.priceRange.max.toFixed(2)}`
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full">
        <CardBody>
          <h2 className="text-xl font-semibold mb-4">Wishlist Summary</h2>
          <div className="space-y-4">
            {statItems.map((item, index) => (
              <React.Fragment key={item.label}>
                {index > 0 && <Divider className="my-4" />}
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}
