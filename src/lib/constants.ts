export const COLLECTIONS = {
    USERS: 'users',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    CATEGORIES: 'categories',
    FAVORITES: 'favorites'
} as const;

export const BUCKETS = {
    PRODUCT_IMAGES: process.env.APPWRITE_PRODUCT_IMAGES_BUCKET!,
    USER_IMAGES: process.env.APPWRITE_USER_IMAGES_BUCKET!,
    CATEGORIES_BANNERS: process.env.APPWRITE_CATEGORIES_BANNERS_IMAGES_BUCKET!,
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
export type BucketName = keyof typeof BUCKETS;
