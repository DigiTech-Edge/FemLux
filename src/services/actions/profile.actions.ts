"use server";

import { revalidatePath } from "next/cache";
import { Profile, PasswordUpdate } from "@/types/profile";
import { getProfile, updateProfile, updatePassword } from "../profile.service";

export async function fetchProfile() {
  return await getProfile();
}

export async function updateProfileAction(profile: Profile) {
  const updatedProfile = await updateProfile(profile);
  revalidatePath("/admin/profile");
  return updatedProfile;
}

export async function updatePasswordAction(passwords: PasswordUpdate) {
  await updatePassword(passwords);
  return { success: true };
}
