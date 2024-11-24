import { execSync } from "child_process";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const ENDPOINT = process.env.APPWRITE_ENDPOINT?.replace(/\/$/, "");
const API_KEY = process.env.APPWRITE_API_KEY;

console.log("Database ID:", DATABASE_ID);
console.log("Project ID:", PROJECT_ID);
console.log("Endpoint:", ENDPOINT);
console.log("API Key:", API_KEY);

if (!DATABASE_ID || !PROJECT_ID || !ENDPOINT || !API_KEY) {
  console.error(
    "Error: Required environment variables are not defined in .env file"
  );
  process.exit(1);
}

interface Attribute {
  name: string;
  type: string;
  required: boolean;
  array?: boolean;
  size?: number;
  elements?: string[];
}

interface Index {
  name: string;
  attributes: string[];
  type: "key" | "unique" | "fulltext";
  orders: ("ASC" | "DESC")[];
}

interface Collection {
  name: string;
  attributes: Attribute[];
  indexes: Index[];
}

const collections: Collection[] = [
  {
    name: "users",
    attributes: [
      {
        name: "name",
        type: "string",
        required: true,
        size: 100,
      },
      {
        name: "email",
        type: "string",
        required: true,
        size: 100,
      },
      {
        name: "role",
        type: "string",
        required: true,
        array: true,
        size: 10,
        elements: ["user", "admin"],
      },
      {
        name: "emailVerified",
        type: "boolean",
        required: true,
      },
      {
        name: "avatar",
        type: "string",
        required: false,
        size: 255,
      },
    ],
    indexes: [
      {
        name: "email_idx",
        type: "key",
        attributes: ["email"],
        orders: ["ASC"],
      },
      {
        name: "role_idx",
        type: "key",
        attributes: ["role"],
        orders: ["ASC"],
      },
    ],
  },
];

function executeCommand(command: string, ignoreError = false) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    if (!ignoreError) {
      console.error(`Failed to execute command: ${command}`);
      console.error(error);
      process.exit(1);
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectionExists(collectionId: string): Promise<boolean> {
  const curl = `curl -X GET "${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}" \\
    -H "Content-Type: application/json" \\
    -H "X-Appwrite-Project: ${PROJECT_ID}" \\
    -H "X-Appwrite-Key: ${API_KEY}"`;

  try {
    executeCommand(curl, true);
    return true;
  } catch {
    return false;
  }
}

async function createAttribute(
  collectionId: string,
  attr: Attribute
): Promise<void> {
  const curl = `curl -X POST "${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes/${
    attr.type === "boolean" ? "boolean" : "string"
  }" \\
    -H "Content-Type: application/json" \\
    -H "X-Appwrite-Project: ${PROJECT_ID}" \\
    -H "X-Appwrite-Key: ${API_KEY}" \\
    -d '{
      "key": "${attr.name}",
      "required": ${attr.required},
      "array": ${Boolean(attr.array)}${
    attr.type === "string"
      ? `,
      "size": ${attr.size}`
      : ""
  }${
    attr.elements
      ? `,
      "elements": ${JSON.stringify(attr.elements)}`
      : ""
  }
    }'`;

  executeCommand(curl);
  await sleep(2000); // Wait for the attribute to be created
}

async function createIndex(collectionId: string, idx: Index): Promise<void> {
  const curl = `curl -X POST "${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/indexes" \\
    -H "Content-Type: application/json" \\
    -H "X-Appwrite-Project: ${PROJECT_ID}" \\
    -H "X-Appwrite-Key: ${API_KEY}" \\
    -d '{
      "key": "${idx.name}",
      "type": "${idx.type}",
      "attributes": ${JSON.stringify(idx.attributes)},
      "orders": ${JSON.stringify(idx.orders)}
    }'`;

  executeCommand(curl);
  await sleep(2000); // Wait for the index to be created
}

async function addMissingAttributes(
  collectionId: string,
  attributes: Attribute[]
): Promise<void> {
  for (const attr of attributes) {
    console.log(`Checking attribute: ${attr.name}`);
    const curl = `curl -X GET "${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes/${attr.name}" \\
      -H "Content-Type: application/json" \\
      -H "X-Appwrite-Project: ${PROJECT_ID}" \\
      -H "X-Appwrite-Key: ${API_KEY}"`;

    try {
      executeCommand(curl, true);
      console.log(`Attribute ${attr.name} already exists.`);
    } catch {
      console.log(`Creating missing attribute: ${attr.name}`);
      await createAttribute(collectionId, attr);
    }
  }
}

async function addMissingIndexes(
  collectionId: string,
  indexes: Index[]
): Promise<void> {
  for (const idx of indexes) {
    console.log(`Checking index: ${idx.name}`);
    const curl = `curl -X GET "${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/indexes/${idx.name}" \\
      -H "Content-Type: application/json" \\
      -H "X-Appwrite-Project: ${PROJECT_ID}" \\
      -H "X-Appwrite-Key: ${API_KEY}"`;

    try {
      executeCommand(curl, true);
      console.log(`Index ${idx.name} already exists.`);
    } catch {
      console.log(`Creating missing index: ${idx.name}`);
      await createIndex(collectionId, idx);
    }
  }
}

async function main() {
  for (const collection of collections) {
    console.log(`\nProcessing collection: ${collection.name}`);

    const exists = await collectionExists(collection.name);
    console.log(exists);
    if (exists) {
      console.log(
        `Collection ${collection.name} exists. Adding missing attributes and indexes...`
      );
      await addMissingAttributes(collection.name, collection.attributes);
      await addMissingIndexes(collection.name, collection.indexes);
    } else {
      console.log(`Creating new collection: ${collection.name}`);
      executeCommand(
        `appwrite databases create-collection --database-id ${DATABASE_ID} --collection-id ${collection.name} --name "${collection.name}" --document-security false`
      );

      for (const attr of collection.attributes) {
        console.log(`Creating attribute: ${attr.name}`);
        await createAttribute(collection.name, attr);
      }

      for (const idx of collection.indexes) {
        console.log(`Creating index: ${idx.name}`);
        await createIndex(collection.name, idx);
      }
    }
  }

  console.log("\nGenerating TypeScript types...");
  executeCommand(
    `appwrite client --endpoint ${ENDPOINT} --project-id ${PROJECT_ID} --key ${API_KEY}`
  );
  // executeCommand("appwrite client install");
}

main().catch(console.error);
