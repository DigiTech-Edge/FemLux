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
  ProductUpdateData,
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
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    loading: boolean;
  }>({
    isOpen: false,
    loading: false,
  });
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: products, mutate } = useSWR<ProductWithRelations[]>(
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
    setDeleteModalState({ isOpen: true, loading: false });
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      setDeleteModalState((prev) => ({ ...prev, loading: true }));
      await deleteProduct(selectedProduct.id);
      await mutate();
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    } finally {
      setDeleteModalState({ isOpen: false, loading: false });
      setSelectedProduct(null);
    }
  };

  const handleCreate = async (data: ProductFormData) => {
    const result = await createProduct(data);
    await mutate();
    return result;
  };

  const handleUpdate = async (data: ProductUpdateData) => {
    if (!selectedProduct) return;

    const result = await updateProduct(selectedProduct.id, {
      id: selectedProduct.id,
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      images: data.images,
      isNew: data.isNew,
      variants: data.variants,
    });
    await mutate();
    return result;
  };

  const onSubmit = async (data: ProductFormData | ProductUpdateData) => {
    if (isEditing) {
      if (!selectedProduct) return;
      return handleUpdate(data as ProductUpdateData);
    } else {
      return handleCreate(data as ProductFormData);
    }
  };

  const stats = {
    total: products?.length || 0,
    inStock:
      products?.filter((p) => p.variants.some((v) => v.stock > 0)).length || 0,
    outOfStock:
      products?.filter((p) => p.variants.every((v) => v.stock === 0)).length ||
      0,
    lowStock:
      products?.filter((p) =>
        p.variants.some((v) => v.stock > 0 && v.stock <= 10)
      ).length || 0,
    totalValue:
      products?.reduce(
        (sum, p) =>
          sum +
          p.variants.reduce(
            (variantSum, v) => variantSum + v.price * v.stock,
            0
          ),
        0
      ) || 0,
    newProducts: products?.filter((p) => p.isNew).length || 0,
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
        isOpen={deleteModalState.isOpen}
        loading={deleteModalState.loading}
        onClose={() => {
          setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
          setSelectedProduct(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete ${selectedProduct?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
