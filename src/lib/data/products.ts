import { Product, Category } from '../types/products'

export const products: Product[] = [
  {
    id: 1,
    name: "Women's Floral Summer Dress",
    description: "A beautiful floral dress perfect for summer days",
    price: 59.99,
    images: [
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png"
    ],
    category: "Dresses",
    rating: 4.5,
    reviews: 128,
    isNew: true,
    isBestSeller: true,
    colors: ["Pink", "Blue", "White"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 50,
    brand: "FemLux",
    tags: ["Summer", "Casual", "Floral"]
  },
  {
    id: 2,
    name: "Elegant Evening Gown",
    description: "A stunning evening gown for special occasions",
    price: 199.99,
    images: [
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png"
    ],
    category: "Dresses",
    rating: 4.8,
    reviews: 89,
    isNew: false,
    isBestSeller: true,
    colors: ["Black", "Red", "Navy"],
    sizes: ["S", "M", "L"],
    stock: 25,
    brand: "Elegance",
    tags: ["Formal", "Evening", "Luxury"]
  },
  {
    id: 3,
    name: "Classic Denim Jeans",
    description: "High-quality denim jeans with perfect fit",
    price: 79.99,
    images: [
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png"
    ],
    category: "Bottoms",
    rating: 4.6,
    reviews: 256,
    isNew: false,
    isBestSeller: true,
    colors: ["Blue", "Black", "Gray"],
    sizes: ["2", "4", "6", "8", "10"],
    stock: 100,
    brand: "DenimCo",
    tags: ["Casual", "Everyday", "Denim"]
  },
  {
    id: 4,
    name: "Silk Blouse",
    description: "Luxurious silk blouse for professional settings",
    price: 89.99,
    images: [
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png"
    ],
    category: "Tops",
    rating: 4.4,
    reviews: 67,
    isNew: true,
    isBestSeller: false,
    colors: ["White", "Cream", "Pink"],
    sizes: ["XS", "S", "M", "L"],
    stock: 35,
    brand: "LuxeSilk",
    tags: ["Professional", "Elegant", "Office"]
  },
  {
    id: 5,
    name: "Leather Jacket",
    description: "Classic leather jacket with modern details",
    price: 199.99,
    images: [
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png"
    ],
    category: "Outerwear",
    rating: 4.7,
    reviews: 182,
    isNew: false,
    isBestSeller: true,
    colors: ["Black", "Brown"],
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
    brand: "LeatherLux",
    tags: ["Casual", "Edgy", "Fall"]
  },
  {
    id: 6,
    name: "Summer Shorts",
    description: "Comfortable cotton shorts for casual wear",
    price: 39.99,
    images: [
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png"
    ],
    category: "Bottoms",
    rating: 4.3,
    reviews: 94,
    isNew: true,
    isBestSeller: false,
    colors: ["Khaki", "Navy", "White"],
    sizes: ["2", "4", "6", "8"],
    stock: 75,
    brand: "FemLux",
    tags: ["Summer", "Casual", "Comfortable"]
  },
  {
    id: 7,
    name: "Workout Leggings",
    description: "High-performance leggings for active lifestyle",
    price: 49.99,
    images: [
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png"
    ],
    category: "Activewear",
    rating: 4.6,
    reviews: 315,
    isNew: true,
    isBestSeller: true,
    colors: ["Black", "Gray", "Purple"],
    sizes: ["XS", "S", "M", "L"],
    stock: 150,
    brand: "ActiveFit",
    tags: ["Athletic", "Workout", "Comfortable"]
  },
  {
    id: 8,
    name: "Cashmere Sweater",
    description: "Luxuriously soft cashmere sweater",
    price: 149.99,
    images: [
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png",
      "/image.png"
    ],
    category: "Tops",
    rating: 4.9,
    reviews: 76,
    isNew: false,
    isBestSeller: false,
    colors: ["Beige", "Gray", "Black"],
    sizes: ["S", "M", "L"],
    stock: 30,
    brand: "LuxeCashmere",
    tags: ["Winter", "Luxury", "Cozy"]
  }
]

export const categories: Category[] = [
  {
    id: 1,
    name: "Dresses",
    image: "/image.png",
    itemCount: 48,
    featured: true
  },
  {
    id: 2,
    name: "Tops",
    image: "/image.png",
    itemCount: 36,
    featured: true
  },
  {
    id: 3,
    name: "Bottoms",
    image: "/image.png",
    itemCount: 24,
    featured: true
  },
  {
    id: 4,
    name: "Outerwear",
    image: "/image.png",
    itemCount: 18,
    featured: true
  },
  {
    id: 5,
    name: "Activewear",
    image: "/image.png",
    itemCount: 15,
    featured: false
  }
]
