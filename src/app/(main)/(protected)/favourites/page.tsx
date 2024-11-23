'use client'

import { userFavorites, favoritesStats } from '@/lib/data/favorites'
import FavoritesHeader from '@/components/interfaces/favourites/FavoritesHeader'
import FavoritesList from '@/components/interfaces/favourites/FavoritesList'
import FavoritesStats from '@/components/interfaces/favourites/FavoritesStats'

export default function FavoritesPage() {
  return (
    <div className="container mx-auto p-4">
      <FavoritesHeader totalItems={userFavorites.items.length} />
      <div className="grid lg:grid-cols-4 gap-6 mt-6">
        {/* Sticky Stats on the left */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <FavoritesStats stats={favoritesStats} />
          </div>
        </div>
        {/* Favorites List on the right */}
        <div className="lg:col-span-3">
          <FavoritesList favorites={userFavorites.items} />
        </div>
      </div>
    </div>
  )
}
