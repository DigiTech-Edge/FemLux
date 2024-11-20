'use client'

import React from 'react'
import Carousel from '@/components/ui/Carousel'
import ProductCard from '@/components/ui/ProductCard'
import CategoryCard from '@/components/interfaces/home/CategoryCard'
import { Product, Category } from '@/lib/types/products'

interface ProductCarouselProps {
  products: Product[]
}

interface CategoryCarouselProps {
  categories: Category[]
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  return (
    <Carousel className="px-4" showControls>
      {products.map((product, index) => (
        <div key={product.id} className="flex-[0_0_280px] md:flex-[0_0_320px] p-2">
          <ProductCard product={product} index={index} />
        </div>
      ))}
    </Carousel>
  )
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  return (
    <Carousel 
      autoplay 
      loop 
      autoplayDelay={6000}
      className="px-4"
      showControls
    >
      {categories.map((category, index) => (
        <div key={category.id} className="flex-[0_0_280px] md:flex-[0_0_320px] p-2">
          <CategoryCard category={category} index={index} />
        </div>
      ))}
    </Carousel>
  )
}
