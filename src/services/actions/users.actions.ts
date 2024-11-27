"use server";

import { userService } from "../users.service";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

export async function upsertProfile(user: User) {
  return userService.upsertProfile(user);
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) throw new Error("Unauthorized");
  return userService.getProfile(user.id);
}

export async function updateProfile(
  userId: string,
  data: Partial<{
    fullName: string;
    avatarUrl: string;
    bio: string;
  }>
) {
  return userService.updateProfile(userId, data);
}
