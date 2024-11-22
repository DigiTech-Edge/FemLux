import { faker } from "@faker-js/faker";
import type { Order } from "@/lib/types/orders";

const statuses = ["pending", "processing", "delivered", "cancelled"] as const;
const paymentMethods = ["credit_card", "paypal", "bank_transfer"] as const;

function generateMockOrder(): Order {
  const items = Array.from(
    { length: faker.number.int({ min: 1, max: 5 }) },
    () => ({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      quantity: faker.number.int({ min: 1, max: 10 }),
    })
  );

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    id: faker.string.alphanumeric(7).toUpperCase(),
    date: faker.date.recent({ days: 30 }).toISOString(),
    status: faker.helpers.arrayElement(statuses),
    customer: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
    },
    items,
    total,
    shippingAddress: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    paymentMethod: faker.helpers.arrayElement(paymentMethods),
    trackingNumber: faker.string.alphanumeric(12).toUpperCase(),
  };
}

export const mockOrders = Array.from({ length: 50 }, generateMockOrder);

// Calculate statistics
const deliveredOrders = mockOrders.filter(
  (order) => order.status === "delivered"
).length;
const pendingOrders = mockOrders.filter(
  (order) => order.status === "pending"
).length;
const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);

export const orderStats = {
  totalOrders: mockOrders.length,
  deliveredOrders,
  pendingOrders,
  totalRevenue,
};
