"use client";

import React, { useMemo, useRef, useState } from "react";
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
  MessageSquare,
} from "lucide-react";
import { cn } from "@/helpers/utils";
import { ProductWithRelations } from "@/types/product";
import ReviewModal from "./ReviewModal";
import toast from "react-hot-toast";
import { addReview } from "@/services/actions/product.actions";
import Carousel from "@/components/ui/Carousel";
import { formatCurrency } from "@/helpers";
import { calculateAverageRating, calculateStars } from "@/helpers/rating";

interface ProductDetailsProps {
  product: ProductWithRelations;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const mainCarouselRef = useRef<{
    scrollTo: (index: number) => void;
  } | null>(null);

  const rating = useMemo(
    () => calculateAverageRating(product.reviews),
    [product.reviews]
  );
  const stars = useMemo(() => calculateStars(rating), [rating]);

  const availableVariants = useMemo(() => {
    return product.variants.sort((a, b) => a.size.localeCompare(b.size));
  }, [product.variants]);

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      const newQuantity = increment ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(newQuantity, selectedVariant.stock));
    });
  };

  const handleVariantChange = (variant: typeof selectedVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    mainCarouselRef.current?.scrollTo(index);
  };

  const handleReviewSubmit = async (data: {
    rating: number;
    comment?: string;
  }) => {
    setIsSubmittingReview(true);
    try {
      await addReview({
        productId: product.id,
        rating: data.rating,
        comment: data.comment || "",
      });
      toast.success("Review submitted");
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error instanceof Error) {
        switch (error.message) {
          case "Unauthorized":
            toast.error("Please log in to submit a review");
            break;
          case "Review already exists":
            toast.error("You have already reviewed this product");
            break;
          default:
            toast.error("Failed to submit review");
        }
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
                  ref={mainCarouselRef}
                  showControls
                  showIndicators
                  slideWidth="100%"
                  className="w-full"
                  loop
                  onSelect={setSelectedImageIndex}
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
                          selectedImageIndex === idx
                            ? "ring-2 ring-primary"
                            : "ring-1 ring-gray-200"
                        )}
                        onClick={() => handleThumbnailClick(idx)}
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
                        return <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
                      } else if (i === stars.full && stars.half) {
                        return <StarHalf key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
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
                    {availableVariants.map((variant) => (
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
                        onPress={() => handleVariantChange(variant)}
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

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => handleQuantityChange(false)}
                      isDisabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => handleQuantityChange(true)}
                      isDisabled={quantity >= selectedVariant.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedVariant.stock} items available
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    color="primary"
                    startContent={<ShoppingCart className="w-4 h-4" />}
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    isIconOnly
                    size="lg"
                    variant="bordered"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4" />
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

          {/* Reviews Section */}
          <div className="mt-16 border-t pt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Customer Reviews</h2>
              <Button
                variant="light"
                color="primary"
                startContent={<MessageSquare size={18} />}
                onPress={() => setIsReviewModalOpen(true)}
              >
                Write a Review
              </Button>
            </div>

            <div className="space-y-4">
              {/* Average Rating */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {rating.toFixed(1)}
                  </div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => {
                      if (i < stars.full) {
                        return <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
                      } else if (i === stars.full && stars.half) {
                        return <StarHalf key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
                      }
                      return <Star key={i} className="w-4 h-4 text-gray-300" />;
                    })}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {product._count.reviews}{" "}
                    {product._count.reviews === 1 ? "review" : "reviews"}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white/50 backdrop-blur-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {review.profile?.avatarUrl ? (
                              <Image
                                src={review.profile.avatarUrl || ""}
                                alt={review.profile.fullName || "User"}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-semibold text-primary">
                                {(
                                  review.profile?.fullName?.[0] || "A"
                                ).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {review.profile?.fullName || "Anonymous"}
                            </h4>
                            <time className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </time>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                          {review.comment && (
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2 text-lg">No reviews yet</p>
                    <p className="text-gray-500 mb-6 text-sm">
                      Be the first to share your experience with this product
                    </p>
                    <Button
                      variant="light"
                      color="primary"
                      size="lg"
                      onPress={() => setIsReviewModalOpen(true)}
                    >
                      Write a Review
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => !isSubmittingReview && setIsReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
          isLoading={isSubmittingReview}
        />
      </div>
    </main>
  );
}
