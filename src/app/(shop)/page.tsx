import React from 'react'
import HeroBanner from '@/components/interfaces/home/HeroBanner'
import { ProductCarousel, CategoryCarousel } from '@/components/interfaces/home/CarouselWrapper'
import SectionHeader from '@/components/interfaces/home/SectionHeader'
import { products, categories } from '@/lib/data/products'

export default function Home() {
  const featuredProducts = products.slice(0, 8)
  const newArrivals = products.filter((product) => product.isNew).slice(0, 8)
  const featuredCategories = categories.filter(cat => cat.featured)

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Banner */}
      <section className='mt-4'>
        <HeroBanner />
      </section>

      {/* Featured Categories */}
      <section className=" mx-auto mt-16">
        <SectionHeader 
          title="Featured Categories"
          description="Browse through our featured categories"
        />
        <CategoryCarousel categories={featuredCategories} />
      </section>

      {/* Featured Products */}
      <section className="mx-auto mt-16">
        <SectionHeader 
          title="Featured Products"
          description="Browse through our featured products"
          viewAllLink="/products"
        />
        <ProductCarousel products={featuredProducts} />
      </section>

      {/* New Arrivals */}
      <section className="mx-auto mt-16">
        <SectionHeader 
          title="New Arrivals"
          description="Check out our latest products"
          viewAllLink="/products?filter=new"
        />
        <ProductCarousel products={newArrivals} />
      </section>
    </main>
  )
}
