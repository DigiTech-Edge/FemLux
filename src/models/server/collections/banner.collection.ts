import { Permission, IndexType } from "node-appwrite";
import { db, bannerCollection } from "../../name";
import { databases } from "../config";

export default async function createBannerCollection() {
  try {
    // create collection
    await databases.createCollection(db, bannerCollection, bannerCollection, [
      Permission.read("any"),
      Permission.create("team:admin"),
      Permission.update("team:admin"),
      Permission.delete("team:admin"),
    ]);
    console.log("Banner collection is created");

    // creating attributes
    await Promise.all([
      databases.createStringAttribute(db, bannerCollection, "title", 255, true),
      databases.createStringAttribute(db, bannerCollection, "message", 1000, true),
      databases.createStringAttribute(db, bannerCollection, "image", 255, true),
      databases.createStringAttribute(db, bannerCollection, "buttonText", 50, false),
      databases.createStringAttribute(db, bannerCollection, "buttonLink", 255, false),
      databases.createBooleanAttribute(db, bannerCollection, "isActive", true),
      databases.createIntegerAttribute(db, bannerCollection, "order", false),
      databases.createDatetimeAttribute(db, bannerCollection, "startDate", false),
      databases.createDatetimeAttribute(db, bannerCollection, "endDate", false),
      databases.createDatetimeAttribute(db, bannerCollection, "createdAt", true),
      databases.createDatetimeAttribute(db, bannerCollection, "updatedAt", false),
    ]);
    console.log("Banner attributes created");

    // create indexes
    await Promise.all([
      databases.createIndex(db, bannerCollection, "active_order_idx", IndexType.Key, [
        "isActive",
        "order",
      ]),
      databases.createIndex(db, bannerCollection, "date_range_idx", IndexType.Key, [
        "startDate",
        "endDate",
      ]),
    ]);
    console.log("Banner indexes created");
  } catch (error: any) {
    console.error("Error creating banner collection:", error);
    throw error;
  }
}
