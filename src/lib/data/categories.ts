import { Category } from '../types/products'

export const categories: Category[] = [
  {
    id: 1,
    name: "Dresses",
    description: "Elegant dresses for every occasion",
    image: "/images/categories/dresses.jpg",
    itemCount: 48,
    featured: true
  },
  {
    id: 2,
    name: "Tops",
    description: "Stylish tops and blouses",
    image: "/images/categories/tops.jpg",
    itemCount: 36,
    featured: true
  },
  {
    id: 3,
    name: "Bottoms",
    description: "Pants, skirts, and shorts",
    image: "/images/categories/bottoms.jpg",
    itemCount: 24,
    featured: false
  },
  {
    id: 4,
    name: "Accessories",
    description: "Complete your look with our accessories",
    image: "/images/categories/accessories.jpg",
    itemCount: 32,
    featured: true
  },
  {
    id: 5,
    name: "Shoes",
    description: "Footwear for every style",
    image: "/images/categories/shoes.jpg",
    itemCount: 28,
    featured: false
  }
];
