import { AdminProfile } from "@/lib/types/profile";

export const adminProfile: AdminProfile = {
  id: "1",
  name: "Admin User",
  email: "admin@femlux.com",
  avatar: "https://i.pravatar.cc/150?u=admin@femlux.com",
  createdAt: "2023-01-01T00:00:00.000Z",
  lastLogin: new Date().toISOString(),
};
