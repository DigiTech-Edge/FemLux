import { prisma } from "@/utils/prisma";
import { CartItem } from "@/store/cart";
import env from "@/env";
import { OrderStatus } from "@prisma/client";
import { headers } from "next/headers";
import { generateOrderNumber } from "@/helpers/orderNumber";

interface CreatePaymentLinkParams {
  email: string;
  amount: number;
  metadata: {
    userId: string;
    items: CartItem[];
    shippingAddress: string;
    phoneNumber: string;
  };
}

const createPaymentLink = async ({
  email,
  amount,
  metadata,
}: CreatePaymentLinkParams) => {
  try {
    const origin = (await headers()).get("origin");
    console.log(origin, env.paystack.secretKey);
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.paystack.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Convert to kobo/cents
          metadata,
          callback_url: `${origin}/checkout/verify`,
        }),
      }
    );

    const data = await response.json();
    if (!data.status) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error("Error creating payment link:", error);
    throw error;
  }
};

const verifyPayment = async (reference: string) => {
  try {
    // First verify with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${env.paystack.secretKey}`,
        },
      }
    );

    const data = await response.json();
    if (!data.status || data.data.status !== 'success') {
      throw new Error('Payment verification failed');
    }

    const { metadata, amount } = data.data;
    if (!metadata || !metadata.userId) {
      throw new Error('Invalid payment metadata');
    }

    // Create order in database
    const orderNumber = await generateOrderNumber();
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: metadata.userId,
        totalAmount: amount / 100,
        shippingAddress: metadata.shippingAddress,
        phoneNumber: metadata.phoneNumber,
        status: OrderStatus.PENDING,
        items: {
          create: metadata.items.map((item: CartItem) => ({
            productId: item.productId,
            variantId: item.variant.id,
            quantity: Number(item.quantity),
            price: item.variant.price,
            size: item.variant.size,
            productName: item.product.name,
            productImage: item.product.images[0],
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Convert Decimal to number
    const serializedOrder = JSON.parse(
      JSON.stringify(order, (_, value) =>
        typeof value === 'object' && value !== null && 'type' in value && value.type === 'Decimal'
          ? Number(value.toString())
          : value
      )
    );

    return { paymentVerified: true, order: serializedOrder };
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

export const ordersService = {
  createPaymentLink,
  verifyPayment,
};
