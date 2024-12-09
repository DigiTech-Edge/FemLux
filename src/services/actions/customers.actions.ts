"use server";

import { getCustomers, getCustomerStats } from "../customers.service";
import { CustomerStats, CustomerWithOrders } from "@/types/customer";

export async function fetchCustomers(): Promise<CustomerWithOrders[]> {
  return await getCustomers();
}

export async function fetchCustomerStats(): Promise<CustomerStats> {
  return await getCustomerStats();
}
