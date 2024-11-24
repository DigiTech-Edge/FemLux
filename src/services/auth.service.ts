import { ID, AppwriteException, type Models, OAuthProvider } from "appwrite";
import { account } from "@/models/client/config";
import { User } from "@/types/schema";

type AuthResponse = {
  user: Models.User<Models.Preferences> | null;
  error?: string;
};

export const authService = {
  /**
   * Get current session and user
   */
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const session = await account.get() as Models.User<Models.Preferences>;
      return { user: session };
    } catch {
      return { user: null };
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      await account.createSession(email, password);
      const session = await account.get() as Models.User<Models.Preferences>;
      return { user: session };
    } catch (error) {
      if (error instanceof AppwriteException) {
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
      // Create Appwrite account
      await account.create(ID.unique(), email, password, name);

      // Set initial preferences
      await account.updatePrefs({
        role: "user",
        emailVerified: false,
        avatar: null,
        shippingAddress: null,
        phoneNumber: null,
      });

      // Create email verification
      await account.createVerification(
        `${window.location.origin}/verify-email`
      );

      // Get the created user
      const session = await account.get() as Models.User<Models.Preferences>;
      return { user: session };
    } catch (error) {
      if (error instanceof AppwriteException) {
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
  loginWithProvider: async (provider: OAuthProvider) => {
    try {
      await account.createOAuth2Session(
        provider,
        `${window.location.origin}/auth/callback`,
        `${window.location.origin}/login`
      );
    } catch (error) {
      if (error instanceof AppwriteException) {
        return {
          error: error.message,
        };
      }
      return {
        error: `Failed to login with ${provider}`,
      };
    }
  },

  /**
   * Logout current session
   */
  logout: async (): Promise<void> => {
    try {
      await account.deleteSession("current");
    } catch (error) {
      if (error instanceof AppwriteException) {
        console.error("Logout error:", error.message);
      }
    }
  },

  /**
   * Send password reset email
   */
  forgotPassword: async (email: string): Promise<{ error?: string }> => {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      return {};
    } catch (error) {
      if (error instanceof AppwriteException) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Failed to send recovery email",
      };
    }
  },

  /**
   * Reset password with recovery code
   */
  resetPassword: async (
    userId: string,
    secret: string,
    password: string
  ): Promise<{ error?: string }> => {
    try {
      await account.updateRecovery(userId, secret, password);
      return {};
    } catch (error) {
      if (error instanceof AppwriteException) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Failed to reset password",
      };
    }
  },

  /**
   * Update user email
   */
  updateEmail: async (
    email: string,
    password: string
  ): Promise<{ error?: string }> => {
    try {
      await account.updateEmail(email, password);
      return {};
    } catch (error) {
      if (error instanceof AppwriteException) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Failed to update email",
      };
    }
  },

  /**
   * Update user password
   */
  updatePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ error?: string }> => {
    try {
      await account.updatePassword(newPassword, oldPassword);
      return {};
    } catch (error) {
      if (error instanceof AppwriteException) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Failed to update password",
      };
    }
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (
    preferences: Partial<User>
  ): Promise<{ error?: string }> => {
    try {
      await account.updatePrefs(preferences);
      return {};
    } catch (error) {
      if (error instanceof AppwriteException) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Failed to update preferences",
      };
    }
  }
};
