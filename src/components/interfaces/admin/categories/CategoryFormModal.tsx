"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category } from "@prisma/client";
import ImageUpload from "@/components/ui/ImageUpload";
import env from "@/env";
import { deleteImage } from "@/utils/supabase/storage";
import { X } from "lucide-react";
import Image from "next/image";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import toast from "react-hot-toast";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Category description is required"),
  image: z.string().min(1, "Category image is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  category: Category | null;
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
}

export default function CategoryFormModal({
  category,
  isOpen,
  isEditing,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteImageState, setDeleteImageState] = useState({
    isOpen: false,
    loading: false,
  });

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
  });

  useEffect(() => {
    if (category && isEditing) {
      form.reset({
        name: category.name,
        description: category.description || "",
        image: category.image || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        image: "",
      });
    }
  }, [category, isEditing, form]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsLoading(true);
      await onSave(data);
      handleClose();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset({
      name: "",
      description: "",
      image: "",
    });
    onClose();
  };

  const handleImageChange = (urls: string[]) => {
    const imageUrl = urls[0] || "";
    form.setValue("image", imageUrl);
  };

  const handleImageRemove = async (url: string) => {
    console.log(url);
    form.setValue("image", "");
  };

  const handleImageDelete = async () => {
    if (!category?.image) return;

    try {
      setDeleteImageState((prev) => ({ ...prev, loading: true }));
      const result = await deleteImage(category.image!);
      if (result.success) {
        form.setValue("image", "");
        toast.success("Image removed successfully");
      } else {
        toast.error("Failed to remove image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setDeleteImageState((prev) => ({
        ...prev,
        isOpen: false,
        loading: false,
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="top-center"
      size="2xl"
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200 dark:border-gray-700",
        body: "py-6",
        footer: "border-t border-gray-200 dark:border-gray-700",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">
                  {isEditing ? "Edit Category" : "Add Category"}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditing
                    ? "Update your category details below"
                    : "Fill in the details to create a new category"}
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Input
                        label="Name"
                        placeholder="Enter category name"
                        {...form.register("name")}
                        errorMessage={form.formState.errors.name?.message}
                        isInvalid={!!form.formState.errors.name}
                        isRequired
                        labelPlacement="outside"
                        classNames={{
                          label:
                            "text-sm font-medium text-gray-700 dark:text-gray-300",
                          input: "bg-white dark:bg-gray-800",
                        }}
                      />
                    </div>
                    <div>
                      <Textarea
                        label="Description"
                        placeholder="Enter category description"
                        {...form.register("description")}
                        errorMessage={
                          form.formState.errors.description?.message
                        }
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
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category Image
                    </label>
                    {form.watch("image") && (
                      <div className="relative w-full aspect-video mb-4">
                        <Image
                          src={form.watch("image")}
                          alt="Category image"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteImageState((prev) => ({
                              ...prev,
                              isOpen: true,
                            }))
                          }
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {!form.watch("image") && (
                      <ImageUpload
                        value={[]}
                        onChange={handleImageChange}
                        onRemove={handleImageRemove}
                        bucket={env.buckets.categories}
                        maxFiles={1}
                        maxFileSize={2 * 1024 * 1024}
                      />
                    )}
                    {form.formState.errors.image && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.image.message}
                      </p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleClose}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  {isEditing ? "Save" : "Create"}
                </Button>
              </ModalFooter>
            </form>
            <DeleteConfirmationModal
              isOpen={deleteImageState.isOpen}
              onClose={() =>
                setDeleteImageState((prev) => ({ ...prev, isOpen: false }))
              }
              onConfirm={handleImageDelete}
              loading={deleteImageState.loading}
              title="Delete Image"
              description="Are you sure you want to remove this image? This action cannot be undone."
            />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
