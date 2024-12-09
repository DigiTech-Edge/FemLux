import React from "react";
import HeroBanner from "@/components/interfaces/home/HeroBanner";
import {
  ProductCarousel,
  CategoryCarousel,
} from "@/components/interfaces/home/CarouselWrapper";
import SectionHeader from "@/components/interfaces/home/SectionHeader";
import { getCategories } from "@/services/actions/category.actions";
import {
  getFilteredProducts,
  getNewArrivals,
} from "@/services/actions/product.actions";
import { fetchBanners } from "@/services/actions/banner.actions";

export default async function Home() {
  // Fetch active banners
  const banners = await fetchBanners(true);

  // Fetch categories and filter featured ones
  const categories = await getCategories();

  // Fetch featured products (we'll use the first 8)
  const featuredProducts = await getFilteredProducts();
  const featuredProductsSlice = featuredProducts.slice(0, 8);

  // Fetch new arrivals
  const newArrivals = await getNewArrivals(8);

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Banner */}
      <section className="mt-4">
        <HeroBanner banners={banners} />
      </section>

      {/* Categories */}
      <section className="mx-auto mt-16">
        <SectionHeader
          title="Categories"
          description="Browse through our categories"
        />
        <CategoryCarousel categories={categories} />
      </section>

      {/* Featured Products */}
      <section className="mx-auto mt-16">
        <SectionHeader
          title="Featured Products"
          description="Browse through our featured products"
          viewAllLink="/shop"
        />
        <ProductCarousel products={featuredProductsSlice} />
      </section>

      {/* New Arrivals */}
      <section className="mx-auto mt-16">
        <SectionHeader
          title="New Arrivals"
          description="Check out our latest products"
          viewAllLink="/shop"
        />
        <ProductCarousel products={newArrivals} />
      </section>
    </main>
  );
}
