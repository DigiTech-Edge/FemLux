"use server";

import { ordersService } from "../orders.service";
import { CartItem } from "@/store/cart";
import { createClient } from "@/utils/supabase/server";
import { OrderStatus } from "@/types/orders";
import { revalidatePath } from "next/cache";

interface InitiatePaymentParams {
  email: string;
  amount: number;
  items: CartItem[];
  shippingAddress: string;
  phoneNumber: string;
}

export async function initiatePayment({
  email,
  amount,
  items,
  shippingAddress,
  phoneNumber,
}: InitiatePaymentParams) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const paymentLink = await ordersService.createPaymentLink({
      email,
      amount,
      metadata: {
        userId: user.id,
        items,
        shippingAddress,
        phoneNumber,
      },
    });

    return { success: true, data: paymentLink };
  } catch (error) {
    console.error("Error initiating payment:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function verifyPayment(reference: string) {
  try {
    const { paymentVerified, order } = await ordersService.verifyPayment(
      reference
    );

    if (!paymentVerified || !order) {
      return { success: false, error: "Payment verification failed" };
    }

    return { success: true, data: order };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getOrders() {
  try {
    const orders = await ordersService.getOrders();
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error getting orders:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getOrderStats() {
  try {
    const stats = await ordersService.getOrderStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("Error getting order stats:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await ordersService.updateOrderStatus(orderId, status);
    revalidatePath("/admin/orders");
    return { success: true, data: order };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateOrderTracking(
  orderId: string,
  trackingNumber: string
) {
  try {
    const order = await ordersService.updateOrderTracking(
      orderId,
      trackingNumber
    );
    return { success: true, data: order };
  } catch (error) {
    console.error("Error updating order tracking:", error);
    return { success: false, error: (error as Error).message };
  }
}
