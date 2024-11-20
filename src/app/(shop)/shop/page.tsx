import { products, categories } from '@/lib/data/products'
import ShopClient from '@/components/interfaces/shop/ShopClient'
import { getFilteredProducts, getUniqueFilterOptions, parseSearchParamsToFilters } from '@/utils/filters'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search params into filters
  const filters = await parseSearchParamsToFilters(searchParams)

  // Get filtered products
  const filteredProducts = getFilteredProducts(products, filters)

  // Get unique filter options
  const { brands, colors, sizes } = getUniqueFilterOptions(products)

  return (
    <ShopClient
      products={filteredProducts}
      categories={categories}
      brands={brands}
      colors={colors}
      sizes={sizes}
      initialFilters={filters}
    />
  )
}
