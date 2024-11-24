import { Permission, IndexType } from "node-appwrite";
import { db, orderCollection } from "../../name";
import { databases } from "../config";

export default async function createOrderCollection() {
  try {
    // create collection
    await databases.createCollection(db, orderCollection, orderCollection, [
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);
    console.log("Order collection is created");

    // creating attributes
    await Promise.all([
      // User Info
      databases.createStringAttribute(db, orderCollection, "userId", 255, true),
      databases.createStringAttribute(db, orderCollection, "email", 255, true),

      // Order Details
      databases.createStringAttribute(
        db,
        orderCollection,
        "orderNumber",
        50,
        true
      ),
      databases.createEnumAttribute(
        db,
        orderCollection,
        "status",
        [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "returned",
          "refunded",
        ],
        true
      ),
      databases.createStringAttribute(
        db,
        orderCollection,
        "items",
        10000,
        true
      ), // JSON array of order items

      // Payment Info
      databases.createStringAttribute(
        db,
        orderCollection,
        "paymentMethod",
        50,
        true
      ),
      databases.createEnumAttribute(
        db,
        orderCollection,
        "paymentStatus",
        ["pending", "completed", "failed", "refunded"],
        true
      ),
      databases.createStringAttribute(
        db,
        orderCollection,
        "transactionId",
        255,
        false
      ),
      databases.createStringAttribute(
        db,
        orderCollection,
        "paymentIntentId",
        255,
        false
      ),

      // Amounts
      databases.createFloatAttribute(db, orderCollection, "subtotal", true),
      databases.createFloatAttribute(db, orderCollection, "tax", true),
      databases.createFloatAttribute(db, orderCollection, "shippingCost", true),
      databases.createFloatAttribute(db, orderCollection, "discount", false),
      databases.createFloatAttribute(db, orderCollection, "total", true),

      // Shipping Info
      databases.createStringAttribute(
        db,
        orderCollection,
        "shippingMethod",
        50,
        true
      ),
      databases.createStringAttribute(
        db,
        orderCollection,
        "shippingAddress",
        1000,
        true
      ),
      databases.createStringAttribute(
        db,
        orderCollection,
        "billingAddress",
        1000,
        true
      ),
      databases.createStringAttribute(
        db,
        orderCollection,
        "contactNumber",
        20,
        true
      ),
      databases.createStringAttribute(
        db,
        orderCollection,
        "trackingNumber",
        100,
        false
      ),
      databases.createStringAttribute(
        db,
        orderCollection,
        "trackingUrl",
        255,
        false
      ),

      // Customer Notes
      databases.createStringAttribute(
        db,
        orderCollection,
        "customerNotes",
        1000,
        false
      ),
      databases.createStringAttribute(
        db,
        orderCollection,
        "adminNotes",
        1000,
        false
      ),

      // Dates
      databases.createDatetimeAttribute(db, orderCollection, "orderDate", true),
      databases.createDatetimeAttribute(
        db,
        orderCollection,
        "processedDate",
        false
      ),
      databases.createDatetimeAttribute(
        db,
        orderCollection,
        "shippedDate",
        false
      ),
      databases.createDatetimeAttribute(
        db,
        orderCollection,
        "deliveredDate",
        false
      ),
      databases.createDatetimeAttribute(
        db,
        orderCollection,
        "cancelledDate",
        false
      ),
      databases.createDatetimeAttribute(
        db,
        orderCollection,
        "refundedDate",
        false
      ),
      databases.createDatetimeAttribute(
        db,
        orderCollection,
        "updatedAt",
        false
      ),
    ]);
    console.log("Order attributes created");

    // create indexes
    await Promise.all([
      // Main indexes
      databases.createIndex(db, orderCollection, "user_idx", IndexType.Key, [
        "userId",
      ]),
      databases.createIndex(
        db,
        orderCollection,
        "order_number_idx",
        IndexType.Key,
        ["orderNumber"]
      ),

      // Status indexes
      databases.createIndex(
        db,
        orderCollection,
        "order_status_idx",
        IndexType.Key,
        ["status"]
      ),
      databases.createIndex(
        db,
        orderCollection,
        "payment_status_idx",
        IndexType.Key,
        ["paymentStatus"]
      ),

      // Date indexes
      databases.createIndex(
        db,
        orderCollection,
        "order_date_idx",
        IndexType.Key,
        ["orderDate"]
      ),
      databases.createIndex(
        db,
        orderCollection,
        "delivery_date_idx",
        IndexType.Key,
        ["deliveredDate"]
      ),

      // Payment indexes
      databases.createIndex(
        db,
        orderCollection,
        "transaction_idx",
        IndexType.Key,
        ["transactionId"]
      ),
      databases.createIndex(
        db,
        orderCollection,
        "payment_intent_idx",
        IndexType.Key,
        ["paymentIntentId"]
      ),
    ]);
    console.log("Order indexes created");
  } catch (error) {
    console.error("Error creating order collection:", error);
    throw error;
  }
}
