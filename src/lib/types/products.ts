export interface Product {
  id: number
  name: string
  description: string
  price: number
  images: string[]
  category: string
  rating: number
  reviews: number
  isNew: boolean
  isBestSeller: boolean
  colors: string[]
  sizes: string[]
  stock: number
  brand: string
  tags: string[]
}

export interface Category {
  id: number
  name: string
  image: string
  itemCount: number
  featured: boolean
}

export interface FilterOption {
  label: string
  value: string
}

export interface PriceRange {
  min: number
  max: number
}

export interface ProductFilters {
  categories?: string[]
  priceRange?: PriceRange
  colors?: string[]
  sizes?: string[]
  brands?: string[]
  tags?: string[]
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest'
  inStock?: boolean
  search?: string
}
