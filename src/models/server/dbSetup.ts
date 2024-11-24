import { db } from "../name";
import { databases } from "./config";
import createBannerCollection from "./collections/banner.collection";
import createProductCollection from "./collections/product.collection";
import createCategoryCollection from "./collections/category.collection";
import createOrderCollection from "./collections/order.collection";
import createReviewCollection from "./collections/review.collection";
import createFavoriteCollection from "./collections/favorite.collection";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database connected");
  } catch {
    try {
      await databases.create(db, db);
      console.log("Database created");

      // Create collections
      await Promise.all([
        createBannerCollection(),
        createProductCollection(),
        createCategoryCollection(),
        createOrderCollection(),
        createReviewCollection(),
        createFavoriteCollection(),
      ]);

      console.log("Collections created");
      console.log("Database setup completed");
    } catch (error) {
      console.error("Error creating database or collections:", error);
      throw error;
    }
  }

  return databases;
}
