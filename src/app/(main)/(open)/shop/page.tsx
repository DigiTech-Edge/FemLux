import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import ShopClient from "@/components/interfaces/shop/ShopClient";
import { ProductFilters } from "@/lib/types/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    categories?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    isNew?: string;
  }>;
}) {
  // First resolve the search params
  const resolvedSearchParams = await searchParams;

  // Then fetch data based on resolved params
  const [products, categories] = await Promise.all([
    productsService.getAll(),
    categoriesService.getAll(),
  ]);

  const filters: ProductFilters = {
    search: resolvedSearchParams?.search,
    categories: resolvedSearchParams?.categories
      ? Array.isArray(resolvedSearchParams.categories)
        ? resolvedSearchParams.categories
        : [resolvedSearchParams.categories]
      : undefined,
    priceRange:
      resolvedSearchParams?.minPrice && resolvedSearchParams?.maxPrice
        ? {
            min: Number(resolvedSearchParams.minPrice),
            max: Number(resolvedSearchParams.maxPrice),
          }
        : undefined,
    isNew: resolvedSearchParams?.isNew === 'true',
  };

  return (
    <ShopClient
      products={products}
      categories={categories}
      initialFilters={filters}
    />
  );
}
