"use server";

import { prisma } from "@/utils/prisma";

/**
 * Generates a unique order number in the format FLX-YYMMDD-XXXX
 * where XXXX is a sequential number padded with zeros
 */
export async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, "");

  // Get the latest order number for today
  const latestOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: `FLX-${dateStr}`,
      },
    },
    orderBy: {
      orderNumber: "desc",
    },
  });

  let sequentialNumber = 1;

  if (latestOrder?.orderNumber) {
    // Extract the sequential number from the latest order number
    const lastSequentialStr = latestOrder.orderNumber.split("-")[2];
    sequentialNumber = parseInt(lastSequentialStr) + 1;
  }

  // Generate the new order number
  const orderNumber = `FLX-${dateStr}-${sequentialNumber
    .toString()
    .padStart(4, "0")}`;

  // Verify uniqueness (in case of concurrent operations)
  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (existingOrder) {
    // If there's a collision, recursively try the next number
    return generateOrderNumber();
  }

  return orderNumber;
}
