"use client";

import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { Category } from "@/lib/types/products";
import { ImageUpload } from "../../shared/ImageUpload";

interface CategoryFormModalProps {
  category: Category | null;
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
}

export default function CategoryFormModal({
  category,
  isOpen,
  isEditing,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Category>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      featured: false,
      itemCount: 0,
    },
  });

  useEffect(() => {
    if (category && isEditing) {
      reset(category);
    } else {
      reset({
        name: "",
        description: "",
        image: "",
        featured: false,
        itemCount: 0,
      });
    }
  }, [category, isEditing, reset]);

  const onSubmit = (data: Category) => {
    onSave({
      ...data,
      id: category?.id || 0,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="top-center"
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              {isEditing ? "Edit Category" : "Add Category"}
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Input
                    label="Name"
                    placeholder="Enter category name"
                    {...register("name", { required: "Name is required" })}
                    errorMessage={errors.name?.message}
                    isRequired
                  />
                  <Input
                    label="Description"
                    placeholder="Enter category description"
                    {...register("description")}
                  />
                  <Switch
                    {...register("featured")}
                    defaultSelected={watch("featured")}
                    onValueChange={(isSelected) =>
                      setValue("featured", isSelected)
                    }
                  >
                    Featured Category
                  </Switch>
                </div>
                <div>
                  <ImageUpload
                    value={watch("image")}
                    onChange={(url) => setValue("image", url)}
                    label="Category Image"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={handleClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                {isEditing ? "Save Changes" : "Add Category"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
