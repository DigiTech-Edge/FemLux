"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { Plus } from "lucide-react";
import ProductStats from "@/components/interfaces/admin/products/ProductStats";
import ProductsTable from "@/components/interfaces/admin/products/ProductsTable";
import ProductDetailsModal from "./ProductDetailsModal";
import ProductFormModal from "./ProductFormModal";
import type { Product } from "@/lib/types/products";
import { getProducts } from "../../../../lib/data/admin/products";
import useSWR from "swr";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: products, mutate } = useSWR("/api/products", getProducts, {
    fallbackData: initialProducts,
  });

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (confirm("Are you sure you want to delete this product?")) {
      mutate(
        products.filter((p) => p.id !== product.id),
        false
      );
    }
  };

  const handleSubmit = async (formData: any) => {
    if (isEditing) {
      mutate(
        products.map((p) => (p.id === selectedProduct?.id ? formData : p)),
        false
      );
    } else {
      mutate([...products, formData], false);
    }
    setIsModalOpen(false);
  };

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock > 0).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    bestSellers: products.filter((p) => p.isBestSeller).length,
    newProducts: products.filter((p) => p.isNew).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={handleAdd}
        >
          Add Product
        </Button>
      </div>
      <ProductStats stats={stats} />

      <ProductsTable
        products={products}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductFormModal
        product={selectedProduct}
        isOpen={isModalOpen}
        isEditing={isEditing}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
