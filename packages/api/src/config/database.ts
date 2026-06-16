import mongoose from "mongoose";
import type { Env } from "./env.js";

const DB_NAME = "driven-rewards";

/** Mongoose connection options tuned for local dev and production */
const connectionOptions: mongoose.ConnectOptions = {
  dbName: DB_NAME,
  serverSelectionTimeoutMS: 5_000,
  socketTimeoutMS: 45_000,
  maxPoolSize: 10,
  minPoolSize: 1,
};

let isConnected = false;

/** Returns current MongoDB connection state */
export function getConnectionState(): "connected" | "disconnected" | "connecting" {
  const state = mongoose.connection.readyState;
  if (state === 1) return "connected";
  if (state === 2) return "connecting";
  return "disconnected";
}

/** Connect to MongoDB and register connection event handlers */
export async function connectDatabase(env: Env): Promise<typeof mongoose> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    isConnected = true;
    console.log(`[db] MongoDB connected → ${env.MONGODB_URI} (${DB_NAME})`);
  });

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.log("[db] MongoDB disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB connection error:", err.message);
  });

  await mongoose.connect(env.MONGODB_URI, connectionOptions);
  return mongoose;
}

/** Gracefully disconnect from MongoDB */
export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
  isConnected = false;
}
