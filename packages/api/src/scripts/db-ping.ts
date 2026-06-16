import { loadDotenv } from "../config/load-dotenv.js";
loadDotenv();

import mongoose from "mongoose";
import { loadEnv } from "../config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
  getConnectionState,
} from "../config/database.js";

/** Quick connectivity check — run with: pnpm db:ping */
async function ping(): Promise<void> {
  const env = loadEnv();

  console.log("[db] Connecting to:", env.MONGODB_URI);
  await connectDatabase(env);

  const pingResult = await mongoose.connection.db!.admin().ping();
  const collections = await mongoose.connection.db!.listCollections().toArray();

  console.log("[db] Ping:", pingResult);
  console.log("[db] State:", getConnectionState());
  console.log("[db] Database:", mongoose.connection.db!.databaseName);
  console.log(
    "[db] Collections:",
    collections.length ? collections.map((c) => c.name).join(", ") : "(empty)",
  );

  await disconnectDatabase();
  console.log("[db] Connection test passed.");
}

ping().catch((err) => {
  console.error("[db] Connection test failed:", err.message);
  process.exit(1);
});
