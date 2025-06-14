import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Import middleware
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
  rateLimit,
  corsHeaders,
  sanitizeRequest,
  apiVersion,
  responseTime,
  validateContentType,
  limitRequestSize,
  securityHeaders,
  checkDbConnection,
} from "./middleware";

// Import routes - using Neon PostgreSQL
import neonApiRoutes from "./routes/neon";

// Initialize Neon database
import { testConnection } from "./database/neon-config";

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Trust proxy if behind reverse proxy (for rate limiting and IP detection)
app.set("trust proxy", 1);

// Security headers
app.use(securityHeaders);

// Helmet for additional security
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Disable CSP for API
  }),
);

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.CORS_ORIGIN || "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5174",
      "http://localhost:8080", // Vite dev server
      "http://127.0.0.1:5173",
      "http://127.0.0.1:8080",
      // Allow fly.dev domains
      /\.fly\.dev$/,
    ];

    // Check if origin is in allowed list or matches fly.dev pattern
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed || NODE_ENV === "development") {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(corsHeaders);

// Request logging
if (NODE_ENV === "development") {
  app.use(requestLogger);
}

// Response time tracking
app.use(responseTime);

// API version header
app.use(apiVersion("1.0.0"));

// Rate limiting (more permissive in development)
if (NODE_ENV === "production") {
  app.use(rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes
} else {
  app.use(rateLimit(1000, 15 * 60 * 1000)); // 1000 requests per 15 minutes in dev
}

// Request size limiting
app.use(limitRequestSize("10mb"));

// Content type validation for POST/PUT requests
app.use(validateContentType(["application/json", "multipart/form-data"]));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request sanitization
app.use(sanitizeRequest);

// Database connection check
app.use("/api", checkDbConnection);

// Serve static files (uploads)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"), {
    maxAge: "1d",
    etag: true,
  }),
);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Unclic API Server - Neon PostgreSQL Edition",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: "Neon PostgreSQL",
    endpoints: {
      health: "/api/health",
      clients: "/api/clients",
      appointments: "/api/appointments",
      services: "/api/services",
      professionals: "/api/professionals",
      products: "/api/products",
      dashboard: "/api/dashboard",
      financial: "/api/financial",
    },
  });
});

// API routes - Neon PostgreSQL
app.use("/api", neonApiRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 Unclic Backend Server Started!

📊 Environment: ${NODE_ENV}
🌐 Port: ${PORT}
🔗 URL: http://localhost:${PORT}
🏥 Health: http://localhost:${PORT}/api/health
📚 API Docs: http://localhost:${PORT}

🔧 Database: SQLite (${NODE_ENV === "development" ? "development" : "production"})
🔒 CORS Origin: ${process.env.CORS_ORIGIN || "http://localhost:5173"}

Ready to serve requests! 🎉
  `);
});

// Server timeout configuration
server.timeout = 30000; // 30 seconds
server.keepAliveTimeout = 5000; // 5 seconds
server.headersTimeout = 6000; // 6 seconds

export default app;
