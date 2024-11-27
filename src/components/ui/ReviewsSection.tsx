"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { MessageSquare, Star, StarHalf } from "lucide-react";
import { cn } from "@/helpers/utils";
import { Review } from "@prisma/client";
import ReviewModal from "@/components/interfaces/shop/ReviewModal";
import toast from "react-hot-toast";
import { addReview } from "@/services/actions/product.actions";

interface ReviewWithProfile extends Review {
  profile?: {
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
}

interface ReviewsSectionProps {
  productId: string;
  reviews: ReviewWithProfile[] | undefined;
  rating: number;
  reviewCount: number;
  stars: {
    full: number;
    half: boolean;
  };
  hideReviewButton?: boolean;
}

export default function ReviewsSection({
  productId,
  reviews = [],
  rating,
  reviewCount,
  stars,
  hideReviewButton = false,
}: ReviewsSectionProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);

  const handleReviewSubmit = async (data: {
    rating: number;
    comment?: string;
  }) => {
    setIsSubmittingReview(true);
    try {
      await addReview({
        productId,
        rating: data.rating,
        comment: data.comment || "",
      });
      toast.success("Review submitted successfully");
      // Refresh the page to show the new review
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
      setIsReviewModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        {!hideReviewButton && (
          <Button
            variant="light"
            color="primary"
            startContent={<MessageSquare size={18} />}
            onPress={() => setIsReviewModalOpen(true)}
          >
            Write a Review
          </Button>
        )}
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
            <div className="text-sm text-gray-600 mt-1">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white/50 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {review.profile?.avatarUrl ? (
                        <Image
                          src={review.profile.avatarUrl}
                          alt={review.profile.fullName || "User"}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-primary">
                          {(review.profile?.fullName?.[0] || "A").toUpperCase()}
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
              {!hideReviewButton && (
                <Button
                  variant="light"
                  color="primary"
                  size="lg"
                  onPress={() => setIsReviewModalOpen(true)}
                >
                  Write a Review
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => !isSubmittingReview && setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        isLoading={isSubmittingReview}
      />
    </>
  );
}
