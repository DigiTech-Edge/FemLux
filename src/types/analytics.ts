export type ChangeType = "increase" | "decrease";
export type TimeRange =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "last3months"
  | "last6months"
  | "thisYear"
  | "lastYear"
  | "all";

export interface AnalyticsStat {
  title: string;
  value: number;
  change: number;
  changeType: ChangeType;
  timeRange: TimeRange;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductPerformanceData {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
  stock: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
}

export interface CustomerRetention {
  month: string;
  newCustomers: number;
  returningCustomers: number;
  churnRate: number;
}

export interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface CategoryAnalytics {
  category: string;
  sales: number;
  revenue: number;
  growth: number;
  averageOrderValue: number;
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export interface ProductAnalytics {
  totalProducts: number;
  totalVariants: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    totalOrders: number;
    totalRevenue: number;
  }>;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  customerRetentionRate: number;
  topCustomers: Array<{
    id: string;
    name: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

export interface Analytics {
  orders: OrderAnalytics;
  products: ProductAnalytics;
  customers: CustomerAnalytics;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  growth: {
    revenue: number;
    orders: number;
    customers: number;
    averageOrderValue: number;
  };
  categoryAnalytics: Array<CategoryAnalytics>;
}
