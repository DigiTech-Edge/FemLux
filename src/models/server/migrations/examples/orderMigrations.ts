import { databases } from "../../config";
import { db } from "../../../name";
import { Migration } from "../types";

// Example migration: Add gift message field to orders
export const addGiftMessageMigration: Migration = {
  version: 1,
  description: "Add gift message field to orders",
  up: async (context) => {
    try {
      // Add new gift message field
      await databases.createStringAttribute(
        db,
        context.collectionId,
        "giftMessage",
        1000,
        false
      );
      console.log("Added gift message field");
    } catch (error) {
      console.error("Error in up migration:", error);
      throw error;
    }
  },
  down: async (context) => {
    try {
      // Remove gift message field
      await databases.deleteAttribute(db, context.collectionId, "giftMessage");
      console.log("Removed gift message field");
    } catch (error) {
      console.error("Error in down migration:", error);
      throw error;
    }
  },
};

// Example migration: Add estimated delivery date
export const addEstimatedDeliveryMigration: Migration = {
  version: 2,
  description: "Add estimated delivery date field",
  up: async (context) => {
    try {
      // Add estimated delivery date field
      await databases.createDatetimeAttribute(
        db,
        context.collectionId,
        "estimatedDeliveryDate",
        false
      );
      console.log("Added estimated delivery date field");
    } catch (error) {
      console.error("Error in up migration:", error);
      throw error;
    }
  },
  down: async (context) => {
    try {
      // Remove estimated delivery date field
      await databases.deleteAttribute(
        db,
        context.collectionId,
        "estimatedDeliveryDate"
      );
      console.log("Removed estimated delivery date field");
    } catch (error) {
      console.error("Error in down migration:", error);
      throw error;
    }
  },
};
