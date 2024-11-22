"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { Plus } from "lucide-react";
import ProductStats from "@/components/interfaces/admin/products/ProductStats";
import ProductsTable from "@/components/interfaces/admin/products/ProductsTable";
import ProductDetailsModal from "@/components/interfaces/admin/products/ProductDetailsModal";
import ProductFormModal from "@/components/interfaces/admin/products/ProductFormModal";
import type { Product } from "@/lib/types/products";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== product.id));
    }
  };

  const handleSave = (product: Product) => {
    if (isEditing) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([
        ...products,
        { ...product, id: Math.max(...products.map((p) => p.id)) + 1 },
      ]);
    }
    setIsFormModalOpen(false);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={handleAdd}
        >
          Add Product
        </Button>
      </div>

      <ProductStats stats={stats} />

      <div className="mt-8">
        <ProductsTable
          products={products}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      <ProductFormModal
        product={selectedProduct}
        isOpen={isFormModalOpen}
        isEditing={isEditing}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
