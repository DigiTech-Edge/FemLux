'use server';

import { ID, Query, type Models } from 'appwrite';
import { databases, DATABASE_ID } from '@/utils/appwrite';

export interface BaseModel extends Models.Document {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    $collectionId: string;
    $databaseId: string;
}

type FilterValue = string | number | boolean | string[] | number[] | null;

export const createBaseService = <T extends BaseModel>(collectionId: string) => {
    const create = async (data: Omit<T, keyof BaseModel>): Promise<T> => {
        const response = await databases.createDocument(
            DATABASE_ID,
            collectionId,
            ID.unique(),
            data as object
        );
        return response as T;
    };

    const update = async (id: string, data: Partial<Omit<T, keyof BaseModel>>): Promise<T> => {
        const response = await databases.updateDocument(
            DATABASE_ID,
            collectionId,
            id,
            data as object
        );
        return response as T;
    };

    const remove = async (id: string): Promise<boolean> => {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                collectionId,
                id
            );
            return true;
        } catch {
            return false;
        }
    };

    const getById = async (id: string): Promise<T> => {
        const response = await databases.getDocument(
            DATABASE_ID,
            collectionId,
            id
        );
        return response as T;
    };

    const list = async (queries: string[] = []): Promise<T[]> => {
        const response = await databases.listDocuments(
            DATABASE_ID,
            collectionId,
            queries
        );
        return response.documents as T[];
    };

    const buildQuery = (options: {
        filters?: Record<string, FilterValue>;
        sort?: { field: string; direction: 'asc' | 'desc' }[];
        limit?: number;
        offset?: number;
    }): string[] => {
        const queries: string[] = [];

        if (options.filters) {
            Object.entries(options.filters).forEach(([field, value]) => {
                if (value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        queries.push(Query.equal(field, value).toString());
                    } else {
                        queries.push(Query.equal(field, value).toString());
                    }
                }
            });
        }

        if (options.sort) {
            options.sort.forEach(({ field, direction }) => {
                queries.push(
                    (direction === 'asc' ? Query.orderAsc(field) : Query.orderDesc(field)).toString()
                );
            });
        }

        if (options.limit) {
            queries.push(Query.limit(options.limit).toString());
        }

        if (options.offset) {
            queries.push(Query.offset(options.offset).toString());
        }

        return queries;
    };

    return {
        create,
        update,
        remove,
        getById,
        list,
        buildQuery
    };
};
