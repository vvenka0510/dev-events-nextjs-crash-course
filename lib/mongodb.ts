import mongoose from 'mongoose';

// Define the type for our cached connection
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the global object to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that MongoDB URI is provided
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env file'
  );
}

/**
 * Global cache for the MongoDB connection.
 * This prevents multiple connections from being created during development
 * due to Next.js hot reloading.
 */
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Uses a cached connection if available to prevent multiple connections.
 * 
 * @returns Promise that resolves to the Mongoose instance
 */
async function connectToDatabase(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing connection promise if one is in progress
  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maximum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // Create a new connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI!, options)
      .then((mongooseInstance) => {
        console.log('✅ MongoDB connected successfully');
        return mongooseInstance;
      })
      .catch((error) => {
        // Reset the promise on error so subsequent calls can retry
        cached.promise = null;
        console.error('❌ MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    // Wait for the connection to establish
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
