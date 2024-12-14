"use server";

import {
  getCustomers,
  getCustomerStats,
  updateCustomerRole,
} from "../customers.service";
import { CustomerStats, CustomerWithOrders } from "@/types/customer";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function fetchCustomers(): Promise<
  (CustomerWithOrders & { role?: string })[]
> {
  // Get current user's session to check if admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get base customer data
  if (user?.user_metadata?.role !== "admin") {
    throw new Error("Not authorized");
  }
  const customers = await getCustomers();

  // Create admin client for fetching user roles
  const adminClient = await createAdminClient();
  const customersWithRoles = await Promise.all(
    customers.map(async (customer) => {
      const { data: userData } = await adminClient.auth.admin.getUserById(
        customer.id
      );
      return {
        ...customer,
        role: userData.user?.user_metadata?.role || "user",
      };
    })
  );

  return customersWithRoles;
}

export async function fetchCustomerStats(): Promise<CustomerStats> {
  return await getCustomerStats();
}

export async function updateCustomerRoleAction(
  userId: string,
  role: "admin" | "user"
): Promise<void> {
  const adminClient = await createAdminClient();
  const {
    data: { user },
  } = await adminClient.auth.admin.getUserById(userId);

  if (!user) throw new Error("User not found");
  if (user.user_metadata?.role === "admin" && role === "user") {
    throw new Error("Cannot demote admin");
  }

  await updateCustomerRole(userId, role);
  revalidatePath("/admin/customers");
}
