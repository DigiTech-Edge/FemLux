"use client";

import React from "react";
import Carousel from "@/components/ui/Carousel";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/interfaces/home/CategoryCard";
import type { ProductWithRelations } from "@/types/product";
import { CategoryWithCount } from "@/types/category";
import { Button } from "@nextui-org/react";
import { PackageSearch } from "lucide-react";
import Link from "next/link";

interface ProductCarouselProps {
  products: ProductWithRelations[];
}

interface CategoryCarouselProps {
  categories: CategoryWithCount[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <PackageSearch className="w-16 h-16 text-default-300 mb-4" />
        <h3 className="text-xl font-semibold text-default-600 mb-2">
          No Products Available
        </h3>
        <p className="text-default-500 text-center mb-6">
          We&apos;re working on adding new products. Check back soon!
        </p>
        <Button
          as={Link}
          href="/shop"
          color="primary"
          variant="flat"
          className="flex-shrink-0"
        >
          Browse All Products
        </Button>
      </div>
    );
  }

  return (
    <div className="group">
      <Carousel
        className="px-4"
        showControls
        loop={products.length > 4}
        variant="default"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex-[0_0_280px] md:flex-[0_0_320px] p-2"
          >
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="group">
      <Carousel
        className="px-4"
        showControls
        loop={categories.length > 4}
        autoplay
        autoplayDelay={6000}
        variant="default"
      >
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="flex-[0_0_280px] md:flex-[0_0_320px] p-2"
          >
            <CategoryCard category={category} index={index} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
