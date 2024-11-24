import { ID, Query, type Models } from 'appwrite';
import { databases } from '@/models/client/config';
import { NAMES } from '@/models/name';

export interface BaseModel extends Models.Document {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
}

type FilterValue = string | number | boolean | string[];

export const createBaseService = <T extends BaseModel>(collectionId: string) => {
    const create = async (data: Omit<T, keyof BaseModel>): Promise<T> => {
        const response = await databases.createDocument(
            NAMES.database.id,
            collectionId,
            ID.unique(),
            data as object
        );
        return response as T;
    };

    const update = async (id: string, data: Partial<Omit<T, keyof BaseModel>>): Promise<T> => {
        const response = await databases.updateDocument(
            NAMES.database.id,
            collectionId,
            id,
            data as object
        );
        return response as T;
    };

    const remove = async (id: string): Promise<boolean> => {
        try {
            await databases.deleteDocument(
                NAMES.database.id,
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
            NAMES.database.id,
            collectionId,
            id
        );
        return response as T;
    };

    const list = async (queries: string[] = []): Promise<T[]> => {
        const response = await databases.listDocuments(
            NAMES.database.id,
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
