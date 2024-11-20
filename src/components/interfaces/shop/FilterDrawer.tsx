'use client'

import React, { useEffect } from 'react'
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  RadioGroup,
  Radio,
  Slider,
} from '@nextui-org/react'
import { X } from 'lucide-react'
import { ProductFilters, FilterOption, Category } from '@/lib/types/products'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: ProductFilters
  onFilterChange: (filters: ProductFilters) => void
  categories: Category[]
  brands: FilterOption[]
  colors: FilterOption[]
  sizes: FilterOption[]
}

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  categories,
  brands,
  colors,
  sizes,
}: FilterDrawerProps) {
  const [localFilters, setLocalFilters] = React.useState<ProductFilters>(filters)

  const handleFilterChange = (key: keyof ProductFilters, value: ProductFilters[keyof ProductFilters]) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
    onClose()
  }

  const handleClearFilters = () => {
    const emptyFilters: ProductFilters = {}
    setLocalFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const header = (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">Filters</h2>
      <Button isIconOnly variant="light" onPress={onClose}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  )

  const footer = (
    <div className="flex items-center justify-between p-4">
      <Button
        variant="light"
        onPress={handleClearFilters}
      >
        Clear All
      </Button>
      <Button
        color="primary"
        onPress={handleApplyFilters}
      >
        Apply Filters
      </Button>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-[calc(100vh-4rem)] sm:h-screen w-full max-w-sm bg-background z-50 shadow-xl flex flex-col"
          >
            {header}
            
            <div className="flex-1 overflow-y-auto p-4">
              <Accordion>
                {/* Categories */}
                <AccordionItem key="categories" title="Categories">
                  <div className="flex flex-wrap gap-4">
                    {categories.map(category => (
                      <Checkbox
                        key={category.id}
                        value={category.name}
                        isSelected={localFilters.categories?.includes(category.name)}
                        onValueChange={(isSelected) => {
                          const currentCategories = localFilters.categories || []
                          handleFilterChange(
                            'categories',
                            isSelected
                              ? [...currentCategories, category.name]
                              : currentCategories.filter(c => c !== category.name)
                          )
                        }}
                      >
                        {category.name}
                      </Checkbox>
                    ))}
                  </div>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem key="price" title="Price Range">
                  <Slider
                    label="Price Range"
                    step={50}
                    minValue={0}
                    maxValue={1000}
                    value={[
                      localFilters.priceRange?.min || 0,
                      localFilters.priceRange?.max || 1000
                    ]}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        handleFilterChange('priceRange', {
                          min: value[0],
                          max: value[1]
                        })
                      }
                    }}
                    className="max-w-md"
                  />
                </AccordionItem>

                {/* Colors */}
                <AccordionItem key="colors" title="Colors">
                  <div className="flex flex-wrap gap-4">
                    {colors.map(color => (
                      <Checkbox
                        key={color.value}
                        value={color.value}
                        isSelected={localFilters.colors?.includes(color.value)}
                        onValueChange={(isSelected) => {
                          const currentColors = localFilters.colors || []
                          handleFilterChange(
                            'colors',
                            isSelected
                              ? [...currentColors, color.value]
                              : currentColors.filter(c => c !== color.value)
                          )
                        }}
                      >
                        {color.label}
                      </Checkbox>
                    ))}
                  </div>
                </AccordionItem>

                {/* Sizes */}
                <AccordionItem key="sizes" title="Sizes">
                  <div className="flex flex-wrap gap-4">
                    {sizes.map(size => (
                      <Checkbox
                        key={size.value}
                        value={size.value}
                        isSelected={localFilters.sizes?.includes(size.value)}
                        onValueChange={(isSelected) => {
                          const currentSizes = localFilters.sizes || []
                          handleFilterChange(
                            'sizes',
                            isSelected
                              ? [...currentSizes, size.value]
                              : currentSizes.filter(s => s !== size.value)
                          )
                        }}
                      >
                        {size.label}
                      </Checkbox>
                    ))}
                  </div>
                </AccordionItem>

                {/* Brands */}
                <AccordionItem key="brands" title="Brands">
                  <div className="flex flex-wrap gap-4">
                    {brands.map(brand => (
                      <Checkbox
                        key={brand.value}
                        value={brand.value}
                        isSelected={localFilters.brands?.includes(brand.value)}
                        onValueChange={(isSelected) => {
                          const currentBrands = localFilters.brands || []
                          handleFilterChange(
                            'brands',
                            isSelected
                              ? [...currentBrands, brand.value]
                              : currentBrands.filter(b => b !== brand.value)
                          )
                        }}
                      >
                        {brand.label}
                      </Checkbox>
                    ))}
                  </div>
                </AccordionItem>

                {/* Sort */}
                <AccordionItem key="sort" title="Sort By">
                  <RadioGroup
                    value={localFilters.sort}
                    onValueChange={(value) => handleFilterChange('sort', value)}
                  >
                    <Radio value="newest">Newest First</Radio>
                    <Radio value="price_asc">Price: Low to High</Radio>
                    <Radio value="price_desc">Price: High to Low</Radio>
                    <Radio value="rating">Best Rating</Radio>
                  </RadioGroup>
                </AccordionItem>

                {/* Stock */}
                <AccordionItem key="stock" title="Availability">
                  <Checkbox
                    isSelected={localFilters.inStock}
                    onValueChange={(isSelected) => handleFilterChange('inStock', isSelected)}
                  >
                    In Stock Only
                  </Checkbox>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="sticky bottom-0 mt-auto border-t bg-background">
              {footer}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
