import { Prisma } from '@prisma/client'

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true
    variants: true
    reviews: {
      include: {
        profile: true
      }
    }
    _count: {
      select: { reviews: true }
    }
  }
}>

export type ProductVariantCreate = {
  size: string
  price: number
  stock?: number
}

export interface ProductFilters {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  size?: string
  isNew?: boolean
}
