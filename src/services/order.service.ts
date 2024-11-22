'use server';

import { Query } from 'appwrite';
import { createBaseService, BaseModel } from './base.service';
import { Order } from '@/types/schema';
import { COLLECTIONS } from '@/lib/constants';

const baseService = createBaseService<Order>(COLLECTIONS.ORDERS);

export const orderService = {
    ...baseService,

    getUserOrders: async (userId: string) => {
        return baseService.list([
            Query.equal('userId', userId).toString(),
            Query.orderDesc('$createdAt').toString()
        ]);
    },

    getOrdersByStatus: async (status: Order['status']) => {
        return baseService.list([Query.equal('status', status).toString()]);
    },

    updateOrderStatus: async (id: string, status: Order['status']) => {
        return baseService.update(id, { status });
    },

    addTrackingInfo: async (id: string, trackingNumber: string, estimatedDelivery: string) => {
        return baseService.update(id, {
            trackingNumber,
            estimatedDelivery,
            status: 'shipped'
        });
    },

    getRecentOrders: async (limit = 10) => {
        return baseService.list([
            Query.orderDesc('$createdAt').toString(),
            Query.limit(limit).toString()
        ]);
    },

    getOrderStats: async () => {
        const [
            pending,
            processing,
            shipped,
            delivered,
            cancelled
        ] = await Promise.all([
            baseService.list([Query.equal('status', 'pending').toString()]),
            baseService.list([Query.equal('status', 'processing').toString()]),
            baseService.list([Query.equal('status', 'shipped').toString()]),
            baseService.list([Query.equal('status', 'delivered').toString()]),
            baseService.list([Query.equal('status', 'cancelled').toString()])
        ]);

        return {
            pending: pending.length,
            processing: processing.length,
            shipped: shipped.length,
            delivered: delivered.length,
            cancelled: cancelled.length,
            total: pending.length + processing.length + shipped.length + delivered.length + cancelled.length
        };
    },

    createOrder: async (orderData: Omit<Order, keyof BaseModel>) => {
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        return baseService.create({
            ...orderData,
            orderNumber,
            date: new Date().toISOString()
        });
    }
};
