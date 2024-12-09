import { CustomerStats, CustomerWithOrders } from "@/types/customer";
import { prisma } from "@/utils/prisma";

export async function getCustomers(): Promise<CustomerWithOrders[]> {
  try {
    const customers = await prisma.profile.findMany({
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            createdAt: true,
            status: true,
            totalAmount: true,
            shippingAddress: true,
            phoneNumber: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return customers.map((customer) => {
      const latestOrder = customer.orders[0];
      return {
        id: customer.id,
        name: customer.fullName || customer.email.split("@")[0],
        email: customer.email,
        avatar: customer.avatarUrl || `/images/default-avatar.png`,
        status: customer.deletedAt ? "blocked" : "active",
        totalOrders: customer.orders.length,
        totalSpent: customer.orders.reduce(
          (sum, order) => sum + Number(order.totalAmount),
          0
        ),
        dateJoined: customer.createdAt.toISOString(),
        lastOrderDate: latestOrder?.createdAt.toISOString() || "No orders yet",
        address: latestOrder
          ? (latestOrder.shippingAddress as { address: string }).address
          : "No address provided",
        phone: latestOrder?.phoneNumber || "N/A",
        orders: customer.orders.map((order) => ({
          ...order,
          totalAmount: Number(order.totalAmount),
          status: order.status as
            | "PENDING"
            | "PROCESSING"
            | "SHIPPED"
            | "DELIVERED"
            | "CANCELLED",
        })),
      };
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Failed to fetch customers");
  }
}

export async function getCustomerStats(): Promise<CustomerStats> {
  try {
    const [totalCustomers, activeCustomers, orders] = await Promise.all([
      // Total customers
      prisma.profile.count(),
      // Active customers (not blocked)
      prisma.profile.count({
        where: {
          deletedAt: null,
        },
      }),

      // All orders for revenue calculations
      prisma.order.findMany({
        select: {
          totalAmount: true,
        },
      }),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );
    const averageOrderValue =
      orders.length > 0 ? totalRevenue / orders.length : 0;

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
      averageOrderValue,
    };
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    throw new Error("Failed to fetch customer statistics");
  }
}
