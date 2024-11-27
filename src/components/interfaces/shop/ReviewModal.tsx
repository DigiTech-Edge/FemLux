"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
  isLoading?: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ReviewModalProps) {
  const [selectedRating, setSelectedRating] = React.useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  // Reset form when modal is opened
  React.useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedRating(0);
    }
  }, [isOpen, reset]);

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  const onSubmitForm = async (data: ReviewFormData) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <p className="text-sm text-gray-500">
              Share your experience with this product
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleStarClick(rating)}
                      className="focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= selectedRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-danger text-sm">Please select a rating</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Textarea
                  label="Comment (Optional)"
                  placeholder="Share your thoughts about the product..."
                  variant="bordered"
                  {...register("comment")}
                  isDisabled={isLoading}
                  labelPlacement="outside"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
