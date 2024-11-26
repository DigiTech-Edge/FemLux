import { getUserFavorites } from "@/services/actions/favorite.actions";
import ProductCard from "@/components/ui/ProductCard";
import { Grid } from "@/components/ui/Grid";

export default async function FavoritesPage() {
  const favorites = await getUserFavorites();

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">My Favorites</h1>
      {favorites.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>You haven&apos;t added any favorites yet.</p>
        </div>
      ) : (
        <Grid>
          {favorites.map((favorite) => (
            <ProductCard key={favorite.product.id} product={favorite.product} />
          ))}
        </Grid>
      )}
    </div>
  );
}
