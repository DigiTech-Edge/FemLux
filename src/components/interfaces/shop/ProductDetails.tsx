"use client";

import React, { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Button, Divider } from "@nextui-org/react";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  StarHalf,
  Truck,
} from "lucide-react";
import { cn } from "@/helpers/utils";
import { ProductWithRelations } from "@/types/product";
import toast from "react-hot-toast";
import { formatCurrency } from "@/helpers";
import { calculateAverageRating, calculateStars } from "@/helpers/rating";
import ReviewsSection from "@/components/ui/ReviewsSection";
import { useFavorite } from "@/hooks/useFavorite";
import Carousel from "@/components/ui/Carousel";
import { useCartStore } from "@/store/cart";

interface ProductDetailsProps {
  product: ProductWithRelations;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState(product.variants[0].size);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [, startTransition] = useTransition();
  const { isFavorite, toggleFavoriteStatus } = useFavorite(product.id);
  const addItem = useCartStore((state) => state.addItem);

  const rating = useMemo(
    () => calculateAverageRating(product.reviews),
    [product.reviews]
  );
  const stars = useMemo(() => calculateStars(rating), [rating]);

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.size === selectedSize),
    [product.variants, selectedSize]
  );

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a size");
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
      selectedQuantity
    );
    toast.success("Added to cart");
  };

  const handleFavoriteClick = () => {
    startTransition(async () => {
      try {
        await toggleFavoriteStatus();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error updating favorite status"
        );
      }
    });
  };

  if (!selectedVariant) return null;

  return (
    <main className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col">
          {/* Product Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4 w-full mx-auto">
              {/* Main Image Carousel */}
              <div className="relative w-full">
                <Carousel
                  showControls
                  showIndicators
                  slideWidth="100%"
                  className="w-full"
                  loop
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
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* Thumbnail Carousel */}
              <div className="relative w-full h-20">
                <Carousel
                  showControls
                  showIndicators={false}
                  slideWidth="20%"
                  className="w-full h-full"
                  loop
                >
                  {product.images.map((image, idx) => (
                    <div
                      key={idx}
                      className="relative w-full flex-[0_0_20%] px-1"
                    >
                      <div
                        className={cn(
                          "relative aspect-square w-full cursor-pointer rounded-md overflow-hidden",
                          idx === 0
                            ? "ring-2 ring-primary"
                            : "ring-1 ring-gray-200"
                        )}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="20vw"
                        />
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  {product.isNew && (
                    <span className="bg-primary text-white px-2 py-1 text-xs font-semibold rounded">
                      NEW
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => {
                      if (i < stars.full) {
                        return (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        );
                      } else if (i === stars.full && stars.half) {
                        return (
                          <StarHalf
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        );
                      }
                      return <Star key={i} className="w-4 h-4 text-gray-300" />;
                    })}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product._count.reviews} reviews
                  </span>
                </div>
                <p className="text-xl font-semibold mt-2">
                  {formatCurrency(selectedVariant.price)}
                </p>
              </div>

              <div className="space-y-4">
                {/* Variants */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <Button
                        key={variant.id}
                        size="sm"
                        color={
                          selectedVariant.id === variant.id
                            ? "primary"
                            : "default"
                        }
                        variant={
                          selectedVariant.id === variant.id
                            ? "solid"
                            : "bordered"
                        }
                        onPress={() => setSelectedSize(variant.size)}
                        className={cn(
                          "min-w-[3rem]",
                          variant.stock === 0 &&
                            "opacity-50 cursor-not-allowed",
                          selectedVariant.id === variant.id &&
                            "bg-primary text-white"
                        )}
                        isDisabled={variant.stock === 0}
                      >
                        {variant.size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium mb-2 block">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() =>
                          setSelectedQuantity((prev) => Math.max(1, prev - 1))
                        }
                        isDisabled={selectedQuantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center">
                        {selectedQuantity}
                      </span>
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() =>
                          setSelectedQuantity((prev) =>
                            Math.min(prev + 1, selectedVariant.stock)
                          )
                        }
                        isDisabled={selectedQuantity >= selectedVariant.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {/* <p className="text-sm text-gray-600">
                    {selectedVariant.stock} items available
                  </p> */}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    color="primary"
                    startContent={<ShoppingCart className="w-4 h-4" />}
                    className="flex-1"
                    onPress={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    isIconOnly
                    size="lg"
                    variant="bordered"
                    aria-label="Add to wishlist"
                    onPress={handleFavoriteClick}
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Heart
                      className={cn("w-6 h-6", {
                        "fill-danger text-danger": isFavorite,
                        "text-default-500": !isFavorite,
                      })}
                    />
                  </Button>
                </div>
              </div>

              <Divider />

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $50</span>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t pt-8" />
          {/* Reviews Section */}
          <ReviewsSection
            productId={product.id}
            reviews={product.reviews?.map((review) => ({
              ...review,
              profile: review.profile
                ? {
                    fullName: review.profile.fullName,
                    avatarUrl: review.profile.avatarUrl,
                  }
                : null,
            }))}
            rating={rating}
            reviewCount={product._count.reviews}
            stars={stars}
          />
        </div>
      </div>
    </main>
  );
}
