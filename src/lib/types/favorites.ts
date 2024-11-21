export interface FavoriteItem {
  productId: number
  dateAdded: string
  note?: string
}

export interface FavoritesList {
  userId: string
  items: FavoriteItem[]
}

export interface FavoritesStats {
  totalItems: number
  recentlyAdded: number
  mostViewedCategory: string
  priceRange: {
    min: number
    max: number
  }
}
