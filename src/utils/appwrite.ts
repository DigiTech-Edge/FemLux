import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Collection IDs
export const Collections = {
    USERS: 'users',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    CATEGORIES: 'categories',
    FAVORITES: 'favorites'
} as const;

// Bucket IDs
export const Buckets = {
    PRODUCT_IMAGES: process.env.APPWRITE_PRODUCT_IMAGES_BUCKET!,
    USER_IMAGES: process.env.APPWRITE_USER_IMAGES_BUCKET!,
    CATEGORIES_BANNERS: process.env.APPWRITE_CATEGORIES_BANNERS_IMAGES_BUCKET!
} as const;

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;

export type CollectionName = keyof typeof Collections;
export type BucketName = keyof typeof Buckets;

export default client;
