import { Router } from "express";
import {
  getDashboardStats,
  getRevenueData,
  getTopServices,
  getUpcomingAppointments,
  getBirthdaysThisMonth,
  getQuickInsights,
} from "../../controllers/neon/dashboardController";

const router = Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get("/stats", getDashboardStats);

// GET /api/dashboard/revenue - Get revenue data for charts
router.get("/revenue", getRevenueData);

// GET /api/dashboard/top-services - Get top performing services
router.get("/top-services", getTopServices);

// GET /api/dashboard/upcoming-appointments - Get upcoming appointments
router.get("/upcoming-appointments", getUpcomingAppointments);

// GET /api/dashboard/birthdays - Get clients with birthdays this month
router.get("/birthdays", getBirthdaysThisMonth);

// GET /api/dashboard/insights - Get business insights
router.get("/insights", getQuickInsights);

export default router;
