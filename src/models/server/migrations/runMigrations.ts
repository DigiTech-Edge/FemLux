import { MigrationManager } from "./migrationManager";
import { orderCollection } from "../../name";
import {
  addGiftMessageMigration,
  addEstimatedDeliveryMigration,
} from "./examples/orderMigrations";

async function runMigrations() {
  try {
    const migrationManager = new MigrationManager();

    // Register migrations for order collection
    migrationManager.registerMigration(orderCollection, addGiftMessageMigration);
    migrationManager.registerMigration(orderCollection, addEstimatedDeliveryMigration);

    // Optional: Create backup before migration
    console.log("Creating backup...");
    const backup = await migrationManager.backupCollection(orderCollection);
    console.log("Backup created");

    try {
      // Run migrations
      await migrationManager.migrateCollection(orderCollection, "Orders");
      console.log("Migrations completed successfully");
    } catch (error) {
      // If migration fails, restore from backup
      console.error("Migration failed:", error);
      console.log("Restoring from backup...");
      await migrationManager.restoreCollection(orderCollection, backup);
      console.log("Restore completed");
      throw error;
    }
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();
