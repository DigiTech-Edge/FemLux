import { Permission, IndexType } from "node-appwrite";
import { db, favoriteCollection } from "../../name";
import { databases } from "../config";

export default async function createFavoriteCollection() {
  try {
    // create collection
    await databases.createCollection(
      db,
      favoriteCollection,
      favoriteCollection,
      [
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
      ]
    );
    console.log("Favorite collection is created");

    // creating attributes
    await Promise.all([
      databases.createStringAttribute(
        db,
        favoriteCollection,
        "userId",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        favoriteCollection,
        "productId",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        favoriteCollection,
        "productName",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        favoriteCollection,
        "productImage",
        255,
        false
      ),
      databases.createFloatAttribute(db, favoriteCollection, "price", true),
      databases.createDatetimeAttribute(
        db,
        favoriteCollection,
        "addedAt",
        true
      ),
    ]);
    console.log("Favorite attributes created");

    // create indexes
    await Promise.all([
      databases.createIndex(
        db,
        favoriteCollection,
        "user_product_idx",
        IndexType.Key,
        ["userId", "productId"]
      ),
      databases.createIndex(
        db,
        favoriteCollection,
        "added_at_idx",
        IndexType.Key,
        ["addedAt"]
      ),
    ]);
    console.log("Favorite indexes created");
  } catch (error) {
    console.error("Error creating favorite collection:", error);
    throw error;
  }
}
