export type StatType = "sales" | "orders" | "average" | "visitors";

export interface DashboardStat {
  title: string;
  value: number;
  change: number;
  type: StatType;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  growth: number;
}

export interface RecentOrder {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  salesData: SalesData[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}
