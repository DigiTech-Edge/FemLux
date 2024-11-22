export type CustomerStatus = "active" | "inactive" | "blocked";

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  dateJoined: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}
