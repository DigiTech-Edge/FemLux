import { getCategories } from "@/services/actions/category.actions";
import { getAllProducts } from "@/services/actions/product.actions";
import ProductManagementClient from "@/components/interfaces/admin/categories/ProductManagementClient";
import { Spinner } from "@nextui-org/react";
import { Suspense } from "react";

export default async function ProductsPage() {
  const initialProducts = await getAllProducts();
  const initialCategories = await getCategories();

  return (
    <div className="mx-auto py-6">
      <Suspense fallback={<div className="flex justify-center items-center h-screen">
            <Spinner />
          </div>}>
        <ProductManagementClient
          initialProducts={initialProducts}
          initialCategories={initialCategories}
        />
      </Suspense>
    </div>
  );
}
