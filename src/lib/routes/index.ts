import { Home, ShoppingBag, Heart, User } from 'lucide-react'

export const routes = [
  {
    name: 'Home',
    path: '/',
    icon: Home
  },
  {
    name: 'Shop',
    path: '/shop',
    icon: ShoppingBag
  },
  {
    name: 'Favourites',
    path: '/favourites',
    icon: Heart
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: User,
  },
]
