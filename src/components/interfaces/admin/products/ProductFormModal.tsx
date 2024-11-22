"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
  Select,
  SelectItem,
} from "@nextui-org/react";
import type { Product } from "@/lib/types/products";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import Carousel from "@/components/ui/Carousel";
import Image from "next/image";
import { cn } from "@/helpers/utils";

interface ProductFormModalProps {
  product: Product | null;
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const defaultProduct: Product = {
  id: 0,
  name: "",
  description: "",
  price: 0,
  images: [],
  category: "",
  rating: 0,
  reviews: 0,
  isNew: false,
  isBestSeller: false,
  colors: [],
  sizes: [],
  stock: 0,
  brand: "",
  tags: [],
};

const categories = [
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Accessories",
  "Shoes",
  "Bags",
  "Jewelry",
];

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const availableColors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Purple",
  "Brown",
  "Gray",
];

export default function ProductFormModal({
  product,
  isOpen,
  isEditing,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const mainCarouselRef = React.useRef<{
    scrollTo: (index: number) => void;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, reset, setValue, watch } = useForm<Product>({
    defaultValues: defaultProduct,
  });

  const selectedColors = watch("colors") || [];
  const selectedSizes = watch("sizes") || [];

  useEffect(() => {
    if (product && isEditing) {
      reset(product);
      setImages(product.images);
    } else {
      reset(defaultProduct);
      setImages([]);
    }
  }, [product, isEditing, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newImages]);
      setValue("images", [...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue("images", newImages);
    if (selectedImageIndex >= newImages.length) {
      setSelectedImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    mainCarouselRef.current?.scrollTo(index);
  };

  const onSubmit = (data: Product) => {
    // Ensure arrays are not null
    data.images = images;
    data.colors = data.colors || [];
    data.sizes = data.sizes || [];

    // Handle tags conversion
    const tagsInput = watch('tags') as string | string[] | undefined;
    data.tags = Array.isArray(tagsInput) 
      ? tagsInput 
      : (typeof tagsInput === 'string' && tagsInput)
        ? tagsInput.split(',').map((tag: string) => tag.trim())
        : [];

    // Convert numeric fields
    data.price = Number(data.price);
    data.stock = Number(data.stock);
    data.rating = Number(data.rating);
    data.reviews = Number(data.reviews);

    onSave(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[95vh]",
        body: "p-0 overflow-hidden",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)} className="h-full">
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 max-h-[calc(95vh-12rem)] overflow-y-auto">
                {/* Left Column - Images */}
                <div className="space-y-4">
                  <div className="relative w-full">
                    {images.length > 0 ? (
                      <>
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
                            {images.map((image, idx) => (
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
                                  <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 p-1 bg-danger rounded-full text-white hover:bg-danger-400 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </Carousel>
                        </div>

                        {/* Thumbnail Carousel */}
                        <div className="relative w-full h-24 mt-4">
                          <Carousel
                            showControls
                            showIndicators={false}
                            slideWidth="20%"
                            className="w-full h-full"
                            loop
                          >
                            {[...images, "upload"].map((image, idx) => (
                              <div
                                key={idx}
                                className="relative w-full flex-[0_0_20%] px-1"
                              >
                                {image === "upload" ? (
                                  <div
                                    onClick={() =>
                                      fileInputRef.current?.click()
                                    }
                                    className="relative aspect-square w-full cursor-pointer rounded-md border-2 border-dashed border-default-300 flex items-center justify-center hover:border-primary transition-colors"
                                  >
                                    <Upload className="w-6 h-6 text-default-400" />
                                  </div>
                                ) : (
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
                                )}
                              </div>
                            ))}
                          </Carousel>
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-square rounded-lg border-2 border-dashed border-default-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                      >
                        <ImageIcon className="w-12 h-12 text-default-400 mb-2" />
                        <p className="text-default-600 font-medium">
                          Add Product Images
                        </p>
                        <p className="text-default-400 text-sm">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-default-400 text-xs mt-1">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Right Column - Product Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Product Name"
                          placeholder="Enter product name"
                          isRequired
                          className="col-span-2"
                        />
                      )}
                    />

                    <Controller
                      name="brand"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Brand"
                          placeholder="Enter brand name"
                          isRequired
                        />
                      )}
                    />

                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Category"
                          placeholder="Select category"
                          selectedKeys={field.value ? [field.value] : []}
                          isRequired
                        >
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />

                    <Controller
                      name="price"
                      control={control}
                      rules={{ required: true, min: 0 }}
                      render={({ field: { value, ...fieldProps } }) => (
                        <Input
                          {...fieldProps}
                          type="number"
                          label="Price"
                          placeholder="Enter price"
                          value={value?.toString() || ''}
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                $
                              </span>
                            </div>
                          }
                          isRequired
                        />
                      )}
                    />

                    <Controller
                      name="stock"
                      control={control}
                      rules={{ required: true, min: 0 }}
                      render={({ field: { value, ...fieldProps } }) => (
                        <Input
                          {...fieldProps}
                          type="number"
                          label="Stock"
                          placeholder="Enter stock quantity"
                          value={value?.toString() || ''}
                          isRequired
                        />
                      )}
                    />

                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          label="Description"
                          placeholder="Enter product description"
                          isRequired
                          className="col-span-2"
                          minRows={3}
                        />
                      )}
                    />

                    <Controller
                      name="colors"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Colors"
                          placeholder="Select colors"
                          selectionMode="multiple"
                          selectedKeys={selectedColors}
                          className="col-span-2"
                        >
                          {availableColors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />

                    <Controller
                      name="sizes"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Sizes"
                          placeholder="Select sizes"
                          selectionMode="multiple"
                          selectedKeys={selectedSizes}
                          className="col-span-2"
                        >
                          {availableSizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />

                    <Controller
                      name="tags"
                      control={control}
                      render={({ field: { value, ...fieldProps } }) => (
                        <Input
                          {...fieldProps}
                          label="Tags"
                          placeholder="Enter tags (comma-separated)"
                          value={Array.isArray(value) ? value.join(', ') : value || ''}
                          className="col-span-2"
                        />
                      )}
                    />

                    <div className="col-span-2">
                      <Controller
                        name="isNew"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Switch
                            isSelected={value}
                            onValueChange={onChange}
                            aria-label="New Product"
                          >
                            New Product
                          </Switch>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                {isEditing ? "Save Changes" : "Add Product"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
