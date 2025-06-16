import { Router } from "express";
import { sql } from "../../database/neon-config";
import neonClientsRoutes from "./clients";
import neonDashboardRoutes from "./dashboard";
import neonProfessionalsRoutes from "./professionals";
import neonServicesRoutes from "./services";
import neonAppointmentsRoutes from "./appointments";
import neonProductsRoutes from "./products";
import neonFinancialRoutes from "./financial";
import neonReportsRoutes from "./reports";

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

// API routes - Fully implemented with Neon PostgreSQL
router.use("/clients", neonClientsRoutes);
router.use("/dashboard", neonDashboardRoutes);
router.use("/professionals", neonProfessionalsRoutes);
router.use("/services", neonServicesRoutes);
router.use("/appointments", neonAppointmentsRoutes);
router.use("/products", neonProductsRoutes);
router.use("/financial", neonFinancialRoutes);
router.use("/reports", neonReportsRoutes);

export default router;
