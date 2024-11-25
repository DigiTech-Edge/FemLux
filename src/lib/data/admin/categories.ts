import { faker } from '@faker-js/faker'
import type { Category } from '@/lib/types/products'

const categoryNames = [
  'Dresses',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Accessories',
  'Shoes',
  'Bags',
  'Jewelry'
]

function generateCategory(): Category {
  const name = faker.helpers.arrayElement(categoryNames)
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name,
    description: faker.commerce.productDescription(),
    image: faker.image.urlLoremFlickr({ category: 'fashion' }),
    itemCount: faker.number.int({ min: 10, max: 200 }),
    featured: faker.datatype.boolean(),
  }
}

export async function getCategories(count = 8): Promise<Category[]> {
  return Array.from({ length: count }, generateCategory)
}
