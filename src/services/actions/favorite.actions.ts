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
  if (!user?.id) return { 
    items: [], 
    stats: { 
      totalItems: 0, 
      recentlyAdded: 0, 
      mostViewedCategory: 'None', 
      priceRange: { min: 0, max: 0 } 
    } 
  };
  
  const favorites = await favoritesService.getUserFavorites(user.id);
  
  // Get all prices as numbers
  const allPrices = favorites.flatMap(f => 
    f.product.variants.map(v => Number(v.price))
  );
  
  // Calculate stats
  const stats = {
    totalItems: favorites.length,
    recentlyAdded: favorites.filter(f => {
      const addedDate = new Date(f.createdAt);
      const now = new Date();
      const daysDiff = (now.getTime() - addedDate.getTime()) / (1000 * 3600 * 24);
      return daysDiff <= 7;
    }).length,
    mostViewedCategory: favorites.length > 0 
      ? Object.entries(
          favorites.reduce((acc, curr) => {
            const category = curr.product.category.name;
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).sort((a, b) => b[1] - a[1])[0][0]
      : 'None',
    priceRange: {
      min: allPrices.length > 0 ? Math.min(...allPrices) : 0,
      max: allPrices.length > 0 ? Math.max(...allPrices) : 0
    },
    averagePrice: favorites.length > 0
      ? Math.round(
          favorites.reduce((acc, curr) => 
            acc + Math.min(...curr.product.variants.map(v => Number(v.price))), 0
          ) / favorites.length
        )
      : 0
  };

  return {
    items: favorites.map(f => ({
      productId: f.productId,
      dateAdded: f.createdAt.toISOString(),
      product: {
        ...f.product,
        variants: f.product.variants.map(v => ({
          ...v,
          price: Number(v.price) // Convert Decimal to number
        }))
      }
    })),
    stats
  };
}

export async function clearAllFavorites() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) throw new Error("Unauthorized");

  await favoritesService.clearAllFavorites(user.id);
  revalidatePath("/favourites");
}
