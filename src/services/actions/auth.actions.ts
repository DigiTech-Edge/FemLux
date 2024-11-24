"use server";

import { Provider, User } from "@supabase/supabase-js";
import { authService } from "../auth.service";

export async function login(email: string, password: string) {
  return authService.login(email, password);
}

export async function register(email: string, password: string, name: string) {
  return authService.register(email, password, name);
}

export async function loginWithGoogle(provider?: Provider) {
  return authService.loginWithProvider(provider || "google");
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

export async function resetPassword(password: string) {
  return authService.resetPassword(password);
}

export async function updatePassword(password: string) {
  return authService.updatePassword(password);
}

export async function updateEmail(email: string) {
  return authService.updateEmail(email);
}
