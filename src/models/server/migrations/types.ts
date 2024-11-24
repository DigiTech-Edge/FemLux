import { Models } from "node-appwrite";

export interface MigrationContext {
  collectionId: string;
  collectionName: string;
  currentVersion: number;
  targetVersion: number;
}

export interface Migration {
  version: number;
  description: string;
  up: (context: MigrationContext) => Promise<void>;
  down: (context: MigrationContext) => Promise<void>;
}

export interface CollectionAttribute {
  key: string;
  type: string;
  size?: number;
  required?: boolean;
  array?: boolean;
  elements?: string[];
  min?: number;
  max?: number;
  default?: string | number | boolean | null;
}

export interface CollectionSchema {
  version: number;
  attributes: CollectionAttribute[];
  indexes: Models.IndexList[];
}
