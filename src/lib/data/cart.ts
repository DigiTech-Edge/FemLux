import { Product } from '../types/products'

export interface CartItem extends Product {
  quantity: number
  selectedColor: string
  selectedSize: string
}

export const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "Women's Floral Summer Dress",
    description: "A beautiful floral dress perfect for summer days",
    price: 59.99,
    images: ["/image.png", "/image.png", "/image.png", "/image.png", "/image.png"],
    category: "Dresses",
    rating: 4.5,
    reviews: 128,
    isNew: true,
    isBestSeller: true,
    colors: ["Pink", "Blue", "White"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 50,
    brand: "FemLux",
    tags: ["Summer", "Casual", "Floral"],
    quantity: 2,
    selectedColor: "Pink",
    selectedSize: "M"
  },
  {
    id: 2,
    name: "Elegant Evening Gown",
    description: "A stunning evening gown for special occasions",
    price: 199.99,
    images: ["/image.png", "/image.png", "/image.png", "/image.png", "/image.png"],
    category: "Dresses",
    rating: 4.8,
    reviews: 89,
    isNew: false,
    isBestSeller: true,
    colors: ["Black", "Red", "Navy"],
    sizes: ["S", "M", "L"],
    stock: 25,
    brand: "Elegance",
    tags: ["Formal", "Evening", "Luxury"],
    quantity: 1,
    selectedColor: "Black",
    selectedSize: "S"
  }
]
