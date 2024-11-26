'use client'

import React from 'react'
import { Chip } from '@nextui-org/react'
import { ProductFilters } from '@/lib/types/products'

interface ActiveFiltersProps {
  filters: ProductFilters
  onRemove: (key: keyof ProductFilters, value?: string) => void
}

export default function ActiveFilters({ filters, onRemove }: ActiveFiltersProps) {
  if (!Object.keys(filters).length) return null

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex flex-wrap gap-2">
        {filters.categories?.map(category => (
          <Chip
            key={`category-${category}`}
            onClose={() => onRemove('categories', category)}
            variant="flat"
            color="primary"
            classNames={{
              base: "h-8",
              content: "px-2"
            }}
          >
            Category: {category}
          </Chip>
        ))}

        {filters.priceRange && (
          <Chip
            key="price-range"
            onClose={() => onRemove('priceRange')}
            variant="flat"
            color="primary"
            classNames={{
              base: "h-8",
              content: "px-2"
            }}
          >
            Price: ${filters.priceRange.min} - ${filters.priceRange.max}
          </Chip>
        )}

        {filters.search && (
          <Chip
            key="search"
            onClose={() => onRemove('search')}
            variant="flat"
            color="primary"
            classNames={{
              base: "h-8",
              content: "px-2"
            }}
          >
            Search: {filters.search}
          </Chip>
        )}
      </div>
    </div>
  )
}
