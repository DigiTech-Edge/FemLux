// Constants for Appwrite resources

export const NAMES = {
  database: {
    id: "femlux",
    collections: {
      products: "products",
      categories: "categories",
      orders: "orders",
      reviews: "reviews",
      banners: "banners",
      favorites: "favorites",
    },
  },
  storage: {
    buckets: {
      productImages: "product-images",
      categoryImages: "category-images",
      avatars: "user-avatars",
    },
  },
} as const;

// Database
export const db = NAMES.database.id;

// Collections
export const productCollection = NAMES.database.collections.products;
export const categoryCollection = NAMES.database.collections.categories;
export const orderCollection = NAMES.database.collections.orders;
export const reviewCollection = NAMES.database.collections.reviews;
export const bannerCollection = NAMES.database.collections.banners;
export const favoriteCollection = NAMES.database.collections.favorites;

// Storage Buckets
export const productImagesBucket = NAMES.storage.buckets.productImages;
export const categoryImagesBucket = NAMES.storage.buckets.categoryImages;
export const avatarsBucket = NAMES.storage.buckets.avatars;
