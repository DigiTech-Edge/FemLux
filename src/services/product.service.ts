'use server';

import { Query } from 'appwrite';
import { createBaseService } from './base.service';
import { Product } from '@/types/schema';
import { COLLECTIONS } from '@/lib/constants';

const baseService = createBaseService<Product>(COLLECTIONS.PRODUCTS);

interface ProductFilters {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    colors?: string[];
    sizes?: string[];
    inStock?: boolean;
}

export const productService = {
    ...baseService,

    searchProducts: async (query: string) => {
        return baseService.list([Query.search('name', query).toString()]);
    },

    getByCategory: async (categoryId: string) => {
        return baseService.list([Query.equal('categoryId', categoryId).toString()]);
    },

    getActiveProducts: async () => {
        return baseService.list([Query.equal('isActive', true).toString()]);
    },

    getNewArrivals: async (limit = 10) => {
        return baseService.list([
            Query.equal('isNew', true).toString(),
            Query.equal('isActive', true).toString(),
            Query.orderDesc('$createdAt').toString(),
            Query.limit(limit).toString()
        ]);
    },

    updateStock: async (id: string, quantity: number) => {
        const product = await baseService.getById(id);
        return baseService.update(id, {
            stock: product.stock - quantity
        });
    },

    getByFilters: async (filters: ProductFilters) => {
        const queries: string[] = [];

        if (filters.category) {
            queries.push(Query.equal('categoryId', filters.category).toString());
        }

        if (filters.brand) {
            queries.push(Query.equal('brand', filters.brand).toString());
        }

        if (filters.minPrice !== undefined) {
            queries.push(Query.greaterThanEqual('price', filters.minPrice).toString());
        }

        if (filters.maxPrice !== undefined) {
            queries.push(Query.lessThanEqual('price', filters.maxPrice).toString());
        }

        if (filters.colors && filters.colors.length > 0) {
            queries.push(Query.equal('colors', filters.colors).toString());
        }

        if (filters.sizes && filters.sizes.length > 0) {
            queries.push(Query.equal('sizes', filters.sizes).toString());
        }

        if (filters.inStock !== undefined) {
            queries.push(Query.greaterThan('stock', 0).toString());
        }

        return baseService.list(queries);
    }
};
