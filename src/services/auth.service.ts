import { AuthError, Provider, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

type AuthResponse = {
  user: User | null;
  error?: string;
};

const isAdminEmail = (email: string) => {
  // Implement logic to check if email is admin email
  // For example:
  return email.includes("admin");
};

export const authService = {
  /**
   * Get current session and user
   */
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return { user };
    } catch (error) {
      console.error("Error getting current user:", error);
      return { user: null, error: "Failed to get current user" };
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const supabase = await createServerClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Create/update profile if login successful

      return { user };
    } catch (error) {
      console.error("Login error:", error);
      return {
        user: null,
        error: error instanceof AuthError ? error.message : "Failed to login",
      };
    }
  },

  /**
   * Register a new user
   */
  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    try {
      const supabase = await createServerClient();

      // Get the site URL, defaulting to localhost in development
      const origin = (await headers()).get("origin");

      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      // Set role based on email
      if (user) {
        await supabase.auth.updateUser({
          data: { role: isAdminEmail(email) ? "admin" : "user" },
        });
      }

      if (error) throw error;
      return { user };
    } catch (error) {
      return {
        user: null,
        error:
          error instanceof AuthError ? error.message : "Failed to register",
      };
    }
  },

  /**
   * Login with OAuth provider
   */
  loginWithProvider: async (provider: Provider): Promise<string> => {
    const origin = (await headers()).get("origin");
    try {
      const supabase = await createServerClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        return data.url;
      }
      throw new Error("No URL returned from OAuth provider");
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout current session
   */
  logout: async (): Promise<void> => {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Send password reset email
   */
  forgotPassword: async (email: string): Promise<{ error?: string }> => {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return {};
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        error:
          error instanceof AuthError
            ? error.message
            : "Failed to send reset email",
      };
    }
  },

  /**
   * Reset password with new password
   */
  resetPassword: async (password: string): Promise<{ error?: string }> => {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return {};
    } catch (error) {
      console.error("Password update error:", error);
      return {
        error:
          error instanceof AuthError
            ? error.message
            : "Failed to reset password",
      };
    }
  },

  /**
   * Update user email
   */
  updateEmail: async (email: string): Promise<{ error?: string }> => {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      return {};
    } catch (error) {
      console.error("Email update error:", error);
      return {
        error:
          error instanceof AuthError ? error.message : "Failed to update email",
      };
    }
  },

  /**
   * Update user password
   */
  updatePassword: async (password: string): Promise<{ error?: string }> => {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return {};
    } catch (error) {
      console.error("Password update error:", error);
      return {
        error:
          error instanceof AuthError
            ? error.message
            : "Failed to update password",
      };
    }
  },
};
