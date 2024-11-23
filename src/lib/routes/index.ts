import {
  Home,
  ShoppingBag,
  Heart,
  User,
  LayoutDashboard,
  Package,
  Users,
  User2,
  BarChart3,
} from "lucide-react";

export const routes = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Shop",
    path: "/shop",
    icon: ShoppingBag,
  },
  {
    name: "Favourites",
    path: "/favourites",
    icon: Heart,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

export const adminRoutes = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: ShoppingBag,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: Package,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Profile",
    path: "/admin/profile",
    icon: User2,
  },
];
