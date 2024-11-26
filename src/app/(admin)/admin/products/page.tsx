import { getCategories } from "@/services/actions/category.actions";
import { getProducts } from "@/services/actions/product.actions";
import ProductManagementClient from "@/components/interfaces/admin/categories/ProductManagementClient";

export default async function ProductsPage() {
  const [initialProducts, initialCategories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto py-6">
      <ProductManagementClient
        initialProducts={initialProducts}
        initialCategories={initialCategories}
      />
    </div>
  );
}
