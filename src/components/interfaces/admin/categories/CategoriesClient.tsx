"use client";

import React, { useState } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Card,
} from "@nextui-org/react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import CategoryFormModal from "./CategoryFormModal";
import { Category } from "@/lib/types/products";

interface CategoriesClientProps {
  initialCategories: Category[];
}

export default function CategoriesClient({
  initialCategories,
}: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((c) => c.id !== category.id));
    }
  };

  const handleSave = (category: Category) => {
    if (isEditing) {
      setCategories(categories.map((c) => (c.id === category.id ? category : c)));
    } else {
      setCategories([
        ...categories,
        { ...category, id: Math.max(...categories.map((c) => c.id)) + 1 },
      ]);
    }
    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Categories</h2>
          <p className="text-default-500">Manage your product categories</p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={handleAdd}
        >
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <User
                  name={category.name}
                  description={`${category.itemCount} items`}
                  avatarProps={{
                    src: category.image,
                    radius: "lg",
                  }}
                />
                <div className="flex items-center gap-2">
                  <Tooltip content="Edit category">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(category)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete category">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleDelete(category)}
                    >
                      <Trash2 className="w-4 h-4 text-danger" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
              {category.featured && (
                <div className="mt-2">
                  <Chip size="sm" color="warning" variant="flat">
                    Featured
                  </Chip>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <CategoryFormModal
        category={selectedCategory}
        isOpen={isFormModalOpen}
        isEditing={isEditing}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
