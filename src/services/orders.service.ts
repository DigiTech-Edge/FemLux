import { prisma } from "@/utils/prisma";
import { CartItem } from "@/store/cart";
import env from "@/env";
import { OrderStatus } from "@prisma/client";
import { headers } from "next/headers";
import { generateOrderNumber } from "@/helpers/orderNumber";
import { Order } from "@/types/orders";

interface CreatePaymentLinkParams {
  email: string;
  amount: number;
  metadata: {
    userId: string;
    items: CartItem[];
    shippingAddress: string;
    phoneNumber: string;
  };
}

const createPaymentLink = async ({
  email,
  amount,
  metadata,
}: CreatePaymentLinkParams) => {
  try {
    const origin = (await headers()).get("origin");
    console.log(origin, env.paystack.secretKey);
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.paystack.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Convert to kobo/cents
          metadata,
          callback_url: `${origin}/checkout/verify`,
        }),
      }
    );

    const data = await response.json();
    if (!data.status) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error("Error creating payment link:", error);
    throw error;
  }
};

const verifyPayment = async (reference: string) => {
  try {
    // First verify with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${env.paystack.secretKey}`,
        },
      }
    );

    const data = await response.json();
    if (!data.status || data.data.status !== "success") {
      throw new Error("Payment verification failed");
    }

    const { metadata, amount } = data.data;
    if (!metadata || !metadata.userId) {
      throw new Error("Invalid payment metadata");
    }

    // Create order in database
    const orderNumber = await generateOrderNumber();
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: metadata.userId,
        totalAmount: amount / 100,
        shippingAddress: metadata.shippingAddress,
        phoneNumber: metadata.phoneNumber,
        status: OrderStatus.PENDING,
        items: {
          create: metadata.items.map((item: CartItem) => ({
            productId: item.productId,
            variantId: item.variant.id,
            quantity: Number(item.quantity),
            price: item.variant.price,
            size: item.variant.size,
            productName: item.product.name,
            productImage: item.product.images[0],
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Convert Decimal to number
    const serializedOrder = JSON.parse(
      JSON.stringify(order, (_, value) =>
        typeof value === "object" &&
        value !== null &&
        "type" in value &&
        value.type === "Decimal"
          ? Number(value.toString())
          : value
      )
    );

    return { paymentVerified: true, order: serializedOrder };
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

// Admin functions
const getOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        profile: {
          select: {
            fullName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to number and format data
    const formattedOrders: Order[] = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      shippingAddress: JSON.stringify(order.shippingAddress),
      phoneNumber: order.phoneNumber,
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingNumber: order.trackingNumber,
      user: {
        name: order.profile.fullName ?? "",
        email: order.profile.email ?? "",
        image: order.profile.avatarUrl,
      },
    }));

    return formattedOrders;
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
};

const getOrderStats = async () => {
  try {
    const [totalOrders, deliveredOrders, pendingOrders, shippedOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({
          where: { status: "DELIVERED" },
        }),
        prisma.order.count({
          where: { status: "PENDING" },
        }),
        prisma.order.count({
          where: { status: "SHIPPED" },
        }),
      ]);

    return {
      totalOrders,
      deliveredOrders,
      pendingOrders,
      shippedOrders,
    };
  } catch (error) {
    console.error("Error getting order stats:", error);
    throw error;
  }
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: true,
        profile: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
      user: {
        name: order.profile.fullName,
        email: order.profile.email,
        image: order.profile.avatarUrl,
      },
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

const updateOrderTracking = async (orderId: string, trackingNumber: string) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber,
        status: "PROCESSING",
      },
      include: {
        items: true,
        profile: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
      user: {
        name: order.profile.fullName,
        email: order.profile.email,
        image: order.profile.avatarUrl,
      },
    };
  } catch (error) {
    console.error("Error updating order tracking:", error);
    throw error;
  }
};

const getUserOrders = async (userId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        profile: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
      user: {
        name: order.profile.fullName || "",
        email: order.profile.email,
        image: order.profile.avatarUrl,
      },
    }));
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw error;
  }
};

export const ordersService = {
  createPaymentLink,
  verifyPayment,
  getOrders,
  getOrderStats,
  updateOrderStatus,
  updateOrderTracking,
  getUserOrders,
};
