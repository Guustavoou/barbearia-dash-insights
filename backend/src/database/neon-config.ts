import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure WebSocket support for Node.js
neonConfig.webSocketConstructor = ws;

// Database connection string - will be set via environment variable
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create neon SQL function for simple queries
export const sql = neon(DATABASE_URL);

// Create connection pool for more complex operations
export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: true,
});

// Test connection function with fallback
export async function testConnection() {
  try {
    // Try to connect with a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Connection timeout")), 5000);
    });

    const connectionPromise = sql`SELECT NOW() as timestamp`;

    const result = await Promise.race([connectionPromise, timeoutPromise]);
    console.log(
      "✅ Neon database connected successfully:",
      result[0].timestamp,
    );
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to Neon database:", error);
    console.log("⚠️  Continuing with mock data fallback...");
    return false; // Return false but don't exit - continue with mock data
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Closing Neon database connections...");
  await pool.end();
});

process.on("SIGINT", async () => {
  console.log("Closing Neon database connections...");
  await pool.end();
});

export default sql;
