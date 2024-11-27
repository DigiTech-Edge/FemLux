import { prisma } from "@/utils/prisma";
import { User } from "@supabase/supabase-js";

export const userService = {
  upsertProfile: async (user: User) => {
    try {
      const profile = await prisma.profile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          email: user.email!,
          fullName: user.user_metadata.name || "",
          avatarUrl: user.user_metadata.avatar_url || "",
        },
        update: {
          email: user.email,
          fullName: user.user_metadata.name,
          avatarUrl: user.user_metadata.avatar_url,
        },
      });
      return { profile };
    } catch (error) {
      console.error("Error upserting profile:", error);
      throw error;
    }
  },

  /**
   * Get a user profile by ID
   */
  getProfile: async (userId: string) => {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      return { profile };
    } catch (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
  },

  /**
   * Update profile fields
   */
  updateProfile: async (
    userId: string,
    data: Partial<{
      fullName: string;
      avatarUrl: string;
      bio: string;
      // Add other profile fields as needed
    }>
  ) => {
    try {
      const profile = await prisma.profile.update({
        where: { userId },
        data,
      });
      return { profile };
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
};
