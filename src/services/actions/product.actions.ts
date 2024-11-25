import { productsService } from '../products.service'
import type { ProductFilters, ProductVariantCreate } from '@/types/product'

export async function getProducts(filters?: ProductFilters) {
  return productsService.getAll(filters)
}

export async function getProductById(id: string) {
  return productsService.getById(id)
}

export async function createProduct(data: {
  name: string
  description: string
  categoryId: string
  images: string[]
  variants: ProductVariantCreate[]
}) {
  return productsService.create(data)
}

export async function updateProduct(
  id: string,
  data: {
    name?: string
    description?: string
    categoryId?: string
    images?: string[]
    isNew?: boolean
    variants?: {
      create?: ProductVariantCreate[]
      update?: Array<ProductVariantCreate & { id: string }>
      delete?: string[]
    }
  }
) {
  return productsService.update(id, data)
}

export async function deleteProduct(id: string) {
  return productsService.delete(id)
}

export async function getNewArrivals(limit?: number) {
  return productsService.getNewArrivals(limit)
}
