"use server";

import { revalidatePath } from "next/cache";
import { Banner } from "@/types/banner";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from "../banner.service";

export async function fetchBanners(activeOnly = true) {
  return await getBanners(activeOnly);
}

export async function createBannerAction(data: Banner) {
  const banner = await createBanner(data);
  revalidatePath("/admin/profile");
  return banner;
}

export async function updateBannerAction(id: string, data: Partial<Banner>) {
  const banner = await updateBanner(id, data);
  revalidatePath("/admin/profile");
  return banner;
}

export async function deleteBannerAction(id: string) {
  await deleteBanner(id);
  revalidatePath("/admin/profile");
  return { success: true };
}

export async function toggleBannerStatusAction(id: string) {
  const banner = await toggleBannerStatus(id);
  revalidatePath("/admin/profile");
  return banner;
}
