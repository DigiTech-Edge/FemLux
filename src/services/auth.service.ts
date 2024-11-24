import { AuthError, Provider, User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

type AuthResponse = {
  user: User | null;
  error?: string;
};

export const authService = {
  /**
   * Get current session and user
   */
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return { user };
    } catch (error) {
      console.log(error);
      return { user: null };
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { user };
    } catch (error) {
      if (error instanceof AuthError) {
        return {
          user: null,
          error: error.message,
        };
      }
      return {
        user: null,
        error: "Failed to login",
      };
    }
  },

  /**
   * Create a new user account
   */
  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      if (error) throw error;
      return { user };
    } catch (error) {
      if (error instanceof AuthError) {
        return {
          user: null,
          error: error.message,
        };
      }
      return {
        user: null,
        error: "Failed to create account",
      };
    }
  },

  /**
   * Login with OAuth provider
   */
  loginWithProvider: async (provider: Provider): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  /**
   * Logout current session
   */
  logout: async (): Promise<void> => {
    await supabase.auth.signOut();
  },

  /**
   * Send password reset email
   */
  forgotPassword: async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return {};
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: error.message };
      }
      return { error: "Failed to send reset email" };
    }
  },

  /**
   * Reset password
   */
  resetPassword: async (password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      return {};
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: error.message };
      }
      return { error: "Failed to reset password" };
    }
  },

  /**
   * Update user email
   */
  updateEmail: async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        email,
      });
      if (error) throw error;
      return {};
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: error.message };
      }
      return { error: "Failed to update email" };
    }
  },

  /**
   * Update user password
   */
  updatePassword: async (password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      return {};
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: error.message };
      }
      return { error: "Failed to update password" };
    }
  },
};
