import { getCategories } from "@/services/actions/category.actions";
import { getAllProducts } from "@/services/actions/product.actions";
import ProductManagementClient from "@/components/interfaces/admin/categories/ProductManagementClient";

export default async function ProductsPage() {
  const initialProducts = await getAllProducts();
  const initialCategories = await getCategories();

  return (
    <div className="mx-auto py-6">
      <ProductManagementClient
        initialProducts={initialProducts}
        initialCategories={initialCategories}
      />
    </div>
  );
}
