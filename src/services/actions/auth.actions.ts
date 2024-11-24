"use server";

import { OAuthProvider } from "appwrite";
import { authService } from "../auth.service";
import { User } from "@/types/schema";

export async function login(email: string, password: string) {
  return authService.login(email, password);
}

export async function register(email: string, password: string, name: string) {
  return authService.register(email, password, name);
}

export async function loginWithGoogle() {
  return authService.loginWithProvider(OAuthProvider.Google);
}

export async function logout() {
  return authService.logout();
}

export async function getCurrentUser(): Promise<{
  user: User | null;
  error?: string;
}> {
  return authService.getCurrentUser();
}

export async function forgotPassword(email: string) {
  return authService.forgotPassword(email);
}

export async function resetPassword(
  userId: string,
  secret: string,
  password: string
) {
  return authService.resetPassword(userId, secret, password);
}

export async function verifyEmail(userId: string, secret: string) {
  return authService.verifyEmail(userId, secret);
}

export async function updatePassword(oldPassword: string, newPassword: string) {
  return authService.updatePassword(oldPassword, newPassword);
}

export async function updateEmail(email: string, password: string) {
  return authService.updateEmail(email, password);
}
