import { Suspense } from "react";
import { getProducts } from "@/lib/data/admin/products";
import { getCategories } from "@/lib/data/admin/categories";
import ProductsClient from "../../../../components/interfaces/admin/products/ProductsClient";

export const metadata = {
  title: "Products | Admin Dashboard",
  description: "Manage your products",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsClient initialProducts={products} initialCategories={categories} />
    </Suspense>
  );
}
