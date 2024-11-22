import { faker } from "@faker-js/faker";
import type { Customer, CustomerStatus } from "@/lib/types/customers";

const statuses: CustomerStatus[] = ["active", "inactive", "blocked"];

function generateMockCustomer(): Customer {
  const dateJoined = faker.date.past({ years: 2 });
  const lastOrderDate = faker.date.between({
    from: dateJoined,
    to: new Date(),
  });
  const totalOrders = faker.number.int({ min: 1, max: 50 });
  const totalSpent = faker.number.float({
    min: totalOrders * 50,
    max: totalOrders * 200,
    precision: 0.01,
  });

  return {
    id: faker.string.alphanumeric(7).toUpperCase(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    phone: faker.phone.number(),
    status: faker.helpers.arrayElement(statuses),
    totalOrders,
    totalSpent,
    lastOrderDate: lastOrderDate.toISOString(),
    dateJoined: dateJoined.toISOString(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
  };
}

export const mockCustomers = Array.from({ length: 50 }, generateMockCustomer);

// Calculate statistics
const activeCustomers = mockCustomers.filter(
  (customer) => customer.status === "active"
).length;
const totalRevenue = mockCustomers.reduce(
  (sum, customer) => sum + customer.totalSpent,
  0
);
const averageOrderValue = totalRevenue / mockCustomers.reduce(
  (sum, customer) => sum + customer.totalOrders,
  0
);

export const customerStats = {
  totalCustomers: mockCustomers.length,
  activeCustomers,
  totalRevenue,
  averageOrderValue,
};
