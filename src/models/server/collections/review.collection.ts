import { Permission, IndexType } from "node-appwrite";
import { db, reviewCollection } from "../../name";
import { databases } from "../config";

export default async function createReviewCollection() {
  try {
    // create collection
    await databases.createCollection(db, reviewCollection, reviewCollection, [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);
    console.log("Review collection is created");

    // creating attributes
    await Promise.all([
      // User Info
      databases.createStringAttribute(
        db,
        reviewCollection,
        "userId",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        reviewCollection,
        "userName",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        reviewCollection,
        "userAvatar",
        255,
        false
      ),

      // Product Info
      databases.createStringAttribute(
        db,
        reviewCollection,
        "productId",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        reviewCollection,
        "orderId",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        reviewCollection,
        "productName",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        reviewCollection,
        "productImage",
        255,
        false
      ),

      // Review Content
      databases.createStringAttribute(
        db,
        reviewCollection,
        "title",
        255,
        false
      ),
      databases.createStringAttribute(
        db,
        reviewCollection,
        "content",
        2000,
        true
      ),
      databases.createIntegerAttribute(
        db,
        reviewCollection,
        "rating",
        true,
        1,
        5
      ),
      databases.createStringAttribute(
        db,
        reviewCollection,
        "images",
        1000,
        false
      ), // JSON array of image URLs
      databases.createStringAttribute(
        db,
        reviewCollection,
        "pros",
        1000,
        false
      ),
      databases.createStringAttribute(
        db,
        reviewCollection,
        "cons",
        1000,
        false
      ),

      // Review Status
      databases.createBooleanAttribute(
        db,
        reviewCollection,
        "isVerified",
        true
      ),
      databases.createBooleanAttribute(
        db,
        reviewCollection,
        "isPublished",
        true
      ),
      databases.createBooleanAttribute(
        db,
        reviewCollection,
        "isPurchaseVerified",
        true
      ),

      // Engagement
      databases.createIntegerAttribute(
        db,
        reviewCollection,
        "helpfulCount",
        false,
        0
      ),
      databases.createIntegerAttribute(
        db,
        reviewCollection,
        "reportCount",
        false,
        0
      ),
      databases.createStringAttribute(
        db,
        reviewCollection,
        "adminResponse",
        1000,
        false
      ),

      // Timestamps
      databases.createDatetimeAttribute(
        db,
        reviewCollection,
        "createdAt",
        true
      ),
      databases.createDatetimeAttribute(
        db,
        reviewCollection,
        "updatedAt",
        false
      ),
      databases.createDatetimeAttribute(
        db,
        reviewCollection,
        "adminResponseDate",
        false
      ),
    ]);
    console.log("Review attributes created");

    // create indexes
    await Promise.all([
      // Main indexes
      databases.createIndex(
        db,
        reviewCollection,
        "user_product_idx",
        IndexType.Key,
        ["userId", "productId"]
      ),
      databases.createIndex(db, reviewCollection, "order_idx", IndexType.Key, [
        "orderId",
      ]),

      // Rating indexes
      databases.createIndex(db, reviewCollection, "rating_idx", IndexType.Key, [
        "rating",
      ]),
      databases.createIndex(
        db,
        reviewCollection,
        "product_rating_idx",
        IndexType.Key,
        ["productId", "rating"]
      ),

      // Status indexes
      databases.createIndex(db, reviewCollection, "status_idx", IndexType.Key, [
        "isVerified",
        "isPublished",
      ]),

      // Date indexes
      databases.createIndex(
        db,
        reviewCollection,
        "created_at_idx",
        IndexType.Key,
        ["createdAt"]
      ),

      // Engagement indexes
      databases.createIndex(
        db,
        reviewCollection,
        "helpful_idx",
        IndexType.Key,
        ["helpfulCount"]
      ),
    ]);
    console.log("Review indexes created");
  } catch (error) {
    console.error("Error creating review collection:", error);
    throw error;
  }
}
