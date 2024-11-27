import * as z from "zod";

export const checkoutFormSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  shippingAddress: z
    .string()
    .min(5, "Shipping address must be at least 5 characters")
    .describe("Please enter your full address separated by commas"),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
