import {
  ProductWithRelations,
  ProductFilters,
  ProductVariantWithNumber,
} from "../types/product";

export function getFilteredProducts(
  products: ProductWithRelations[],
  filters: Partial<ProductFilters>
) {
  let filteredProducts = [...products];

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.name.toLowerCase().includes(searchTerm)
    );
  }

  // Category filter
  if (filters.categories?.length) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.categories?.includes(product.category.name)
    );
  }

  // Price range filter
  if (filters.priceRange) {
    filteredProducts = filteredProducts.filter((product) =>
      product.variants.some(
        (variant: ProductVariantWithNumber) =>
          Number(variant.price) >= filters.priceRange!.min &&
          Number(variant.price) <= filters.priceRange!.max
      )
    );
  }

  // New arrivals filter
  if (filters.isNew !== undefined) {
    filteredProducts = filteredProducts.filter(
      (product) => product.isNew === filters.isNew
    );
  }

  return filteredProducts;
}

export function getUniqueFilterOptions(products: ProductWithRelations[]) {
  const categories = Array.from(
    new Set(products.map((p) => p.category.name))
  ).map((category) => ({
    label: category,
    value: category,
  }));

  const priceRange = products.reduce(
    (acc, product) => {
      const prices = product.variants.map((v: ProductVariantWithNumber) =>
        Number(v.price)
      );
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return {
        min: Math.min(acc.min, min),
        max: Math.max(acc.max, max),
      };
    },
    { min: Infinity, max: 0 }
  );

  return { categories, priceRange };
}

export async function parseSearchParamsToFilters(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<Partial<ProductFilters>> {
  const filters: Partial<ProductFilters> = {};

  const categories = searchParams.categories;
  if (categories) {
    filters.categories = Array.isArray(categories) ? categories : [categories];
  }

  const priceRange = searchParams.priceRange;
  if (priceRange) {
    const [min, max] = (Array.isArray(priceRange) ? priceRange[0] : priceRange)
      .split("-")
      .map(Number);
    filters.priceRange = { min, max };
  }

  const isNew = searchParams.isNew;
  if (isNew === "true" || isNew === "false") {
    filters.isNew = isNew === "true";
  }

  const search = searchParams.search;
  if (search) {
    filters.search = Array.isArray(search) ? search[0] : search;
  }

  return filters;
}
