import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is not defined in environment variables");
}

let cached = (global as any)._mongoCache as { conn?: typeof mongoose } | undefined;
if (!cached) {
  cached = (global as any)._mongoCache = {};
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  await mongoose.connect(MONGODB_URL);
  cached.conn = mongoose;
  return mongoose;
}
