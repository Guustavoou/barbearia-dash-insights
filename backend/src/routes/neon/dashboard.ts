import { Router } from "express";
import {
  getDashboardStats,
  getRevenueData,
  getTopServices,
  getUpcomingAppointments,
  getBirthdaysThisMonth,
  getQuickInsights,
  getFinancialMetrics,
  getOperationalMetrics,
} from "../../controllers/neon/dashboardController";

const router = Router();

// Dashboard routes
router.get("/stats", getDashboardStats);
router.get("/revenue", getRevenueData);
router.get("/top-services", getTopServices);
router.get("/upcoming-appointments", getUpcomingAppointments);
router.get("/birthdays", getBirthdaysThisMonth);
router.get("/insights", getQuickInsights);

// New advanced metrics routes
router.get("/financial-metrics", getFinancialMetrics);
router.get("/operational-metrics", getOperationalMetrics);

export default router;
