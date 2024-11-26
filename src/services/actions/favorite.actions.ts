"use server";

import { favoritesService } from "../favorites.service";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getFavoriteStatus(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return false;
  return favoritesService.getFavoriteStatus(user.id, productId);
}

export async function toggleFavorite(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) throw new Error("Unauthorized");

  const result = await favoritesService.toggleFavorite(user.id, productId);
  revalidatePath("/favourites");
  return result;
}

export async function getUserFavorites() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return [];
  return favoritesService.getUserFavorites(user.id);
}
