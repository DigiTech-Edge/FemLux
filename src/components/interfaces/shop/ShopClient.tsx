'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input } from '@nextui-org/react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Product, Category, FilterOption, ProductFilters } from '@/lib/types/products'
import ActiveFilters from '@/components/interfaces/shop/ActiveFilters'
import FilterDrawer from '@/components/interfaces/shop/FilterDrawer'
import ProductCard from '@/components/ui/ProductCard'
import { useDebounce } from '@/hooks/useDebounce'

interface ShopClientProps {
  products: Product[]
  categories: Category[]
  brands: FilterOption[]
  colors: FilterOption[]
  sizes: FilterOption[]
  initialFilters: Partial<ProductFilters>
}

export default function ShopClient({
  products,
  categories,
  brands,
  colors,
  sizes,
  initialFilters,
}: ShopClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState(initialFilters.search || '')
  const debouncedSearch = useDebounce(searchTerm, 500)

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    router.push(`/shop?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  const handleFilterChange = (newFilters: ProductFilters) => {
    const params = new URLSearchParams()

    // Add each filter to the URL
    if (newFilters.categories?.length) {
      newFilters.categories.forEach(cat => params.append('categories', cat))
    }

    if (newFilters.colors?.length) {
      newFilters.colors.forEach(color => params.append('colors', color))
    }

    if (newFilters.sizes?.length) {
      newFilters.sizes.forEach(size => params.append('sizes', size))
    }

    if (newFilters.brands?.length) {
      newFilters.brands.forEach(brand => params.append('brands', brand))
    }

    if (newFilters.priceRange) {
      params.set(
        'priceRange',
        `${newFilters.priceRange.min}-${newFilters.priceRange.max}`
      )
    }

    if (newFilters.sort) {
      params.set('sort', newFilters.sort)
    }

    if (newFilters.inStock) {
      params.set('inStock', 'true')
    }

    router.push(`/shop?${params.toString()}`)
  }

  const handleRemoveFilter = (key: keyof ProductFilters, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      const values = params.get(key)?.split(',') || []
      const newValues = values.filter(v => v !== value)
      if (newValues.length > 0) {
        params.set(key, newValues.join(','))
      } else {
        params.delete(key)
      }
    } else {
      params.delete(key)
    }

    router.push(`/shop?${params.toString()}`)
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b rounded mt-4">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 justify-between">
            <div className="flex-1 max-w-md">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                className="w-full"
                isClearable
                onClear={() => setSearchTerm('')}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="bordered"
                startContent={<SlidersHorizontal className="w-4 h-4" />}
                onPress={() => setIsFilterDrawerOpen(true)}
              >
                <p className='max-sm:hidden'>Filters</p>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        filters={initialFilters}
        onRemoveFilter={handleRemoveFilter}
      />

      {/* Products Grid */}
      <div className="flex-1 px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>

      {/* No Results */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <Button
            color="primary"
            variant="flat"
            onPress={() => {setSearchTerm(''); 
              handleFilterChange({} as ProductFilters)}}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={initialFilters as ProductFilters}
        onFilterChange={handleFilterChange}
        categories={categories}
        brands={brands}
        colors={colors}
        sizes={sizes}
      />
    </main>
  )
}
