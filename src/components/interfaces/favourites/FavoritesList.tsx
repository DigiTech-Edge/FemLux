"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { ShoppingCart, Trash2, StarIcon, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { ProductWithRelations } from "@/types/product";
import { formatCurrency } from "@/helpers";
import { toggleFavorite } from "@/services/actions/favorite.actions";
import toast from "react-hot-toast";
import { cn } from "@/helpers/utils";
import Carousel from "@/components/ui/Carousel";

interface FavoritesListProps {
  favorites: {
    productId: string;
    dateAdded: string;
    product: ProductWithRelations;
  }[];
}

export default function FavoritesList({ favorites }: FavoritesListProps) {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(
    favorites.reduce(
      (acc, fav) => ({
        ...acc,
        [fav.productId]: fav.product.variants[0].id,
      }),
      {}
    )
  );

  // Memoize variants and stock status for all products
  const productDetails = useMemo(() => {
    return favorites.reduce((acc, favorite) => {
      acc[favorite.productId] = {
        availableVariants: favorite.product.variants.sort((a, b) =>
          a.size.localeCompare(b.size)
        ),
        inStock: favorite.product.variants.some((v) => v.stock > 0),
      };
      return acc;
    }, {} as Record<string, { availableVariants: ProductWithRelations["variants"]; inStock: boolean }>);
  }, [favorites]);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await toggleFavorite(productId);
      toast.success("Removed from favorites");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove from favorites");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((favorite, index) => {
        const selectedVariant =
          favorite.product.variants.find(
            (v) => v.id === selectedVariants[favorite.productId]
          ) || favorite.product.variants[0];

        const { availableVariants, inStock } =
          productDetails[favorite.productId];

        return (
          <motion.div
            key={favorite.productId}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
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
                  {favorite.product.images.map((image, idx) => (
                    <div key={idx} className="relative w-full flex-[0_0_100%]">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={image}
                          alt={`${favorite.product.name} - View ${idx + 1}`}
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
                {favorite.product.isNew && (
                  <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs font-semibold rounded">
                    NEW
                  </div>
                )}

                {/* Remove Button */}
                <div className="absolute right-2 top-2 z-10">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onClick={() => handleRemoveFavorite(favorite.productId)}
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Trash2 className="w-4 h-4 text-danger" />
                  </Button>
                </div>

                {/* Add to Cart Button */}
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
                    {favorite.product.category.name}
                  </div>
                  <div className="text-primary font-semibold">
                    {formatCurrency(selectedVariant.price)}
                  </div>
                </div>

                {/* Middle Section: Title and Variants */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-medium flex-grow line-clamp-2">
                    {favorite.product.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 min-w-[80px] justify-end">
                    {availableVariants.map((variant) => (
                      <button
                        key={variant.size}
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [favorite.productId]: variant.id,
                          }))
                        }
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

                    {/* Rating */}
                    {favorite.product._count.reviews > 0 && (
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">
                          ({favorite.product._count.reviews})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Link href={`/products/${favorite.productId}`}>
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

                {/* Date Added */}
                <div className="mt-2 text-xs text-gray-500">
                  Added on {new Date(favorite.dateAdded).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {favorites.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Heart className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No favourites yet</h3>
          <p className="text-gray-600">
            Start adding products to your favourites list!
          </p>
          <Button
            as={Link}
            href="/shop"
            color="primary"
            variant="flat"
            className="mt-4"
          >
            Browse Products
          </Button>
        </div>
      )}
    </div>
  );
}
