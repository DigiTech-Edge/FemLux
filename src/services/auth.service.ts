import { ID, AppwriteException, type Models, OAuthProvider } from "appwrite";
import { account } from "@/utils/appwrite";
import { userService } from "./user.service";
import { User } from "@/types/schema";

export type AuthResponse = {
  user: User | null;
  error?: string;
};

export const authService = {
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

      // Create user document in database
      const user = await userService.createUser({
        email,
        name,
        role: "user",
        emailVerified: false,
        avatar: null,
      });

      // Create email verification
      await account.createVerification(
        `${window.location.origin}/verify-email`
      );

      return { user };
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
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      await account.createSession(email, password);
      const user = await userService.getUserByEmail(email);
      return { user };
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
   * Get current session and user
   */
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const session = (await account.get()) as Models.User<Models.Preferences>;
      const user = await userService.getUserByEmail(session.email);
      return { user };
    } catch {
      return { user: null };
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
   * Verify email with verification code
   */
  verifyEmail: async (
    userId: string,
    secret: string
  ): Promise<{ error?: string }> => {
    try {
      await account.updateVerification(userId, secret);
      // Update user document
      await userService.updateUserProfile(userId, {
        emailVerified: true,
      });
      return {};
    } catch (error) {
      if (error instanceof AppwriteException) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Failed to verify email",
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
};
