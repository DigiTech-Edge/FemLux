import { Models } from 'appwrite';

// Base model that includes Appwrite's default fields
export interface BaseModel extends Models.Document {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    $collectionId: string;
    $databaseId: string;
}

interface Preferences {
    notifications: {
        email: boolean;
        orderUpdates: boolean;
        promotions: boolean;
    };
    privacy: {
        profileVisibility: 'public' | 'private';
        showOrderHistory: boolean;
    };
}

// User model combining Appwrite User fields and our custom fields
export interface User extends BaseModel {
    email: string;
    name: string;
    role: 'admin' | 'user';
    avatar?: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    dateJoined: string;
    preferences?: Preferences;
    emailVerification: boolean;
    phoneVerification: boolean;
    status: boolean;
}

export interface Product extends BaseModel {
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    category: string;
    brand: string;
    colors: string[];
    sizes: string[];
    isActive: boolean;
    rating: number;
    reviews: number;
    isNew: boolean;
    categoryId: string; // Reference to Categories collection
}

export interface Order extends BaseModel {
    orderNumber: string;
    userId: string; // Reference to Users collection
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: {
        productId: string; // Reference to Products collection
        quantity: number;
        price: number;
        name: string;
        image: string;
    }[];
    total: number;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    trackingNumber?: string;
    estimatedDelivery?: string;
}

export interface Category extends BaseModel {
    name: string;
    description: string;
    image: string;
    itemCount: number;
    isActive: boolean;
    parentId?: string; // Self-reference for subcategories
}

export interface Favorite extends BaseModel {
    userId: string; // Reference to Users collection
    productId: string; // Reference to Products collection
    dateAdded: string;
    note?: string;
}
