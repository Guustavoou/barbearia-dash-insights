import { Router } from "express";
import {
  getBusinessReports,
  getSalesPerformance,
  getProfessionalPerformance,
  getClientAnalysis,
  getAppointmentTrends,
  getFinancialAnalysis,
  getInventoryReport,
  exportReportData,
} from "../../controllers/neon/reportsController";

const router = Router();

// Business overview reports
router.get("/business", getBusinessReports);

// Sales performance reports
router.get("/sales", getSalesPerformance);

// Professional performance reports
router.get("/professionals", getProfessionalPerformance);

// Client analysis reports
router.get("/clients", getClientAnalysis);

// Appointment trends reports
router.get("/appointments", getAppointmentTrends);

// Financial analysis reports
router.get("/financial", getFinancialAnalysis);

// Inventory reports
router.get("/inventory", getInventoryReport);

// Export report data
router.get("/export", exportReportData);

export default router;
