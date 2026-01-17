import mongoose from "mongoose";

declare global {
  var __mongoose__: typeof mongoose | undefined;
}

// Get MongoDB connection string from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Mongoose connection logic - reuse connection in development
let cached: typeof mongoose | undefined = global.__mongoose__;

if (!cached) {
  cached = global.__mongoose__ = mongoose;
}

async function connectDB() {
  if (cached?.connection?.readyState === 1) {
    return cached;
  }

  try {
    if (!cached?.connection || cached.connection.readyState === 0 || cached.connection.readyState === 3) {
      const opts = {
        bufferCommands: false,
      };

      await cached.connect(databaseUrl, opts);
      console.log("MongoDB connected successfully");
    }
    return cached;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Connect on module load
if (process.env.NODE_ENV !== "test") {
  connectDB().catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
}

export { connectDB, mongoose };
