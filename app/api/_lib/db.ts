import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string | undefined;

type Cache = { conn?: typeof mongoose };
const globalAny = global as any;
const cached: Cache = globalAny._mongoCache || (globalAny._mongoCache = {});

export async function connectDB() {
  if (!MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  if (cached.conn) return cached.conn;

  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  await mongoose.connect(MONGODB_URL);
  cached.conn = mongoose;
  return mongoose;
}
