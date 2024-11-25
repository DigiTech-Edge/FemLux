"use server";

import { userService } from "../users.service";
import { User } from "@supabase/supabase-js";

export async function upsertProfile(user: User) {
  return userService.upsertProfile(user);
}

export async function getProfile(userId: string) {
  return userService.getProfile(userId);
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
