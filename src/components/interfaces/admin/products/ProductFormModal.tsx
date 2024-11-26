"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ProductWithRelations, ProductFormData } from "@/types/product";
import type { CategoryWithCount } from "@/types/category";
import ImageUpload from "@/components/ui/ImageUpload";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import env from "@/env";
import Image from "next/image";
import Carousel from "@/components/ui/Carousel";
import { cn } from "@/helpers/utils";
import { deleteImage } from "@/utils/supabase/storage";

interface ProductFormModalProps {
  product: ProductWithRelations | null;
  categories: CategoryWithCount[];
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
}

const variantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  price: z.number().min(0, "Price must be greater than 0"),
  stock: z.number().min(0, "Stock must be greater than or equal to 0"),
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
  isNew: z.boolean(),
});

export default function ProductFormModal({
  product,
  categories,
  isOpen,
  isEditing,
  onClose,
  onSubmit: onSubmitProp,
}: ProductFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deleteImageState, setDeleteImageState] = useState({
    isOpen: false,
    url: "",
    loading: false,
  });
  const mainCarouselRef = useRef<{ scrollTo: (index: number) => void } | null>(
    null
  );

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      images: [],
      variants: [{ size: "", price: 0, stock: 0 }],
      isNew: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const images = form.watch("images");

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    mainCarouselRef.current?.scrollTo(index);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      // Convert variant prices to numbers and ensure proper type handling
      const formattedData = {
        ...data,
        variants: data.variants.map((variant) => ({
          ...variant,
          price: Number(variant.price),
          stock: Number(variant.stock),
        })),
      };

      await onSubmitProp(formattedData);
      handleClose();
      toast.success(
        isEditing
          ? "Product updated successfully"
          : "Product created successfully",
        { id: "product-modal" }
      );
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageRemove = async (url: string) => {
    setDeleteImageState({
      isOpen: true,
      url,
      loading: false,
    });
  };

  const handleImageDelete = async () => {
    if (!deleteImageState.url) return;

    try {
      setDeleteImageState((prev) => ({ ...prev, loading: true }));
      const result = await deleteImage(deleteImageState.url);
      if (result.success) {
        const newImages = form
          .getValues("images")
          .filter((image) => image !== deleteImageState.url);
        form.setValue("images", newImages);
        toast.success("Image deleted successfully");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setDeleteImageState({
        isOpen: false,
        url: "",
        loading: false,
      });
    }
  };

  useEffect(() => {
    if (product && isEditing) {
      form.reset({
        name: product.name,
        description: product.description || "",
        categoryId: product.categoryId,
        images: product.images || [],
        variants: product.variants.map((variant) => ({
          size: variant.size,
          price: Number(variant.price),
          stock: variant.stock,
        })) || [{ size: "", price: 0, stock: 0 }],
        isNew: product.isNew || false,
      });
      if (product.images?.length > 0) {
        setSelectedImageIndex(0);
      }
    } else {
      form.reset({
        name: "",
        description: "",
        categoryId: "",
        images: [],
        variants: [{ size: "", price: 0, stock: 0 }],
        isNew: false,
      });
    }
  }, [product, isEditing, form]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      scrollBehavior="outside"
    >
      <ModalContent>
        {() => (
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">
                {isEditing ? "Edit Product" : "Create Product"}
              </h3>
            </ModalHeader>
            <ModalBody className="gap-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    onClick={() => handleImageRemove(image)}
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
                                  <ImageUpload
                                    value={images}
                                    onChange={(urls) =>
                                      form.setValue("images", urls)
                                    }
                                    onRemove={(url) => {
                                      form.setValue(
                                        "images",
                                        images.filter((img) => img !== url)
                                      );
                                    }}
                                    bucket={env.buckets.products}
                                    className="h-full"
                                    compact
                                  />
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
                      <ImageUpload
                        value={form.watch("images")}
                        onChange={(urls) => form.setValue("images", urls)}
                        onRemove={handleImageRemove}
                        bucket={env.buckets.products}
                        className="w-full aspect-square"
                      />
                    )}
                  </div>
                  {form.formState.errors.images && (
                    <p className="text-danger text-sm">
                      {form.formState.errors.images.message}
                    </p>
                  )}
                </div>

                {/* Right Column - Basic Info */}
                <div className="space-y-4">
                  <Input
                    label="Name"
                    placeholder="Enter product name"
                    {...form.register("name")}
                    errorMessage={form.formState.errors.name?.message}
                    isInvalid={!!form.formState.errors.name}
                    isRequired
                    labelPlacement="outside"
                    classNames={{
                      label:
                        "text-sm font-medium text-gray-700 dark:text-gray-300",
                    }}
                  />
                  <div>
                    <Textarea
                      label="Description"
                      placeholder="Enter product description"
                      {...form.register("description")}
                      errorMessage={form.formState.errors.description?.message}
                      isInvalid={!!form.formState.errors.description}
                      isRequired
                      labelPlacement="outside"
                      classNames={{
                        label:
                          "text-sm font-medium text-gray-700 dark:text-gray-300",
                        input: "bg-white dark:bg-gray-800",
                        base: "min-h-[120px]",
                      }}
                    />
                  </div>

                  <Select
                    label="Category"
                    placeholder="Select a category"
                    {...form.register("categoryId")}
                    errorMessage={form.formState.errors.categoryId?.message}
                    isInvalid={!!form.formState.errors.categoryId}
                    isRequired
                    labelPlacement="outside"
                    classNames={{
                      label:
                        "text-sm font-medium text-gray-700 dark:text-gray-300",
                    }}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.id} textValue={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <div>
                    <Switch
                      isSelected={form.watch("isNew")}
                      onValueChange={(value) => form.setValue("isNew", value)}
                      classNames={{
                        label:
                          "text-sm font-medium text-gray-700 dark:text-gray-300",
                      }}
                    >
                      Mark as New Product
                    </Switch>
                  </div>
                </div>

                {/* Variants Section */}
                <div className="col-span-full space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Product Variants</h3>
                    <Button
                      variant="flat"
                      color="primary"
                      startContent={<Plus className="w-4 h-4" />}
                      onPress={() => append({ size: "", price: 0, stock: 0 })}
                    >
                      Add Variant
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start p-4 rounded-lg border border-gray-200 dark:border-gray-700 relative"
                      >
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-danger text-white hover:bg-danger-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <Input
                          label="Size"
                          placeholder="e.g., S, M, L"
                          {...form.register(`variants.${index}.size`)}
                          errorMessage={
                            form.formState.errors.variants?.[index]?.size
                              ?.message
                          }
                          isInvalid={
                            !!form.formState.errors.variants?.[index]?.size
                          }
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          label="Price"
                          placeholder="0.00"
                          {...form.register(`variants.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          errorMessage={
                            form.formState.errors.variants?.[index]?.price
                              ?.message
                          }
                          isInvalid={
                            !!form.formState.errors.variants?.[index]?.price
                          }
                          className="flex-1"
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                $
                              </span>
                            </div>
                          }
                        />
                        <Input
                          type="number"
                          label="Stock"
                          placeholder="0"
                          {...form.register(`variants.${index}.stock`, {
                            valueAsNumber: true,
                          })}
                          errorMessage={
                            form.formState.errors.variants?.[index]?.stock
                              ?.message
                          }
                          isInvalid={
                            !!form.formState.errors.variants?.[index]?.stock
                          }
                          className="flex-1"
                        />
                      </div>
                    ))}
                    {form.formState.errors.variants && (
                      <p className="text-danger text-sm">
                        {form.formState.errors.variants.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-gray-200">
              <Button
                color="danger"
                variant="light"
                onPress={handleClose}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                {isEditing ? "Save" : "Create"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>

      <DeleteConfirmationModal
        title="Delete Image"
        description="Are you sure you want to delete this image? This action cannot be undone."
        isOpen={deleteImageState.isOpen}
        loading={deleteImageState.loading}
        onClose={() =>
          setDeleteImageState({ isOpen: false, url: "", loading: false })
        }
        onConfirm={handleImageDelete}
      />
    </Modal>
  );
}
