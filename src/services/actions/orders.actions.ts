"use server";

import { ordersService } from "../orders.service";
import { CartItem } from "@/store/cart";
import { createClient } from "@/utils/supabase/server";

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
    const { paymentVerified, order } = await ordersService.verifyPayment(reference);
    
    if (!paymentVerified || !order) {
      return { success: false, error: 'Payment verification failed' };
    }

    return { success: true, data: order };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { success: false, error: (error as Error).message };
  }
}
