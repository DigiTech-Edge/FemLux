"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { Plus } from "lucide-react";
import ProductStats from "./ProductStats";
import ProductsTable from "./ProductsTable";
import ProductFormModal from "./ProductFormModal";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "@/services/actions/product.actions";
import type {
  ProductWithRelations,
  ProductFormData,
  ProductVariantCreate,
  ProductVariantUpdate,
} from "@/types/product";
import type { CategoryWithCount } from "@/types/category";
import useSWR from "swr";
import ProductDetailsModal from "./ProductDetailsModal";

interface ProductsClientProps {
  initialProducts: ProductWithRelations[];
  categories: CategoryWithCount[];
}

export default function ProductsClient({
  initialProducts,
  categories,
}: ProductsClientProps) {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithRelations | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: products, mutate } = useSWR(
    ["/api/products"],
    () => getAllProducts(),
    {
      fallbackData: initialProducts,
    }
  );

  const handleView = (product: ProductWithRelations) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleEdit = (product: ProductWithRelations) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (product: ProductWithRelations) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProduct(selectedProduct.id);
      await mutate();
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleCreate = async (data: ProductFormData) => {
    const result = await createProduct(data);
    await mutate();
    return result;
  };

  const handleUpdate = async (data: ProductFormData) => {
    if (!selectedProduct) return;

    // Compare existing variants with new variants to determine changes
    const existingVariantMap = new Map(
      selectedProduct.variants.map((v) => [
        JSON.stringify({ size: v.size, price: v.price, stock: v.stock }),
        v,
      ])
    );

    const newVariantMap = new Map(
      data.variants.map((v) => [
        JSON.stringify({ size: v.size, price: v.price, stock: v.stock }),
        v,
      ])
    );

    const variantsToCreate: ProductVariantCreate[] = [];
    const variantsToUpdate: ProductVariantUpdate[] = [];
    const variantsToDelete: string[] = [];

    // Find variants to create or update
    data.variants.forEach((variant) => {
      const key = JSON.stringify({
        size: variant.size,
        price: variant.price,
        stock: variant.stock,
      });
      const existingVariant = existingVariantMap.get(key);

      if (existingVariant) {
        variantsToUpdate.push({
          id: existingVariant.id,
          size: variant.size,
          price: variant.price,
          stock: variant.stock,
        });
      } else {
        variantsToCreate.push(variant);
      }
    });

    // Find variants to delete
    selectedProduct.variants.forEach((variant) => {
      const key = JSON.stringify({
        size: variant.size,
        price: variant.price,
        stock: variant.stock,
      });
      if (!newVariantMap.has(key)) {
        variantsToDelete.push(variant.id);
      }
    });

    const result = await updateProduct(selectedProduct.id, {
      id: selectedProduct.id,
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      images: data.images,
      isNew: data.isNew,
      variants: {
        create: variantsToCreate,
        update: variantsToUpdate,
        delete: variantsToDelete,
      },
    });
    await mutate();
    return result;
  };

  const onSubmit = (data: ProductFormData) => {
    if (isEditing) {
      return handleUpdate(data);
    } else {
      return handleCreate(data);
    }
  };

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.variants.some((v) => v.stock > 0)).length,
    outOfStock: products.filter((p) => p.variants.every((v) => v.stock === 0))
      .length,
    lowStock: products.filter((p) =>
      p.variants.some((v) => v.stock > 0 && v.stock <= 10)
    ).length,
    totalValue: products.reduce(
      (sum, p) =>
        sum +
        p.variants.reduce((variantSum, v) => variantSum + v.price * v.stock, 0),
      0
    ),
    newProducts: products.filter((p) => p.isNew).length,
  };

  const handleFilterChange = (filters: string) => {
    console.log("Filter changed:", filters);
    // TODO: Implement product filtering logic
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          color="primary"
          endContent={<Plus className="w-4 h-4" />}
          onPress={() => {
            setSelectedProduct(null);
            setIsEditing(false);
            setIsModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <ProductStats stats={stats} />

      <ProductsTable
        products={products}
        categories={categories}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFilterChange={handleFilterChange}
      />

      <ProductFormModal
        product={selectedProduct}
        categories={categories}
        isOpen={isModalOpen}
        isEditing={isEditing}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
          setIsEditing(false);
        }}
        onSubmit={onSubmit}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProduct(null);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete ${selectedProduct?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
