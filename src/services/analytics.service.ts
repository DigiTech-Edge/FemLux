import { Analytics, TimeRange } from "@/types/analytics";
import { prisma } from "@/utils/prisma";

export async function getAnalytics(timePeriod: TimeRange): Promise<Analytics> {
  const now = new Date();
  let startDate: Date;
  let previousPeriodStart: Date;

  // Calculate start date based on time period
  switch (timePeriod) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      previousPeriodStart = new Date(startDate);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
      break;
    case "yesterday":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      previousPeriodStart = new Date(startDate);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
      break;
    case "last7days":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      previousPeriodStart = new Date(startDate);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
      break;
    case "last30days":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
      previousPeriodStart = new Date(startDate);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);
      break;
    case "thisMonth":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    case "lastMonth":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      break;
    case "last3months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      break;
    case "last6months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 12, 1);
      break;
    case "thisYear":
      startDate = new Date(now.getFullYear(), 0, 1);
      previousPeriodStart = new Date(now.getFullYear() - 1, 0, 1);
      break;
    case "lastYear":
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      previousPeriodStart = new Date(now.getFullYear() - 2, 0, 1);
      break;
    case "all":
      startDate = new Date(0);
      previousPeriodStart = new Date(0);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  }

  // Fetch current period data
  const [
    currentPeriodOrders,
    previousPeriodOrders,
    currentPeriodCustomers,
    previousPeriodCustomers,
    topProducts,
    ordersByStatus,
    revenueByMonth,
    categories,
    topCustomers,
    productVariants,
  ] = await Promise.all([
    // Current period orders
    prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: true,
      _sum: {
        totalAmount: true,
      },
    }),

    // Previous period orders
    prisma.order.aggregate({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
      _count: true,
      _sum: {
        totalAmount: true,
      },
    }),

    // Current period customers
    prisma.profile.count({
      where: {
        orders: {
          some: {
            createdAt: {
              gte: startDate,
            },
          },
        },
      },
    }),

    // Previous period customers
    prisma.profile.count({
      where: {
        orders: {
          some: {
            createdAt: {
              gte: previousPeriodStart,
              lt: startDate,
            },
          },
        },
      },
    }),

    // Top selling products
    prisma.product.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        orderItems: {
          where: {
            order: {
              createdAt: {
                gte: startDate,
              },
            },
          },
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

    // Orders by status
    prisma.order.groupBy({
      by: ["status"],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: true,
    }),

    // Revenue by month
    prisma.order.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: true,
    }),

    // Category analytics
    prisma.category.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      include: {
        products: {
          where: {
            isActive: true,
            deletedAt: null,
          },
          include: {
            orderItems: {
              where: {
                order: {
                  createdAt: {
                    gte: startDate,
                  },
                },
              },
              include: {
                order: true,
              },
            },
          },
        },
      },
    }),

    // Top customers
    prisma.profile.findMany({
      include: {
        orders: {
          where: {
            createdAt: {
              gte: startDate,
            },
          },
        },
      },
      take: 5,
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
    }),

    // Product variants
    prisma.productVariant.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
    }),
  ]);

  // Calculate growth percentages
  const revenueGrowth =
    previousPeriodOrders._sum.totalAmount &&
    Number(previousPeriodOrders._sum.totalAmount) > 0
      ? ((Number(currentPeriodOrders._sum.totalAmount || 0) -
          Number(previousPeriodOrders._sum.totalAmount)) /
          Number(previousPeriodOrders._sum.totalAmount)) *
        100
      : 0;

  const ordersGrowth =
    previousPeriodOrders._count > 0
      ? ((currentPeriodOrders._count - previousPeriodOrders._count) /
          previousPeriodOrders._count) *
        100
      : 0;

  const customersGrowth =
    previousPeriodCustomers > 0
      ? ((currentPeriodCustomers - previousPeriodCustomers) /
          previousPeriodCustomers) *
        100
      : 0;

  const averageOrderValue =
    currentPeriodOrders._count > 0
      ? Number(currentPeriodOrders._sum.totalAmount || 0) /
        currentPeriodOrders._count
      : 0;

  const previousAverageOrderValue =
    previousPeriodOrders._count > 0
      ? Number(previousPeriodOrders._sum.totalAmount || 0) /
        previousPeriodOrders._count
      : 0;

  const averageOrderValueGrowth =
    previousAverageOrderValue > 0
      ? ((averageOrderValue - previousAverageOrderValue) /
          previousAverageOrderValue) *
        100
      : 0;

  // Process orders by status
  const orderStatusCounts = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  ordersByStatus.forEach((status) => {
    const key = status.status.toLowerCase();
    if (key in orderStatusCounts) {
      orderStatusCounts[key as keyof typeof orderStatusCounts] = status._count;
    }
  });

  // Process revenue by month
  const monthlyRevenue = revenueByMonth.map((entry) => ({
    month: entry.createdAt.toLocaleString("default", { month: "long" }),
    revenue: Number(entry._sum.totalAmount || 0),
    orders: entry._count,
  }));

  // Process category analytics
  const categoryStats = categories.map((category) => {
    const totalRevenue = category.products.reduce(
      (sum, product) =>
        sum +
        product.orderItems.reduce(
          (itemSum, item) => itemSum + Number(item.order.totalAmount),
          0
        ),
      0
    );

    const totalOrders = category.products.reduce(
      (sum, product) => sum + product.orderItems.length,
      0
    );

    return {
      category: category.name,
      sales: totalOrders,
      revenue: totalRevenue,
      growth: 0, // TODO: Add historical comparison
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  });

  // Get new customers count
  const newCustomersCount = await prisma.profile.count({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
  });

  // Get total customers count
  const totalCustomersCount = await prisma.profile.count();

  // Process top customers
  const processedTopCustomers = topCustomers.map((customer) => ({
    id: customer.id,
    name: customer.fullName || customer.email.split("@")[0],
    totalOrders: customer.orders.length,
    totalSpent: customer.orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    ),
  }));

  return {
    orders: {
      totalOrders: currentPeriodOrders._count,
      totalRevenue: Number(currentPeriodOrders._sum.totalAmount || 0),
      averageOrderValue,
      ordersByStatus: orderStatusCounts,
    },
    customers: {
      activeCustomers: currentPeriodCustomers,
      totalCustomers: totalCustomersCount,
      newCustomersThisMonth: newCustomersCount,
      customerRetentionRate:
        (currentPeriodCustomers / totalCustomersCount) * 100,
      topCustomers: processedTopCustomers,
    },
    growth: {
      revenue: revenueGrowth,
      orders: ordersGrowth,
      customers: customersGrowth,
      averageOrderValue: averageOrderValueGrowth,
    },
    products: {
      totalProducts: await prisma.product.count({
        where: {
          isActive: true,
          deletedAt: null,
        },
      }),
      totalVariants: productVariants.length,
      lowStockProducts: productVariants.filter((v) => v.stock <= 10).length,
      outOfStockProducts: productVariants.filter((v) => v.stock === 0).length,
      topSellingProducts: topProducts.map((product) => ({
        id: product.id,
        name: product.name,
        totalOrders: product.orderItems.length,
        totalRevenue: product.orderItems.reduce(
          (sum, item) => sum + Number(item.order.totalAmount),
          0
        ),
      })),
    },
    revenueByMonth: monthlyRevenue,
    categoryAnalytics: categoryStats,
  };
}
