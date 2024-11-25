import { Profile } from "@prisma/client";
import { User } from "@supabase/supabase-js";

export const getAvatarUrl = (user: User, profile: Profile) => {
  if (user.app_metadata.provider === "email") {
    return profile.avatarUrl ?? "";
  }
  // For OAuth, use the provider's avatar
  return user.user_metadata.avatar_url ?? user.user_metadata.picture ?? "";
};
