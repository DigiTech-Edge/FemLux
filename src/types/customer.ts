export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "active" | "inactive" | "blocked";
  totalOrders: number;
  totalSpent: number;
  dateJoined: string;
  lastOrderDate: string;
  address: string;
  phone: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface CustomerWithOrders extends Customer {
  orders: {
    id: string;
    orderNumber: string | null;
    createdAt: Date;
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalAmount: number;
  }[];
}
