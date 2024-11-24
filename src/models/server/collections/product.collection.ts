import { Permission, IndexType } from "node-appwrite";
import { db, productCollection } from "../../name";
import { databases } from "../config";

export default async function createProductCollection() {
  try {
    // create collection
    await databases.createCollection(db, productCollection, productCollection, [
      Permission.read("any"),
      Permission.create("team:admin"),
      Permission.update("team:admin"),
      Permission.delete("team:admin"),
    ]);
    console.log("Product collection is created");

    // creating attributes
    await Promise.all([
      // Basic Info
      databases.createStringAttribute(db, productCollection, "name", 255, true),
      databases.createStringAttribute(
        db,
        productCollection,
        "description",
        5000,
        true
      ),
      databases.createStringAttribute(
        db,
        productCollection,
        "shortDescription",
        255,
        false
      ),
      databases.createStringAttribute(db, productCollection, "slug", 255, true),

      // Images
      databases.createStringAttribute(
        db,
        productCollection,
        "mainImage",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        productCollection,
        "images",
        10000,
        false
      ), // JSON array of image URLs

      // Pricing
      databases.createFloatAttribute(db, productCollection, "price", true),
      databases.createFloatAttribute(
        db,
        productCollection,
        "discountedPrice",
        false
      ),
      databases.createFloatAttribute(
        db,
        productCollection,
        "discountPercentage",
        false
      ),

      // Categorization
      databases.createStringAttribute(
        db,
        productCollection,
        "categoryId",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        productCollection,
        "brand",
        255,
        true
      ),

      // Attributes
      databases.createStringAttribute(
        db,
        productCollection,
        "sizes",
        1000,
        false
      ), // JSON array of available sizes
      databases.createStringAttribute(
        db,
        productCollection,
        "colors",
        1000,
        false
      ), // JSON array of available colors
      databases.createStringAttribute(
        db,
        productCollection,
        "specifications",
        5000,
        false
      ), // JSON object of specs

      // Inventory
      databases.createIntegerAttribute(db, productCollection, "stock", true),
      databases.createIntegerAttribute(
        db,
        productCollection,
        "lowStockThreshold",
        false,
        5
      ),
      databases.createBooleanAttribute(
        db,
        productCollection,
        "isOutOfStock",
        true
      ),
      databases.createBooleanAttribute(
        db,
        productCollection,
        "trackInventory",
        true
      ),

      // SEO
      databases.createStringAttribute(
        db,
        productCollection,
        "metaTitle",
        255,
        false
      ),
      databases.createStringAttribute(
        db,
        productCollection,
        "metaDescription",
        1000,
        false
      ),
      databases.createStringAttribute(
        db,
        productCollection,
        "keywords",
        500,
        false
      ),

      // Status
      databases.createBooleanAttribute(
        db,
        productCollection,
        "isPublished",
        true
      ),
      databases.createBooleanAttribute(
        db,
        productCollection,
        "isFeatured",
        false
      ),

      // Stats
      databases.createIntegerAttribute(
        db,
        productCollection,
        "viewCount",
        false,
        0
      ),
      databases.createFloatAttribute(
        db,
        productCollection,
        "averageRating",
        false
      ),
      databases.createIntegerAttribute(
        db,
        productCollection,
        "reviewCount",
        false,
        0
      ),

      // Timestamps
      databases.createDatetimeAttribute(
        db,
        productCollection,
        "createdAt",
        true
      ),
      databases.createDatetimeAttribute(
        db,
        productCollection,
        "updatedAt",
        false
      ),
    ]);
    console.log("Product attributes created");

    // create indexes
    await Promise.all([
      // Main indexes
      databases.createIndex(db, productCollection, "slug_idx", IndexType.Key, [
        "slug",
      ]),
      databases.createIndex(
        db,
        productCollection,
        "category_idx",
        IndexType.Key,
        ["categoryId"]
      ),

      // Search indexes
      databases.createIndex(
        db,
        productCollection,
        "name_idx",
        IndexType.Fulltext,
        ["name"]
      ),
      databases.createIndex(
        db,
        productCollection,
        "description_idx",
        IndexType.Fulltext,
        ["description"]
      ),

      // Filter indexes
      databases.createIndex(db, productCollection, "price_idx", IndexType.Key, [
        "price",
      ]),
      databases.createIndex(db, productCollection, "brand_idx", IndexType.Key, [
        "brand",
      ]),
      databases.createIndex(
        db,
        productCollection,
        "status_idx",
        IndexType.Key,
        ["isPublished", "isFeatured"]
      ),

      // Stats indexes
      databases.createIndex(
        db,
        productCollection,
        "rating_idx",
        IndexType.Key,
        ["averageRating"]
      ),
      databases.createIndex(db, productCollection, "views_idx", IndexType.Key, [
        "viewCount",
      ]),
    ]);
    console.log("Product indexes created");
  } catch (error) {
    console.error("Error creating product collection:", error);
    throw error;
  }
}
