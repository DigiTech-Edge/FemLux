"use client";

import React, { useMemo, useTransition, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Skeleton } from "@nextui-org/react";
import { Heart, ShoppingCart, Star, StarHalf } from "lucide-react";
import type { ProductWithRelations } from "@/types/product";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Carousel from "./Carousel";
import { formatCurrency } from "@/helpers";
import toast from "react-hot-toast";
import { cn } from "@/helpers/utils";
import { useFavorite } from "@/hooks/useFavorite";
import { calculateAverageRating, calculateStars } from "@/helpers/rating";

interface ProductCardProps {
  product: ProductWithRelations;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isPending, startTransition] = useTransition();
  const { isFavorite, toggleFavoriteStatus, isLoading } = useFavorite(
    product.id
  );
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  const handleFavoriteClick = () => {
    startTransition(async () => {
      try {
        await toggleFavoriteStatus();
      } catch {
        toast.error("Error favoriting product");
      }
    });
  };

  const inStock = useMemo(() => {
    return product.variants.some((v) => v.stock > 0);
  }, [product.variants]);

  const availableVariants = useMemo(() => {
    return product.variants.sort((a, b) => a.size.localeCompare(b.size));
  }, [product.variants]);

  const rating = useMemo(() => calculateAverageRating(product.reviews), [product.reviews]);
  const stars = useMemo(() => calculateStars(rating), [rating]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
      }}
      className="group"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative w-full">
          <Carousel
            showControls
            showIndicators
            slideWidth="100%"
            className="w-full"
          >
            {product.images.map((image, idx) => (
              <div key={idx} className="relative w-full flex-[0_0_100%]">
                <div className="relative aspect-square w-full">
                  <Image
                    src={image}
                    alt={`${product.name} - View ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              </div>
            ))}
          </Carousel>

          {/* New Tag */}
          {product.isNew && (
            <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs font-semibold rounded">
              NEW
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute right-2 top-2 z-10">
            <Button
              variant="flat"
              size="sm"
              isIconOnly
              onClick={handleFavoriteClick}
              disabled={isPending || isLoading}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-4 w-4">
                    <div className="h-full w-full" />
                  </Skeleton>
                </div>
              ) : (
                <Heart
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isFavorite ? "fill-red-500 text-red-500" : "text-red-500"
                  )}
                />
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-12 right-2 z-10">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ShoppingCart className="w-4 h-4 text-primary" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {/* Top Section: Category and Price */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {product.category.name}
            </div>
            <div className="text-primary font-semibold">
              {formatCurrency(selectedVariant.price)}
            </div>
          </div>

          {/* Middle Section: Title and Variants */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground/90">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                  if (i < stars.full) {
                    return <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />;
                  } else if (i === stars.full && stars.half) {
                    return <StarHalf key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />;
                  }
                  return <Star key={i} className="w-3 h-3 text-gray-300" />;
                })}
                <span className="text-sm font-medium ml-1">({rating || "N/A"})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 min-w-[80px] justify-end">
              {availableVariants.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => setSelectedVariant(variant)}
                  disabled={variant.stock === 0}
                  className={cn(
                    "text-xs px-2 py-1 rounded-md transition-colors",
                    variant.id === selectedVariant.id
                      ? "bg-primary text-white"
                      : variant.stock > 0
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section: Stock, Rating, and Action */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {/* Stock Status */}
              <span className="text-xs text-gray-500">
                {selectedVariant.stock > 0
                  ? `${selectedVariant.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* View Details Button */}
            <Link href={`/shop/${product.id}`}>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                disabled={!inStock}
              >
                Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
