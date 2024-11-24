import { Models } from "node-appwrite";
import { databases } from "../config";
import { db } from "../../name";
import { MigrationContext, Migration } from "./types";

type AppwriteError = {
  message: string;
  code: number;
};

type AppwriteAttribute = Models.AttributeString | 
  Models.AttributeInteger | 
  Models.AttributeFloat | 
  Models.AttributeBoolean | 
  Models.AttributeEmail | 
  Models.AttributeEnum | 
  Models.AttributeUrl | 
  Models.AttributeIp | 
  Models.AttributeDatetime;

interface AttributeList extends Models.AttributeList {
  attributes: AppwriteAttribute[];
}

export class MigrationManager {
  private migrations: Map<string, Migration[]> = new Map();
  private versionKey = "schema_version";

  constructor() {
    // Initialize migrations map for each collection
  }

  registerMigration(collectionId: string, migration: Migration) {
    if (!this.migrations.has(collectionId)) {
      this.migrations.set(collectionId, []);
    }
    const migrations = this.migrations.get(collectionId)!;
    migrations.push(migration);
    migrations.sort((a, b) => a.version - b.version);
  }

  async getCurrentVersion(collectionId: string): Promise<number> {
    try {
      await databases.getCollection(db, collectionId);
      const attributesResponse = await databases.listAttributes(db, collectionId) as AttributeList;
      
      // Check if version attribute exists
      const attributes = attributesResponse.attributes as unknown as AppwriteAttribute[];
      const versionAttr = attributes.find(
        (attr) => attr.key === this.versionKey
      );

      if (!versionAttr) {
        // Create version attribute if it doesn't exist
        await databases.createIntegerAttribute(
          db,
          collectionId,
          this.versionKey,
          true,
          0
        );
        return 0;
      }

      // Get the first document to check version
      const docs = await databases.listDocuments(db, collectionId);

      if (docs.documents.length === 0) return 0;
      return docs.documents[0][this.versionKey] || 0;
    } catch (error) {
      const appwriteError = error as AppwriteError;
      console.error("Error getting current version:", appwriteError.message);
      return 0;
    }
  }

  async migrateCollection(
    collectionId: string,
    collectionName: string,
    targetVersion?: number
  ) {
    const migrations = this.migrations.get(collectionId) || [];
    if (migrations.length === 0) {
      console.log(`No migrations found for collection ${collectionName}`);
      return;
    }

    const currentVersion = await this.getCurrentVersion(collectionId);
    const maxVersion = Math.max(...migrations.map((m) => m.version));
    targetVersion = targetVersion || maxVersion;

    console.log(`Current version: ${currentVersion}`);
    console.log(`Target version: ${targetVersion}`);

    const context: MigrationContext = {
      collectionId,
      collectionName,
      currentVersion,
      targetVersion,
    };

    if (currentVersion === targetVersion) {
      console.log(`Collection ${collectionName} is already at version ${targetVersion}`);
      return;
    }

    if (currentVersion > targetVersion) {
      // Downgrade
      console.log(`Downgrading ${collectionName} from version ${currentVersion} to ${targetVersion}`);
      for (let i = migrations.length - 1; i >= 0; i--) {
        const migration = migrations[i];
        if (migration.version <= currentVersion && migration.version > targetVersion) {
          console.log(`Running down migration: ${migration.description}`);
          await migration.down(context);
        }
      }
    } else {
      // Upgrade
      console.log(`Upgrading ${collectionName} from version ${currentVersion} to ${targetVersion}`);
      for (const migration of migrations) {
        if (migration.version > currentVersion && migration.version <= targetVersion) {
          console.log(`Running up migration: ${migration.description}`);
          await migration.up(context);
        }
      }
    }

    // Update version
    await this.updateVersion(collectionId, targetVersion);
    console.log(`Migration completed for ${collectionName}`);
  }

  private async updateVersion(collectionId: string, version: number) {
    try {
      const docs = await databases.listDocuments(db, collectionId);
      await Promise.all(
        docs.documents.map((doc) =>
          databases.updateDocument(db, collectionId, doc.$id, {
            [this.versionKey]: version,
          })
        )
      );
    } catch (error) {
      const appwriteError = error as AppwriteError;
      console.error("Error updating version:", appwriteError.message);
      throw error;
    }
  }

  async backupCollection(collectionId: string): Promise<{
    schema: Models.Collection;
    data: Models.Document[];
  }> {
    const collection = await databases.getCollection(db, collectionId);
    const documents = await databases.listDocuments(db, collectionId);
    return {
      schema: collection,
      data: documents.documents,
    };
  }

  async restoreCollection(
    collectionId: string,
    backup: { schema: Models.Collection; data: Models.Document[] }
  ) {
    try {
      // Recreate collection
      await databases.deleteCollection(db, collectionId);
      await databases.createCollection(
        db,
        collectionId,
        backup.schema.$id,
        backup.schema.$permissions
      );

      // Restore data
      await Promise.all(
        backup.data.map((doc) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { $id, $createdAt, $updatedAt, ...data } = doc;
          return databases.createDocument(db, collectionId, $id, data);
        })
      );
    } catch (error) {
      const appwriteError = error as AppwriteError;
      console.error("Error restoring collection:", appwriteError.message);
      throw error;
    }
  }
}
