"use server";

import { Analytics, TimeRange } from "@/types/analytics";
import { getAnalytics } from "../analytics.service";

export async function fetchAnalytics(
  timePeriod: TimeRange = "last30days"
): Promise<Analytics> {
  return await getAnalytics(timePeriod);
}
