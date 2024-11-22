export type TimeRange = "today" | "week" | "month" | "year";

export interface AnalyticsStat {
  title: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
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

export interface OrderAnalytics {
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

export interface GeographicData {
  country: string;
  orders: number;
  revenue: number;
  customers: number;
}
