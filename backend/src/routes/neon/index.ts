import { Router } from "express";
import { sql } from "../../database/neon-config";
import neonClientsRoutes from "./clients";
import neonDashboardRoutes from "./dashboard";

const router = Router();

// Health check endpoint with Neon database test
router.get("/health", async (req, res) => {
  try {
    // Test database connection
    const result =
      await sql`SELECT NOW() as timestamp, 'Neon PostgreSQL' as database`;

    res.json({
      success: true,
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        type: "Neon PostgreSQL",
        status: "connected",
        server_time: result[0].timestamp,
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// API routes
router.use("/clients", neonClientsRoutes);
router.use("/dashboard", neonDashboardRoutes);

// Placeholder routes for other modules (to be implemented)
router.get("/appointments", (req, res) => {
  res.json({
    success: true,
    message: "Appointments API - Coming soon with Neon PostgreSQL",
    data: [],
  });
});

router.get("/services", (req, res) => {
  res.json({
    success: true,
    message: "Services API - Coming soon with Neon PostgreSQL",
    data: [],
  });
});

router.get("/professionals", (req, res) => {
  res.json({
    success: true,
    message: "Professionals API - Coming soon with Neon PostgreSQL",
    data: [],
  });
});

router.get("/products", (req, res) => {
  res.json({
    success: true,
    message: "Products API - Coming soon with Neon PostgreSQL",
    data: [],
  });
});

router.get("/financial", (req, res) => {
  res.json({
    success: true,
    message: "Financial API - Coming soon with Neon PostgreSQL",
    data: [],
  });
});

export default router;
