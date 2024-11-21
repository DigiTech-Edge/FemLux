import { FavoritesList, FavoritesStats } from '../types/favorites'

export const userFavorites: FavoritesList = {
  userId: "user1",
  items: [
    {
      productId: 1,
      dateAdded: "2024-01-15T10:30:00Z",
      note: "Love the floral pattern!"
    },
    {
      productId: 2,
      dateAdded: "2024-01-14T15:45:00Z"
    },
    {
      productId: 4,
      dateAdded: "2024-01-13T09:20:00Z",
      note: "Perfect for summer events"
    },
    {
      productId: 7,
      dateAdded: "2024-01-12T14:15:00Z"
    },
    {
      productId: 9,
      dateAdded: "2024-01-11T11:30:00Z",
      note: "Great price point"
    }
  ]
}

export const favoritesStats: FavoritesStats = {
  totalItems: 5,
  recentlyAdded: 2,
  mostViewedCategory: "Dresses",
  priceRange: {
    min: 59.99,
    max: 199.99
  }
}
