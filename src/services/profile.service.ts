import { createClient } from "@/utils/supabase/server";
import { Profile, PasswordUpdate } from "@/types/profile";
import { prisma } from "@/utils/prisma";

export async function getProfile() {
  try {
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
      id: profile.id,
      name: profile.fullName || "",
      email: profile.email,
      avatar: profile.avatarUrl || "",
      dateJoined: profile.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
}

export async function updateAvatarUrl(avatarUrl: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not found");

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) throw new Error("Profile not found");

    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        avatarUrl: avatarUrl,
        updatedAt: new Date(),
      },
    });

    return updatedProfile.avatarUrl;
  } catch (error) {
    console.error("Error updating avatar URL:", error);
    throw error;
  }
}

export async function deleteAvatar() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not found");

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || !profile.avatarUrl) return null;

    const urlToDelete = profile.avatarUrl;

    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        avatarUrl: null,
        updatedAt: new Date(),
      },
    });

    return urlToDelete;
  } catch (error) {
    console.error("Error deleting avatar:", error);
    throw error;
  }
}

export async function updateProfile(data: Profile) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not found");

    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        fullName: data.name,
        avatarUrl: data.avatar,
        updatedAt: new Date(),
      },
    });

    return {
      id: updatedProfile.id,
      name: updatedProfile.fullName || "",
      email: updatedProfile.email,
      avatar: updatedProfile.avatarUrl || "",
      dateJoined: updatedProfile.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function updatePassword(passwords: PasswordUpdate) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not found");

    // First verify the current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: passwords.currentPassword,
    });

    if (signInError) {
      throw new Error("Current password is incorrect");
    }

    // If current password is correct, update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: passwords.newPassword,
    });

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

export async function getAvatarUrl() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not found");

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { avatarUrl: true },
    });

    if (!profile) throw new Error("Profile not found");

    return profile.avatarUrl;
  } catch (error) {
    console.error("Error getting avatar URL:", error);
    throw error;
  }
}
