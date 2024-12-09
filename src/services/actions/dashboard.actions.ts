"use server";

import { DashboardData } from "@/types/dashboard";
import { getDashboardData } from "../dashboard.service";

export async function fetchDashboardData(): Promise<DashboardData> {
  return await getDashboardData();
}
