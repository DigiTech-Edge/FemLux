'use client'

import React, { useEffect } from 'react'
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
} from '@nextui-org/react'
import { X } from 'lucide-react'
import { ProductFilters } from '@/lib/types/products'
import { motion, AnimatePresence } from 'framer-motion'
import { CategoryWithCount } from '@/types/category'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: Partial<ProductFilters>
  onFilterChange: (filters: ProductFilters, clearAll?: boolean) => void
  categories: CategoryWithCount[]
  priceRange: { min: number; max: number }
}

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  categories,
  priceRange,
}: FilterDrawerProps) {
  const [localFilters, setLocalFilters] = React.useState<ProductFilters>(filters as ProductFilters)

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
    onFilterChange(emptyFilters, true)
    onClose()
  }

  useEffect(() => {
    setLocalFilters(filters as ProductFilters)
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
    <div className="flex items-center justify-between p-4 border-t">
      <Button
        variant="light"
        onPress={handleClearFilters}
        startContent={<X className="w-4 h-4" />}
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
                        <span className="text-sm text-gray-500 ml-1">
                          ({category.count})
                        </span>
                      </Checkbox>
                    ))}
                  </div>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem key="price" title="Price Range">
                  <div className="px-2">
                    <Slider
                      label="Price Range"
                      step={10}
                      minValue={priceRange.min}
                      maxValue={priceRange.max}
                      value={[
                        localFilters.priceRange?.min || priceRange.min,
                        localFilters.priceRange?.max || priceRange.max
                      ]}
                      formatOptions={{ style: 'currency', currency: 'USD' }}
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
                  </div>
                </AccordionItem>

                {/* Status */}
                <AccordionItem
                  key="status"
                  aria-label="Status"
                  title="Status"
                  classNames={{
                    content: "px-2",
                  }}
                >
                  <RadioGroup
                    value={localFilters.isNew?.toString() || "false"}
                    onValueChange={(value) =>
                      handleFilterChange("isNew", value === "true")
                    }
                  >
                    <Radio value="true">New Arrivals</Radio>
                    <Radio value="false">Regular Products</Radio>
                  </RadioGroup>
                </AccordionItem>
              </Accordion>
            </div>

            {footer}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
