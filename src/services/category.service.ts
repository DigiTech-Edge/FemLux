'use server';

import { Query } from 'appwrite';
import { createBaseService } from './base.service';
import { Category } from '@/types/schema';
import { COLLECTIONS } from '@/lib/constants';

const baseService = createBaseService<Category>(COLLECTIONS.CATEGORIES);

interface CategoryWithChildren extends Category {
    children: CategoryWithChildren[];
}

export const categoryService = {
    ...baseService,

    getActiveCategories: async () => {
        return baseService.list([Query.equal('isActive', true)]);
    },

    getParentCategories: async () => {
        return baseService.list([Query.isNull('parentId')]);
    },

    getSubcategories: async (parentId: string) => {
        return baseService.list([Query.equal('parentId', parentId)]);
    },

    updateItemCount: async (id: string, change: number) => {
        const category = await baseService.getById(id);
        return baseService.update(id, {
            itemCount: category.itemCount + change
        });
    },

    getCategoryTree: async () => {
        const allCategories = await baseService.list();
        const categoryMap = new Map<string, CategoryWithChildren>();

        // First pass: Create map entries for all categories
        allCategories.forEach(category => {
            categoryMap.set(category.$id, { ...category, children: [] });
        });

        // Second pass: Build the tree structure
        const rootCategories: CategoryWithChildren[] = [];
        allCategories.forEach(category => {
            if (category.parentId) {
                const parent = categoryMap.get(category.parentId);
                if (parent) {
                    parent.children.push(categoryMap.get(category.$id)!);
                }
            } else {
                rootCategories.push(categoryMap.get(category.$id)!);
            }
        });

        return rootCategories;
    },

    toggleCategoryStatus: async (id: string) => {
        const category = await baseService.getById(id);
        return baseService.update(id, {
            isActive: !category.isActive
        });
    },

    searchCategories: async (query: string) => {
        return baseService.list([Query.search('name', query)]);
    }
};
