import { Router } from "express";
import { sql } from "../database/neon-config";

// Import Neon controllers
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
  getClientBirthdays,
} from "../controllers/neon/clientsController";

import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
  getAvailableSlots,
} from "../controllers/neon/appointmentsController";

import {
  getDashboardStats,
  getRevenueData,
  getTopServices,
  getUpcomingAppointments,
  getBirthdaysThisMonth,
  getQuickInsights,
} from "../controllers/neon/dashboardController";

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

// Client routes
router.get("/clients", getClients);
router.get("/clients/stats", getClientStats);
router.get("/clients/birthdays", getClientBirthdays);
router.get("/clients/:id", getClientById);
router.post("/clients", createClient);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/revenue", getRevenueData);
router.get("/dashboard/top-services", getTopServices);
router.get("/dashboard/upcoming-appointments", getUpcomingAppointments);
router.get("/dashboard/birthdays", getBirthdaysThisMonth);
router.get("/dashboard/insights", getQuickInsights);

// Appointment routes
router.get("/appointments", getAppointments);
router.get("/appointments/stats", getAppointmentStats);
router.get("/appointments/available-slots", getAvailableSlots);
router.get("/appointments/:id", getAppointmentById);
router.post("/appointments", createAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

router.get("/services", (req, res) => {
  res.json({
    success: true,
    message: "Services API - Coming soon with Neon PostgreSQL",
    data: [],
    note: "Will be implemented once Neon database is configured",
  });
});

router.get("/professionals", (req, res) => {
  res.json({
    success: true,
    message: "Professionals API - Coming soon with Neon PostgreSQL",
    data: [],
    note: "Will be implemented once Neon database is configured",
  });
});

router.get("/products", (req, res) => {
  res.json({
    success: true,
    message: "Products API - Coming soon with Neon PostgreSQL",
    data: [],
    note: "Will be implemented once Neon database is configured",
  });
});

router.get("/financial", (req, res) => {
  res.json({
    success: true,
    message: "Financial API - Coming soon with Neon PostgreSQL",
    data: [],
    note: "Will be implemented once Neon database is configured",
  });
});

export default router;
