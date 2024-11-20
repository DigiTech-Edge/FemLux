'use client'

import React from 'react'
import { Chip } from '@nextui-org/react'
import { ProductFilters } from '@/lib/types/products'

interface ActiveFiltersProps {
  filters: ProductFilters
  onRemoveFilter: (key: keyof ProductFilters, value?: string) => void
}

export default function ActiveFilters({ filters, onRemoveFilter }: ActiveFiltersProps) {
  const renderFilterChips = () => {
    const chips: JSX.Element[] = []

    // Categories
    filters.categories?.forEach(category => {
      chips.push(
        <Chip
          key={`category-${category}`}
          onClose={() => onRemoveFilter('categories', category)}
          variant="flat"
          color="primary"
          classNames={{
            base: "h-8",
            content: "px-2"
          }}
        >
          Category: {category}
        </Chip>
      )
    })

    // Price Range
    if (filters.priceRange) {
      chips.push(
        <Chip
          key="price-range"
          onClose={() => onRemoveFilter('priceRange')}
          variant="flat"
          color="primary"
          classNames={{
            base: "h-8",
            content: "px-2"
          }}
        >
          Price: ${filters.priceRange.min} - ${filters.priceRange.max}
        </Chip>
      )
    }

    // Colors
    filters.colors?.forEach(color => {
      chips.push(
        <Chip
          key={`color-${color}`}
          onClose={() => onRemoveFilter('colors', color)}
          variant="flat"
          color="primary"
          classNames={{
            base: "h-8",
            content: "px-2"
          }}
        >
          Color: {color}
        </Chip>
      )
    })

    // Sizes
    filters.sizes?.forEach(size => {
      chips.push(
        <Chip
          key={`size-${size}`}
          onClose={() => onRemoveFilter('sizes', size)}
          variant="flat"
          color="primary"
          classNames={{
            base: "h-8",
            content: "px-2"
          }}
        >
          Size: {size}
        </Chip>
      )
    })

    // Brands
    filters.brands?.forEach(brand => {
      chips.push(
        <Chip
          key={`brand-${brand}`}
          onClose={() => onRemoveFilter('brands', brand)}
          variant="flat"
          color="primary"
          classNames={{
            base: "h-8",
            content: "px-2"
          }}
        >
          Brand: {brand}
        </Chip>
      )
    })

    // Sort
    if (filters.sort) {
      const sortLabels = {
        newest: 'Newest First',
        price_asc: 'Price: Low to High',
        price_desc: 'Price: High to Low',
        rating: 'Best Rating'
      }
      chips.push(
        <Chip
          key="sort"
          onClose={() => onRemoveFilter('sort')}
          variant="flat"
          color="primary"
          classNames={{
            base: "h-8",
            content: "px-2"
          }}
        >
          Sort: {sortLabels[filters.sort]}
        </Chip>
      )
    }

    // In Stock
    if (filters.inStock) {
      chips.push(
        <Chip
          key="in-stock"
          onClose={() => onRemoveFilter('inStock')}
          variant="flat"
          color="primary"
          classNames={{
            base: "h-8",
            content: "px-2"
          }}
        >
          In Stock Only
        </Chip>
      )
    }

    return chips
  }

  if (Object.keys(filters).length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {renderFilterChips()}
    </div>
  )
}
