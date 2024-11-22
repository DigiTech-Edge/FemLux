export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Customer {
  name: string;
  email: string;
  avatar: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  customer: Customer;
  date: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  trackingNumber: string | null;
}
