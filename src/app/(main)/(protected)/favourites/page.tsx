import { getUserFavorites } from "@/services/actions/favorite.actions";
import FavoritesHeader from "@/components/interfaces/favourites/FavoritesHeader";
import FavoritesList from "@/components/interfaces/favourites/FavoritesList";
import FavoritesStats from "@/components/interfaces/favourites/FavoritesStats";

export default async function FavoritesPage() {
  const { items, stats } = await getUserFavorites();

  return (
    <div className="container mx-auto p-4">
      <FavoritesHeader totalItems={items.length} />
      <div className="grid lg:grid-cols-4 gap-6 mt-6">
        {/* Sticky Stats on the left */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <FavoritesStats stats={stats} />
          </div>
        </div>
        {/* Favorites List on the right */}
        <div className="lg:col-span-3">
          <FavoritesList favorites={items} />
        </div>
      </div>
    </div>
  );
}
