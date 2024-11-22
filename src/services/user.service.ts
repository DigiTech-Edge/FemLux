'use server';

import { Query } from 'appwrite';
import { createBaseService, BaseModel } from './base.service';
import { User } from '@/types/schema';
import { COLLECTIONS } from '@/lib/constants';

const baseService = createBaseService<User>(COLLECTIONS.USERS);

interface UserFilters {
    role?: User['role'];
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
}

export const userService = {
    ...baseService,

    getUserByEmail: async (email: string) => {
        const users = await baseService.list([Query.equal('email', email).toString()]);
        return users[0] || null;
    },

    searchUsers: async (query: string) => {
        return baseService.list([
            Query.search('name', query).toString(),
            Query.orderDesc('$createdAt').toString()
        ]);
    },

    updateUserRole: async (id: string, role: User['role']) => {
        return baseService.update(id, { role });
    },

    updateUserProfile: async (id: string, data: Partial<Omit<User, keyof BaseModel>>) => {
        return baseService.update(id, data);
    },

    getAdminUsers: async () => {
        return baseService.list([Query.equal('role', 'admin').toString()]);
    },

    getRecentUsers: async (limit = 10) => {
        return baseService.list([
            Query.orderDesc('$createdAt').toString(),
            Query.limit(limit).toString()
        ]);
    },

    getUserStats: async () => {
        const [admins, customers] = await Promise.all([
            baseService.list([Query.equal('role', 'admin').toString()]),
            baseService.list([Query.equal('role', 'customer').toString()])
        ]);

        return {
            admins: admins.length,
            customers: customers.length,
            total: admins.length + customers.length
        };
    },

    createUser: async (userData: Omit<User, keyof BaseModel>) => {
        return baseService.create(userData);
    },

    searchUsersByFilters: async (filters: UserFilters) => {
        const queries: string[] = [];

        if (filters.role) {
            queries.push(Query.equal('role', filters.role).toString());
        }

        if (filters.startDate) {
            queries.push(Query.greaterThanEqual('$createdAt', filters.startDate).toString());
        }

        if (filters.endDate) {
            queries.push(Query.lessThanEqual('$createdAt', filters.endDate).toString());
        }

        if (filters.searchTerm) {
            queries.push(Query.search('name', filters.searchTerm).toString());
        }

        queries.push(Query.orderDesc('$createdAt').toString());

        return baseService.list(queries);
    }
};
