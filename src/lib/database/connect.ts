import "server-only";
import mongoose from "mongoose";
import { requireEnv } from "@/lib/env";

const globalMongoose = globalThis as unknown as { mongooseConnection?: { connection: typeof mongoose | null; promise: Promise<typeof mongoose> | null } };
const cached = globalMongoose.mongooseConnection ?? { connection: null, promise: null };
globalMongoose.mongooseConnection = cached;

export async function connectDatabase() {
  if (cached.connection) return cached.connection;
  cached.promise ??= mongoose.connect(requireEnv("MONGODB_URI"), { bufferCommands: false, maxPoolSize: 8, minPoolSize: 0, serverSelectionTimeoutMS: 5000 });
  try { cached.connection = await cached.promise; return cached.connection; } catch (error) { cached.promise = null; throw error; }
}
