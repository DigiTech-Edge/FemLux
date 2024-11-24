import { Permission } from "node-appwrite";
import {
  productImagesBucket,
  avatarsBucket,
  categoryImagesBucket,
} from "../name";
import { storage } from "./config";

const allowedImageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
const maxFileSize = 10 * 1024 * 1024; // 10MB

async function createBucketIfNotExists(bucketId: string, name: string) {
  try {
    await storage.getBucket(bucketId);
    console.log(`${name} Storage Connected`);
  } catch {
    try {
      await storage.createBucket(
        bucketId,
        name,
        [
          Permission.create("team:admin"), // Only admins can upload
          Permission.read("any"), // Anyone can view
          Permission.update("team:admin"), // Only admins can update
          Permission.delete("team:admin"), // Only admins can delete
        ],
        false, // Not enabled for file encryption
        undefined,
        maxFileSize,
        allowedImageTypes
      );
      console.log(`${name} Storage Created`);
    } catch (error) {
      console.error(`Error creating ${name} storage:`, error);
      throw error;
    }
  }
}

export default async function setupStorage() {
  try {
    // Create Products Images Storage
    await createBucketIfNotExists(productImagesBucket, "Product Images");

    // Create Category/Banner Images Storage
    await createBucketIfNotExists(categoryImagesBucket, "Category Images");

    // Create User Avatars Storage with different permissions
    try {
      await storage.getBucket(avatarsBucket);
      console.log("Avatars Storage Connected");
    } catch {
      try {
        await storage.createBucket(
          avatarsBucket,
          "User Avatars",
          [
            Permission.create("users"), // Users can upload their avatars
            Permission.read("any"), // Anyone can view avatars
            Permission.update("users"), // Users can update their avatars
            Permission.delete("users"), // Users can delete their avatars
          ],
          false,
          undefined,
          maxFileSize,
          allowedImageTypes
        );
        console.log("Avatars Storage Created");
      } catch (error) {
        console.error("Error creating avatars storage:", error);
        throw error;
      }
    }

    console.log("All storage buckets setup completed");
  } catch (error) {
    console.error("Error setting up storage:", error);
    throw error;
  }
}
