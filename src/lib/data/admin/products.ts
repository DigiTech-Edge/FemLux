import { faker } from '@faker-js/faker'
import type { Product } from '@/lib/types/products'

const categories = [
  'Dresses',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Accessories',
  'Shoes',
  'Bags',
  'Jewelry'
]

const subcategories: Record<string, string[]> = {
  Dresses: ['Maxi', 'Mini', 'Midi', 'Evening', 'Casual'],
  Tops: ['T-Shirts', 'Blouses', 'Sweaters', 'Hoodies', 'Tank Tops'],
  Bottoms: ['Jeans', 'Skirts', 'Shorts', 'Pants', 'Leggings'],
  Outerwear: ['Jackets', 'Coats', 'Blazers', 'Cardigans'],
  Accessories: ['Scarves', 'Belts', 'Hats', 'Gloves'],
  Shoes: ['Heels', 'Flats', 'Sneakers', 'Boots', 'Sandals'],
  Bags: ['Totes', 'Crossbody', 'Clutches', 'Backpacks'],
  Jewelry: ['Necklaces', 'Earrings', 'Bracelets', 'Rings']
}

const brands = [
  'FemLux',
  'Elegance',
  'ChicStyle',
  'ModernFlair',
  'GlamourGrace',
]

const colors = [
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Pink',
  'Purple',
  'Navy',
  'Gray',
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL']

const tags = [
  'Summer',
  'Winter',
  'Casual',
  'Formal',
  'Party',
  'Office',
  'Luxury',
  'Trendy',
  'Classic',
]

export type ProductStatus = 'active' | 'draft' | 'archived'
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  stockQuantity: number
  attributes: Record<string, string>
}

export interface ProductStats {
  total: number
  active: number
  draft: number
  archived: number
  lowStock: number
  outOfStock: number
  totalValue: number
  bestSellers: number
  newProducts: number
}

export function generateProduct(): Product {
  const isNew = Math.random() > 0.7
  const isBestSeller = Math.random() > 0.8
  const category = faker.helpers.arrayElement(categories)
  const subcategory = faker.helpers.arrayElement(subcategories[category])
  const status = faker.helpers.arrayElement(['active', 'draft', 'archived'] as const)
  const stockQuantity = faker.number.int({ min: 0, max: 100 })
  let stockStatus: StockStatus = 'in_stock'
  
  if (stockQuantity === 0) {
    stockStatus = 'out_of_stock'
  } else if (stockQuantity < 10) {
    stockStatus = 'low_stock'
  }

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 20, max: 200 })),
    compareAtPrice: faker.helpers.maybe(() => 
      parseFloat(faker.commerce.price({ min: 200, max: 400 }))
    ),
    category,
    subcategory,
    status,
    stockStatus,
    stockQuantity,
    sku: faker.string.alphanumeric(8).toUpperCase(),
    images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
      faker.image.urlLoremFlickr({ category: 'fashion' })
    ),
    variants: faker.helpers.maybe(() =>
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        price: parseFloat(faker.commerce.price({ min: 20, max: 200 })),
        stockQuantity: faker.number.int({ min: 0, max: 50 }),
        attributes: {
          size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
          color: faker.color.human()
        }
      }))
    ),
    tags: Array.from(
      { length: faker.number.int({ min: 1, max: 4 }) },
      () => faker.commerce.productAdjective()
    ),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    salesCount: faker.number.int({ min: 0, max: 1000 }),
    rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
    featured: faker.helpers.maybe(() => true) ?? false,
    isNew,
    isBestSeller,
    colors: faker.helpers.arrayElements(colors, { min: 1, max: 4 }),
    sizes: faker.helpers.arrayElements(sizes, { min: 2, max: 6 }),
    stock: faker.number.int({ min: 0, max: 100 }),
    brand: faker.helpers.arrayElement(brands),
  }
}

export function getProducts(count = 50): Product[] {
  return Array(count).fill(null).map(() => generateProduct())
}

export function getProductStats(products: Product[]): ProductStats {
  const stats = products.reduce(
    (acc, product) => {
      acc.total++
      acc.totalValue += product.price * product.stockQuantity
      
      switch (product.status) {
        case 'active':
          acc.active++
          break
        case 'draft':
          acc.draft++
          break
        case 'archived':
          acc.archived++
          break
      }

      switch (product.stockStatus) {
        case 'low_stock':
          acc.lowStock++
          break
        case 'out_of_stock':
          acc.outOfStock++
          break
      }

      if (product.isBestSeller) {
        acc.bestSellers++
      }

      if (product.isNew) {
        acc.newProducts++
      }

      return acc
    },
    {
      total: 0,
      active: 0,
      draft: 0,
      archived: 0,
      lowStock: 0,
      outOfStock: 0,
      totalValue: 0,
      bestSellers: 0,
      newProducts: 0,
    }
  )

  return stats
}
