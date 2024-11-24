import { Client, Databases, Storage, Users } from "node-appwrite";
import env from "@/env";

const client = new Client();

client
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId)
  .setKey(env.appwrite.apikey);

const databases = new Databases(client);
const storage = new Storage(client);
const users = new Users(client);

export { client, databases, users, storage };
