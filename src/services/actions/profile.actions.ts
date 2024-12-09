"use server";

import { revalidatePath } from "next/cache";
import { Profile, PasswordUpdate } from "@/types/profile";
import {
  getProfile,
  updateProfile,
  updatePassword,
  updateAvatarUrl,
  deleteAvatar,
  getAvatarUrl,
} from "../profile.service";

export async function fetchProfile() {
  return await getProfile();
}

export async function updateProfileAction(profile: Profile) {
  const updatedProfile = await updateProfile(profile);
  revalidatePath("/admin/profile");
  revalidatePath("/profile");
  return updatedProfile;
}

export async function updatePasswordAction(passwords: PasswordUpdate) {
  await updatePassword(passwords);
  revalidatePath("/admin/profile");
  revalidatePath("/profile");
  return { success: true };
}

export async function updateAvatarUrlAction(avatarUrl: string) {
  const updatedUrl = await updateAvatarUrl(avatarUrl);
  revalidatePath("/admin/profile");
  revalidatePath("/profile");
  return updatedUrl;
}

export async function deleteAvatarAction() {
  const urlToDelete = await deleteAvatar();
  revalidatePath("/admin/profile");
  revalidatePath("/profile");
  return urlToDelete;
}

export async function fetchAvatarUrlAction() {
  return await getAvatarUrl();
}
