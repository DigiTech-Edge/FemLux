import { Suspense } from "react";
import { getProducts } from "@/lib/data/admin/products";
import ProductsClient from "../../../../components/interfaces/admin/products/ProductsClient";

export const metadata = {
  title: "Products | Admin Dashboard",
  description: "Manage your products",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsClient initialProducts={products} />
    </Suspense>
  );
}
