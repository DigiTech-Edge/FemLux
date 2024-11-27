import { Review } from "@prisma/client";

export const calculateAverageRating = (
  reviews: Review[] | null | undefined
): number => {
  if (!reviews?.length) return 0;

  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = total / reviews.length;

  // Round to one decimal place
  return Number(average.toFixed(1));
};

export const calculateStars = (rating: number): { full: number; half: boolean } => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return {
    full: fullStars,
    half: hasHalfStar
  };
};
