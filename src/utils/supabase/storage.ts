"use client";

import env from "@/env";
import { createClient } from "../supabase/client";

// Create a Supabase client for use in component
const supabase = createClient();

export interface UploadResult {
  url: string | null;
  error: Error | null;
}

export const uploadImage = async (
  file: File,
  bucket: string = env.buckets.products,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  try {
    // Since we can't track real progress, we'll simulate progress
    let progressInterval: NodeJS.Timeout | null = null;
    if (onProgress) {
      let progress = 0;
      progressInterval = setInterval(() => {
        progress = Math.min(progress + 10, 90); // Don't reach 100% until actually complete
        onProgress(progress);
      }, 100);
    }

    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // Clear progress interval if it exists
    if (progressInterval) {
      clearInterval(progressInterval);
    }

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    // Set progress to 100% when complete
    onProgress?.(100);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { url: null, error: error as Error };
  }
};

export const deleteImage = async (
  imageUrl: string,
  bucket: string = env.buckets.products
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const fileName = imageUrl.split("/").pop();
    if (!fileName) {
      throw new Error("Invalid image URL");
    }

    console.log(bucket);

    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      throw error;
    }
    console.log(data);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: error as Error };
  }
};

export const uploadMultipleImages = async (
  files: File[],
  bucket: string = env.buckets.products,
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  const urls: string[] = [];
  let totalProgress = 0;

  for (const [index, file] of files.entries()) {
    const result = await uploadImage(file, bucket, (progress) => {
      // Calculate total progress based on individual file progress
      const fileProgress = progress / files.length;
      const previousFilesProgress = (index * 100) / files.length;
      totalProgress = previousFilesProgress + fileProgress;
      onProgress?.(totalProgress);
    });

    if (result.url) {
      urls.push(result.url);
    }
  }

  return urls;
};
