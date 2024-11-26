import useSWR from "swr";
import {
  getFavoriteStatus,
  toggleFavorite,
} from "@/services/actions/favorite.actions";

export function useFavorite(productId: string) {
  const {
    data: isFavorite,
    mutate,
    isLoading,
  } = useSWR(`favorite-${productId}`, async () => getFavoriteStatus(productId));

  const toggleFavoriteStatus = async () => {
    try {
      const newStatus = await toggleFavorite(productId);
      await mutate(newStatus, false);
    } catch (error) {
      throw error;
    }
  };

  return {
    isFavorite: isFavorite ?? false,
    toggleFavoriteStatus,
    isLoading,
  };
}
