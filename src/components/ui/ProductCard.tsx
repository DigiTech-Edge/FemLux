"use client";

import React, { useMemo, useTransition, useState } from "react";
import Image from "next/image";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
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
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: ProductWithRelations;
  index?: number;
  isFavoriteView?: boolean;
  additionalActions?: React.ReactNode;
  addedDate?: string;
}

export default function ProductCard({
  product,
  index = 0,
  isFavoriteView = false,
  additionalActions,
  addedDate,
}: ProductCardProps) {
  const ref = useRef(null);
  const router = useRouter();
  const isInView = useInView(ref, { once: true });
  const [, startTransition] = useTransition();
  const { isFavorite, toggleFavoriteStatus, isLoading } = useFavorite(
    product.id
  );
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const addItem = useCartStore((state) => state.addItem);

  const handleFavoriteClick = () => {
    startTransition(async () => {
      try {
        await toggleFavoriteStatus();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error favoriting product"
        );
      }
    });
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    addItem(
      {
        id: product.id,
        name: product.name,
        images: product.images,
        variants: product.variants,
      },
      {
        id: selectedVariant.id,
        size: selectedVariant.size,
        price: selectedVariant.price,
        stock: selectedVariant.stock,
      },
      1
    );
    toast.success("Added to cart");
  };

  const inStock = useMemo(() => {
    return product.variants.some((v) => v.stock > 0);
  }, [product.variants]);

  const availableVariants = useMemo(() => {
    return product.variants.sort((a, b) => a.size.localeCompare(b.size));
  }, [product.variants]);

  const rating = useMemo(
    () => calculateAverageRating(product.reviews),
    [product.reviews]
  );
  const stars = useMemo(() => calculateStars(rating), [rating]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group"
    >
      <Card
        className="hover:shadow-md transition-shadow duration-200"
        radius="none"
      >
        <CardHeader className="p-0">
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

            {/* Action Buttons */}
            {isFavoriteView ? (
              additionalActions
            ) : (
              <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  isLoading={isLoading}
                  onPress={handleFavoriteClick}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Heart
                    className={cn("w-4 h-4", {
                      "fill-danger text-danger": isFavorite,
                      "text-default-500": !isFavorite,
                    })}
                  />
                </Button>
              </div>
            )}

            {/* Cart Button - Show only in non-favorite view */}
            <div className="absolute top-12 right-2 z-10">
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                onPress={handleAddToCart}
                isDisabled={!selectedVariant}
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <ShoppingCart className="w-4 h-4 text-primary" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-4">
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
              <h3 className="text-sm font-medium flex-grow line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                  if (i < stars.full) {
                    return (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    );
                  } else if (i === stars.full && stars.half) {
                    return (
                      <StarHalf
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    );
                  }
                  return <Star key={i} className="w-3 h-3 text-gray-300" />;
                })}
                <span className="text-sm font-medium ml-1">
                  ({rating || "N/A"})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 min-w-[80px] justify-end">
              {availableVariants.map((variant) => (
                <Button
                  key={variant.size}
                  onPress={() => setSelectedVariant(variant)}
                  disabled={variant.stock === 0}
                  isIconOnly
                  size="sm"
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
                </Button>
              ))}
            </div>
          </div>
        </CardBody>

        <CardFooter className="px-4 pb-4 pt-0">
          {/* Bottom Section: Stock, Rating, and Action */}
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {/* Stock Status */}
                <span className="text-xs text-gray-500">
                  {selectedVariant.stock > 0
                    ? `${selectedVariant.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>

              {/* View Details Button */}
              <Button
                size="sm"
                color="danger"
                variant="flat"
                disabled={!inStock}
                onPress={() => router.push(`/shop/${product.id}`)}
              >
                Details
              </Button>
            </div>

            {/* Date Added (for favorites view) */}
            {addedDate && (
              <div className="text-xs text-gray-500">Added on {addedDate}</div>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
