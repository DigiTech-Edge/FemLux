import { faker } from "@faker-js/faker";
import {
  AnalyticsStat,
  SalesData,
  ProductPerformanceData,
  CustomerSegment,
  CustomerRetention,
  OrderAnalytics,
  CategoryAnalytics,
  GeographicData,
} from "@/lib/types/analytics";

// Overview Statistics
export const overviewStats: AnalyticsStat[] = [
  {
    title: "Total Revenue",
    value: 128750,
    change: 12.5,
    changeType: "increase",
    timeRange: "month",
  },
  {
    title: "Total Orders",
    value: 1543,
    change: 8.2,
    changeType: "increase",
    timeRange: "month",
  },
  {
    title: "Average Order Value",
    value: 83.44,
    change: 4.1,
    changeType: "increase",
    timeRange: "month",
  },
  {
    title: "Active Customers",
    value: 892,
    change: -2.3,
    changeType: "decrease",
    timeRange: "month",
  },
];

// Sales Data (Last 12 months)
export const salesData: SalesData[] = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - i);
  return {
    date: date.toISOString().slice(0, 7), // YYYY-MM format
    revenue: faker.number.int({ min: 80000, max: 150000 }),
    orders: faker.number.int({ min: 800, max: 1500 }),
  };
}).reverse();

// Product Performance
export const productPerformance: ProductPerformanceData[] = Array.from(
  { length: 10 },
  () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    sales: faker.number.int({ min: 50, max: 500 }),
    revenue: faker.number.int({ min: 5000, max: 50000 }),
    growth: faker.number.int({ min: -20, max: 50 }),
    stock: faker.number.int({ min: 0, max: 100 }),
  })
);

// Customer Segments
export const customerSegments: CustomerSegment[] = [
  {
    segment: "New",
    count: 245,
    percentage: 27.5,
  },
  {
    segment: "Returning",
    count: 468,
    percentage: 52.5,
  },
  {
    segment: "Inactive",
    count: 179,
    percentage: 20,
  },
];

// Customer Retention (Last 6 months)
export const customerRetention: CustomerRetention[] = Array.from(
  { length: 6 },
  (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      month: date.toLocaleString("default", { month: "short" }),
      newCustomers: faker.number.int({ min: 50, max: 150 }),
      returningCustomers: faker.number.int({ min: 100, max: 300 }),
      churnRate: faker.number.float({ min: 2, max: 8, precision: 0.1 }),
    };
  }
).reverse();

// Order Analytics
export const orderAnalytics: OrderAnalytics[] = [
  {
    status: "Completed",
    count: 892,
    percentage: 57.8,
  },
  {
    status: "Processing",
    count: 384,
    percentage: 24.9,
  },
  {
    status: "Pending",
    count: 267,
    percentage: 17.3,
  },
];

// Category Performance
export const categoryAnalytics: CategoryAnalytics[] = [
  {
    category: "Dresses",
    sales: 892,
    revenue: 89200,
    growth: 15.4,
    averageOrderValue: 99.89,
  },
  {
    category: "Tops",
    sales: 645,
    revenue: 45150,
    growth: 8.7,
    averageOrderValue: 69.99,
  },
  {
    category: "Bottoms",
    sales: 478,
    revenue: 38240,
    growth: -2.3,
    averageOrderValue: 79.99,
  },
  {
    category: "Outerwear",
    sales: 234,
    revenue: 35100,
    growth: 25.8,
    averageOrderValue: 149.99,
  },
  {
    category: "Accessories",
    sales: 567,
    revenue: 22680,
    growth: 5.6,
    averageOrderValue: 39.99,
  },
];

// Geographic Data (Top 5 countries)
export const geographicData: GeographicData[] = [
  {
    country: "United States",
    orders: 567,
    revenue: 56700,
    customers: 423,
  },
  {
    country: "United Kingdom",
    orders: 234,
    revenue: 23400,
    customers: 178,
  },
  {
    country: "Canada",
    orders: 189,
    revenue: 18900,
    customers: 145,
  },
  {
    country: "Australia",
    orders: 156,
    revenue: 15600,
    customers: 112,
  },
  {
    country: "Germany",
    orders: 134,
    revenue: 13400,
    customers: 98,
  },
];
