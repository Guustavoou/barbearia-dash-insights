import { Router } from "express";
import {
  getDashboardStats,
  getRevenueData,
  getTopServices,
  getUpcomingAppointments,
  getBirthdaysThisMonth,
  getQuickInsights,
} from "../controllers/dashboardController";
import { asyncHandler } from "../middleware";

const router = Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get("/stats", asyncHandler(getDashboardStats));

// GET /api/dashboard/revenue - Get revenue data for charts
router.get("/revenue", asyncHandler(getRevenueData));

// GET /api/dashboard/top-services - Get top services
router.get("/top-services", asyncHandler(getTopServices));

// GET /api/dashboard/upcoming-appointments - Get upcoming appointments
router.get("/upcoming-appointments", asyncHandler(getUpcomingAppointments));

// GET /api/dashboard/birthdays - Get birthdays this month
router.get("/birthdays", asyncHandler(getBirthdaysThisMonth));

// GET /api/dashboard/insights - Get quick insights
router.get("/insights", asyncHandler(getQuickInsights));

export default router;
