import { prisma } from "@/utils/prisma";
import { User } from "@supabase/supabase-js";

export const userService = {
  /**
   * Create or update a user profile
   */
  upsertProfile: async (user: User) => {
    try {
      const profile = await prisma.profile.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata.name || "",
          avatarUrl: user.user_metadata.avatar_url || "",
          emailVerified: user.email_confirmed_at ? true : false,
        },
        update: {
          email: user.email,
          fullName: user.user_metadata.name,
          avatarUrl: user.user_metadata.avatar_url,
          emailVerified: user.email_confirmed_at ? true : false,
        },
      });
      return { profile };
    } catch (error) {
      console.error("Error upserting profile:", error);
      return { error: "Failed to create/update profile" };
    }
  },

  /**
   * Get a user profile by ID
   */
  getProfile: async (userId: string) => {
    try {
      const profile = await prisma.profile.findUnique({
        where: { id: userId },
      });
      return { profile };
    } catch (error) {
      console.error("Error getting profile:", error);
      return { error: "Failed to get profile" };
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
        where: { id: userId },
        data,
      });
      return { profile };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error: "Failed to update profile" };
    }
  },
};
