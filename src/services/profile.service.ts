import { createClient } from "@/utils/supabase/server";
import { Profile, PasswordUpdate } from "@/types/profile";
import { prisma } from "@/utils/prisma";

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");


  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) throw new Error("Profile not found");

  return {
    fullName: profile.fullName || "",
    email: profile.email,
    role: user.user_metadata.role,
    avatar: profile.avatarUrl || "",
  };
}

export async function updateProfile(profile: Profile) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      fullName: profile.fullName,
      avatarUrl: profile.avatar,
      updatedAt: new Date(),
    },
  });

  return {
    fullName: updatedProfile.fullName || "",
    email: updatedProfile.email,
    role: user.user_metadata.role,
    avatar: updatedProfile.avatarUrl || "",
  };
}

export async function updatePassword(passwords: PasswordUpdate) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: passwords.newPassword,
  });

  if (error) throw error;

  return { success: true };
}