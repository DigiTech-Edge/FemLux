export interface ProductImage {
  id: number
  url: string
  alt: string
  isPrimary: boolean
}

export interface ProductDetails {
  id: number
  name: string
  description: string
  price: number
  images: ProductImage[]
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
  features: string[]
  specifications: {
    [key: string]: string
  }
  relatedProducts?: number[]
}
