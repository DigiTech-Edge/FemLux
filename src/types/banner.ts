import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image is required"),
  isActive: z.boolean().default(true),
});

export type Banner = z.infer<typeof bannerSchema>;

export interface BannerWithId extends Banner {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
