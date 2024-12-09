import { DashboardData } from "@/types/dashboard";
import { prisma } from "@/utils/prisma";

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Fetch all required data concurrently
  const [
    currentMonthOrders,
    lastMonthOrders,
    products,
    recentOrders,
    monthlyOrders,
  ] = await Promise.all([
    // Current month orders
    prisma.order.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),

    // Last month orders
    prisma.order.count({
      where: {
        createdAt: {
          gte: lastMonth,
          lt: startOfMonth,
        },
      },
    }),

    // Products with their order items
    prisma.product.findMany({
      include: {
        variants: true,
        orderItems: {
          include: {
            order: true,
          },
        },
      },
      take: 5,
      orderBy: {
        orderItems: {
          _count: "desc",
        },
      },
    }),

    // Recent orders
    prisma.order.findMany({
      include: {
        profile: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    // Monthly orders data
    prisma.order.groupBy({
      by: ["createdAt"],
      _sum: {
        totalAmount: true,
      },
      _count: true,
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 11, 1),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  // Calculate order growth
  const orderGrowth =
    lastMonthOrders > 0
      ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
      : 0;

  // Process stats
  const stats = [
    {
      title: "Total Orders",
      value: currentMonthOrders,
      change: orderGrowth,
      type: "orders" as const,
    },
    {
      title: "Total Sales",
      value: monthlyOrders.reduce(
        (sum, order) => sum + Number(order._sum.totalAmount || 0),
        0
      ),
      change: orderGrowth, // TODO: Calculate sales growth
      type: "sales" as const,
    },
    {
      title: "Average Order",
      value:
        currentMonthOrders === 0
          ? 0
          : monthlyOrders.reduce(
              (sum, order) => sum + Number(order._sum.totalAmount || 0),
              0
            ) / currentMonthOrders,
      change: 0, // TODO: Calculate average order growth
      type: "average" as const,
    },
    {
      title: "Active Customers",
      value: await prisma.profile.count({
        where: {
          orders: {
            some: {
              createdAt: {
                gte: startOfMonth,
              },
            },
          },
        },
      }),
      change: 0, // TODO: Calculate customer growth
      type: "visitors" as const,
    },
  ];

  // Process sales data
  const salesData = monthlyOrders.reduce(
    (
      acc: Array<{
        month: string;
        sales: number;
        orders: number;
      }>,
      entry
    ) => {
      const monthKey = entry.createdAt.toLocaleString("default", {
        month: "long",
      });
      const existingMonth = acc.find((item) => item.month === monthKey);

      if (existingMonth) {
        existingMonth.sales += Number(entry._sum.totalAmount || 0);
        existingMonth.orders += entry._count;
      } else {
        acc.push({
          month: monthKey,
          sales: Number(entry._sum.totalAmount || 0),
          orders: entry._count,
        });
      }

      return acc;
    },
    []
  );

  // Process top products
  const topProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    sales: product.orderItems.length,
    growth: 0, // TODO: Calculate product growth
  }));

  // Process recent orders
  const recentOrdersData = recentOrders.map((order) => ({
    id: order.id,
    customer: {
      name: order.profile.fullName || order.profile.email.split("@")[0],
      email: order.profile.email,
      avatar: order.profile.avatarUrl || `/images/default-avatar.png`,
    },
    amount: Number(order.totalAmount),
    status: (order.status.toLowerCase() === "shipped" ||
    order.status.toLowerCase() === "delivered"
      ? "completed"
      : order.status.toLowerCase()) as
      | "pending"
      | "processing"
      | "completed"
      | "cancelled",
    date: order.createdAt.toISOString(),
  }));

  return {
    stats,
    salesData,
    topProducts,
    recentOrders: recentOrdersData,
  };
}
