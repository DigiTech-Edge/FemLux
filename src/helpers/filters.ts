import { Product, ProductFilters } from '../lib/types/products'

export function getFilteredProducts(products: Product[], filters: Partial<ProductFilters>) {
  let filteredProducts = [...products]

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.categories?.length) {
    filteredProducts = filteredProducts.filter(product =>
      filters.categories?.includes(product.category)
    )
  }

  if (filters.priceRange) {
    filteredProducts = filteredProducts.filter(
      product =>
        product.price >= filters.priceRange!.min &&
        product.price <= filters.priceRange!.max
    )
  }

  if (filters.colors?.length) {
    filteredProducts = filteredProducts.filter(product =>
      product.colors.some(color => filters.colors?.includes(color))
    )
  }

  if (filters.sizes?.length) {
    filteredProducts = filteredProducts.filter(product =>
      product.sizes.some(size => filters.sizes?.includes(size))
    )
  }

  if (filters.brands?.length) {
    filteredProducts = filteredProducts.filter(product =>
      filters.brands?.includes(product.brand)
    )
  }

  if (filters.inStock) {
    filteredProducts = filteredProducts.filter(product => product.stock > 0)
  }

  // Apply sorting
  if (filters.sort) {
    switch (filters.sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filteredProducts = filteredProducts.filter(product => product.isNew)
        break
    }
  }

  return filteredProducts
}

export function getUniqueFilterOptions(products: Product[]) {
  const brands = Array.from(new Set(products.map(p => p.brand))).map(brand => ({
    label: brand,
    value: brand
  }))

  const colors = Array.from(new Set(products.flatMap(p => p.colors))).map(color => ({
    label: color,
    value: color
  }))

  const sizes = Array.from(new Set(products.flatMap(p => p.sizes))).map(size => ({
    label: size,
    value: size
  }))

  return { brands, colors, sizes }
}

export async function parseSearchParamsToFilters(searchParams: { [key: string]: string | string[] | undefined }): Promise<Partial<ProductFilters>> {
  const filters: Partial<ProductFilters> = {}

  const categories = await searchParams.categories
  if (categories) {
    filters.categories = Array.isArray(categories) ? categories : [categories]
  }

  const colors = await searchParams.colors
  if (colors) {
    filters.colors = Array.isArray(colors) ? colors : [colors]
  }

  const sizes = await searchParams.sizes
  if (sizes) {
    filters.sizes = Array.isArray(sizes) ? sizes : [sizes]
  }

  const brands = await searchParams.brands
  if (brands) {
    filters.brands = Array.isArray(brands) ? brands : [brands]
  }

  const priceRange = await searchParams.priceRange
  if (priceRange) {
    const [min, max] = (Array.isArray(priceRange) ? priceRange[0] : priceRange).split('-').map(Number)
    filters.priceRange = { min, max }
  }

  const sort = await searchParams.sort
  if (sort) {
    filters.sort = Array.isArray(sort) ? sort[0] as ProductFilters['sort'] : sort as ProductFilters['sort']
  }

  const inStock = await searchParams.inStock
  if (inStock === 'true') {
    filters.inStock = true
  }

  const search = await searchParams.search
  if (search) {
    filters.search = Array.isArray(search) ? search[0] : search
  }

  return filters
}
