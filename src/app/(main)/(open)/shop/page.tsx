import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import ShopClient from "@/components/interfaces/shop/ShopClient";
import { ProductFilters } from "@/lib/types/products";

interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters: ProductFilters = {
    search: searchParams.search,
    categories: searchParams.category ? [searchParams.category] : undefined,
    priceRange: searchParams.minPrice && searchParams.maxPrice
      ? {
          min: Number(searchParams.minPrice),
          max: Number(searchParams.maxPrice),
        }
      : undefined,
  };

  // Get all products and categories
  const [products, categories] = await Promise.all([
    productsService.getAll(),
    categoriesService.getAll(),
  ]);

  return (
    <ShopClient
      products={products}
      categories={categories}
      initialFilters={filters}
    />
  );
}
