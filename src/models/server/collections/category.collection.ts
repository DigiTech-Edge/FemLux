import { Permission, IndexType } from "node-appwrite";
import { db, categoryCollection } from "../../name";
import { databases } from "../config";

export default async function createCategoryCollection() {
  try {
    // create collection
    await databases.createCollection(
      db,
      categoryCollection,
      categoryCollection,
      [
        Permission.read("any"),
        Permission.create("team:admin"),
        Permission.update("team:admin"),
        Permission.delete("team:admin"),
      ]
    );
    console.log("Category collection is created");

    // creating attributes
    await Promise.all([
      // Basic Info
      databases.createStringAttribute(
        db,
        categoryCollection,
        "name",
        255,
        true
      ),
      databases.createStringAttribute(
        db,
        categoryCollection,
        "description",
        1000,
        false
      ),
      databases.createStringAttribute(
        db,
        categoryCollection,
        "slug",
        255,
        true
      ),

      // Images
      databases.createStringAttribute(
        db,
        categoryCollection,
        "image",
        255,
        false
      ),
      databases.createStringAttribute(
        db,
        categoryCollection,
        "icon",
        255,
        false
      ),

      // Hierarchy
      databases.createStringAttribute(
        db,
        categoryCollection,
        "parentId",
        255,
        false
      ),
      databases.createIntegerAttribute(
        db,
        categoryCollection,
        "level",
        false,
        1
      ),
      databases.createIntegerAttribute(db, categoryCollection, "order", false),

      // SEO
      databases.createStringAttribute(
        db,
        categoryCollection,
        "metaTitle",
        255,
        false
      ),
      databases.createStringAttribute(
        db,
        categoryCollection,
        "metaDescription",
        1000,
        false
      ),
      databases.createStringAttribute(
        db,
        categoryCollection,
        "keywords",
        500,
        false
      ),

      // Status
      databases.createBooleanAttribute(
        db,
        categoryCollection,
        "isActive",
        true
      ),
      databases.createBooleanAttribute(
        db,
        categoryCollection,
        "showInMenu",
        true
      ),
      databases.createBooleanAttribute(
        db,
        categoryCollection,
        "isFeatured",
        false
      ),

      // Stats
      databases.createIntegerAttribute(
        db,
        categoryCollection,
        "productCount",
        false,
        0
      ),
      databases.createIntegerAttribute(
        db,
        categoryCollection,
        "viewCount",
        false,
        0
      ),

      // Timestamps
      databases.createDatetimeAttribute(
        db,
        categoryCollection,
        "createdAt",
        true
      ),
      databases.createDatetimeAttribute(
        db,
        categoryCollection,
        "updatedAt",
        false
      ),
    ]);
    console.log("Category attributes created");

    // create indexes
    await Promise.all([
      // Main indexes
      databases.createIndex(db, categoryCollection, "slug_idx", IndexType.Key, [
        "slug",
      ]),
      databases.createIndex(
        db,
        categoryCollection,
        "parent_idx",
        IndexType.Key,
        ["parentId"]
      ),

      // Search indexes
      databases.createIndex(
        db,
        categoryCollection,
        "name_idx",
        IndexType.Fulltext,
        ["name"]
      ),

      // Filter indexes
      databases.createIndex(
        db,
        categoryCollection,
        "hierarchy_idx",
        IndexType.Key,
        ["level", "order"]
      ),
      databases.createIndex(
        db,
        categoryCollection,
        "status_idx",
        IndexType.Key,
        ["isActive", "showInMenu"]
      ),

      // Stats indexes
      databases.createIndex(
        db,
        categoryCollection,
        "product_count_idx",
        IndexType.Key,
        ["productCount"]
      ),
    ]);
    console.log("Category indexes created");
  } catch (error) {
    console.error("Error creating category collection:", error);
    throw error;
  }
}
