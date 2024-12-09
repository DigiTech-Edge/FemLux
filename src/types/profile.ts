import { z } from "zod";

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  dateJoined: string;
}

// Profile Section
export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Security Section
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PasswordUpdate = z.infer<typeof passwordSchema>;
