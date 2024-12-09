import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import ShopClient from "@/components/interfaces/shop/ShopClient";
import { ProductFilters } from "@/lib/types/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  try {
    // Fetch categories first since it's a smaller query
    const categories = await categoriesService.getAll();

    // Then fetch products
    const products = await productsService.getAll();

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
      isNew: resolvedSearchParams?.isNew === "true" ? true : undefined,
    };

    return (
      <ShopClient
        products={products}
        categories={categories}
        initialFilters={filters}
      />
    );
  } catch (error) {
    console.error("Error loading shop page:", error);
    throw error;
  }
}
