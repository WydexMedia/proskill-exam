import dns from "node:dns";
// Try to use reliable DNS servers, but fall back to system default if blocked
try {
  dns.setServers(['1.1.1.1', '8.8.8.8']); // Cloudflare DNS and Google DNS
} catch (err) {
  console.warn("Could not set custom DNS servers, using system default:", err);
}

import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI || "";

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 15000, // 15 seconds timeout for server selection (increased from 10s)
  connectTimeoutMS: 15000, // 15 seconds timeout for initial connection (increased from 10s)
  socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 1, // Minimum number of connections in the pool
  retryWrites: true, // Enable retryable writes
  retryReads: true, // Enable retryable reads
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect().catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error("MongoDB connection error:", err);
    throw err;
  });
}

export default clientPromise;
