import { OrderStatus } from "@prisma/client";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  size: string;
  productName: string;
  productImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderWithDetails {
  id: string;
  orderNumber: string | null;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  trackingNumber: string | null;
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}
