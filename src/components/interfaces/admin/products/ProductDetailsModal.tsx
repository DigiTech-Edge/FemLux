"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { Star } from "lucide-react";
import { formatCurrency } from "@/helpers";
import type { Product } from "@/lib/types/products";
import Carousel from "@/components/ui/Carousel";
import Image from "next/image";
import { cn } from "@/helpers/utils";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock reviews data - in real app this would come from API
interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    user: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely love this product! The quality is outstanding and it fits perfectly.",
    date: "2024-01-15",
  },
  {
    id: 2,
    user: "Mike Smith",
    rating: 4,
    comment:
      "Great product overall, but shipping took a bit longer than expected.",
    date: "2024-01-10",
  },
  {
    id: 3,
    user: "Emily Davis",
    rating: 5,
    comment: "Exceeded my expectations! Will definitely buy again.",
    date: "2024-01-05",
  },
];

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
}: ProductDetailsModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [selectedTab, setSelectedTab] = React.useState("details");
  const mainCarouselRef = React.useRef<{
    scrollTo: (index: number) => void;
  } | null>(null);

  if (!product) {
    return null;
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    mainCarouselRef.current?.scrollTo(index);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[95vh]",
        body: "p-0",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                {product.isNew && (
                  <Chip color="success" size="sm" variant="flat">
                    New
                  </Chip>
                )}
                {product.isBestSeller && (
                  <Chip color="warning" size="sm" variant="flat">
                    Best Seller
                  </Chip>
                )}
              </div>
              <div className="flex items-center gap-2 text-default-500">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span>{(product.rating || 0).toFixed(1)}</span>
                <span>({mockReviews.length.toLocaleString()} reviews)</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key.toString())}
                variant="underlined"
                fullWidth
                className="text-primary"
              >
                <Tab key="details" title="Details" className="px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
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
                            <div
                              key={idx}
                              className="relative w-full flex-[0_0_100%]"
                            >
                              <div className="relative aspect-square w-full">
                                <Image
                                  src={image}
                                  alt={`Product Image ${idx + 1}`}
                                  fill
                                  priority={idx === 0}
                                  className="object-cover rounded-lg"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              </div>
                            </div>
                          ))}
                        </Carousel>
                      </div>
                      <div className="relative w-full h-24">
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
                                  sizes="(max-width: 768px) 20vw, 10vw"
                                />
                              </div>
                            </div>
                          ))}
                        </Carousel>
                      </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold mb-2">
                          Description
                        </h4>
                        <p className="text-default-500">
                          {product.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-lg font-semibold mb-2">Price</h4>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(product.price)}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-2">Stock</h4>
                          <Chip
                            className="capitalize"
                            color={
                              product.stock === 0
                                ? "danger"
                                : product.stock <= 10
                                ? "warning"
                                : "success"
                            }
                            size="sm"
                            variant="flat"
                          >
                            {product.stock === 0
                              ? "Out of Stock"
                              : product.stock <= 10
                              ? "Low Stock"
                              : "In Stock"}{" "}
                            ({product.stock})
                          </Chip>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-2">
                            Category
                          </h4>
                          <p className="capitalize">{product.category}</p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-2">Brand</h4>
                          <p>{product.brand}</p>
                        </div>

                        {product.colors.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold mb-2">
                              Colors
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {product.colors.map((color) => (
                                <Chip key={color} size="sm">
                                  {color}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        )}

                        {product.sizes.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold mb-2">
                              Sizes
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {product.sizes.map((size) => (
                                <Chip key={size} size="sm">
                                  {size}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        )}

                        {product.tags.length > 0 && (
                          <div className="col-span-2">
                            <h4 className="text-lg font-semibold mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-1">
                              {product.tags.map((tag) => (
                                <Chip key={tag} size="sm" variant="flat">
                                  {tag}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab
                  key="reviews"
                  title={`Reviews (${mockReviews.length.toLocaleString()})`}
                  className="px-6"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 fill-warning text-warning" />
                        <span className="text-2xl font-bold">
                          {(product.rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="text-default-500">
                        Based on {mockReviews.length.toLocaleString()} reviews
                      </div>
                    </div>

                    <div className="space-y-4">
                      {mockReviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 rounded-lg border border-default-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{review.user}</h4>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "w-4 h-4",
                                        i < review.rating
                                          ? "fill-warning text-warning"
                                          : "fill-default-200 text-default-200"
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-small text-default-500">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-default-500">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
