"use client";

import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/actions/category.actions";
import CategoryFormModal from "./CategoryFormModal";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
import { CategoryFormData, CategoryWithCount } from "@/types/category";
import { useState } from "react";

type CategoriesClientProps = {
  initialCategories: CategoryWithCount[];
};

export default function CategoriesClient({
  initialCategories,
}: CategoriesClientProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithCount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    itemToDelete: CategoryWithCount | null;
    loading: boolean;
  }>({
    isOpen: false,
    itemToDelete: null,
    loading: false,
  });

  const { data: categories, mutate } = useSWR<CategoryWithCount[]>(
    "/api/categories",
    getCategories,
    {
      fallbackData: initialCategories,
    }
  );

  const handleSubmit = async (formData: CategoryFormData) => {
    try {
      if (isEditing && selectedCategory) {
        await updateCategory(selectedCategory.id, {
          name: formData.name,
          description: formData.description,
          image: formData.image,
        });
        await mutate();
        toast.success("Category updated successfully");
      } else {
        await createCategory({
          name: formData.name,
          description: formData.description,
          image: formData.image,
        });
        await mutate();
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error("Failed to save category");
    }
  };

  const handleDeleteClick = (category: CategoryWithCount) => {
    setDeleteModalState({
      isOpen: true,
      itemToDelete: category,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    const { itemToDelete } = deleteModalState;
    if (!itemToDelete) return;

    try {
      setDeleteModalState((prev) => ({ ...prev, loading: true }));
      await deleteCategory(itemToDelete.id);
      await mutate();
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setDeleteModalState((prev) => ({
        ...prev,
        isOpen: false,
        loading: false,
      }));
    }
  };

  const handleEdit = (category: CategoryWithCount) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  if (!categories) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500">Manage your product categories</p>
        </div>
        <Button
          color="primary"
          endContent={<Plus size={20} />}
          onPress={handleAdd}
        >
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No categories found. Create your first category to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow w-full max-w-2xl"
            >
              <CardBody>
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-40 h-48 md:h-full shrink-0">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover md:rounded-b-none rounded-t-lg md:rounded-t-none md:rounded-l-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-lg md:rounded-t-none md:rounded-l-lg">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 p-4 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="text-lg font-semibold truncate">
                        {category.name}
                      </h3>
                      <div className="hidden md:flex items-center gap-2 shrink-0">
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => handleEdit(category)}
                          className="text-default-500 hover:text-default-900"
                        >
                          <Pencil size={18} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => handleDeleteClick(category)}
                          className="text-danger hover:text-danger-600"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                    {category.description && (
                      <div className="flex-1 overflow-y-auto max-h-24 md:max-h-none">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {category.description}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <Chip size="sm" variant="flat" color="primary">
                        {category._count.products}{" "}
                        {category._count.products === 1
                          ? "Product"
                          : "Products"}
                      </Chip>
                      <div className="md:hidden flex items-center gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => handleEdit(category)}
                          className="text-default-500 hover:text-default-900"
                        >
                          <Pencil size={18} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => handleDeleteClick(category)}
                          className="text-danger hover:text-danger-600"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <CategoryFormModal
        category={selectedCategory}
        isOpen={isModalOpen}
        isEditing={isEditing}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSubmit}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() =>
          setDeleteModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={handleDeleteConfirm}
        loading={deleteModalState.loading}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
}
